// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
         uint256 amountCollected;
        address[] donors;  // 🆕 Array to store donor addresses
        mapping(address => uint256) donations;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    mapping(uint256 => mapping(address => uint256)) public donations; // Fix: Separate donations mapping

    event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title, uint256 goal, uint256 deadline);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _deadline) public {
        require(_deadline > block.timestamp, "Deadline must be in the future");

         Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = _deadline;
        newCampaign.amountCollected = 0;
        
        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, _deadline);
        campaignCount++;
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        require(_campaignId < campaignCount, "Campaign does not exist");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH");



//added in 9th step
        Campaign storage campaign = campaigns[_campaignId];
        
        // 🆕 Track donor addresses if they haven't donated before
        if (campaign.donations[msg.sender] == 0) {
            campaign.donors.push(msg.sender);
        }

 campaign.donations[msg.sender] += msg.value;
        campaign.amountCollected += msg.value;


        campaigns[_campaignId].amountCollected += msg.value;
        donations[_campaignId][msg.sender] += msg.value; // Fix: Storing donations separately

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }


    function getNumberOfCampaigns() public view returns (uint256) {
        return campaignCount;
    }

    function getCampaign(uint256 _campaignId) public view returns (
        address owner,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 deadline,
        uint256 amountCollected
    ) {
        require(_campaignId < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[_campaignId];
        return (campaign.owner, campaign.title, campaign.description, campaign.goal, campaign.deadline, campaign.amountCollected);
    }

    function getDonationAmount(uint256 _campaignId, address _donor) public view returns (uint256) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return donations[_campaignId][_donor]; // Fix: Using separate mapping
    }

    function refund(uint256 _campaignId) public {
    require(_campaignId < campaignCount, "Campaign does not exist");
    Campaign storage campaign = campaigns[_campaignId];
    require(block.timestamp > campaign.deadline, "Campaign still active");
    require(campaign.amountCollected < campaign.goal, "Campaign was successful");

    uint256 donatedAmount = donations[_campaignId][msg.sender];
    require(donatedAmount > 0, "No donations made");

    donations[_campaignId][msg.sender] = 0;
    payable(msg.sender).transfer(donatedAmount);
}
mapping(uint256 => bool) public fundsWithdrawn;

function withdrawFunds(uint256 _campaignId) public {
    require(_campaignId < campaignCount, "Campaign does not exist");
    Campaign storage campaign = campaigns[_campaignId];

    require(msg.sender == campaign.owner, "Only owner can withdraw");
    require(block.timestamp > campaign.deadline, "Campaign still active");
    require(campaign.amountCollected >= campaign.goal, "Goal not met");
    require(!fundsWithdrawn[_campaignId], "Funds already withdrawn");

    fundsWithdrawn[_campaignId] = true;
    uint256 amount = campaign.amountCollected;
    campaign.amountCollected = 0;

    payable(msg.sender).transfer(amount);
    emit FundsWithdrawn(_campaignId, msg.sender, amount);
}   

function updateCampaign(uint256 _campaignId, string memory _title, string memory _description, uint256 _goal, uint256 _deadline) public {
    require(_campaignId < campaignCount, "Campaign does not exist");
    Campaign storage campaign = campaigns[_campaignId];

    require(msg.sender == campaign.owner, "Only owner can update");
    require(block.timestamp < campaign.deadline, "Campaign expired");
    require(campaign.amountCollected == 0, "Cannot edit after donations");

    campaign.title = _title;
    campaign.description = _description;
    campaign.goal = _goal;
    campaign.deadline = _deadline;
}
mapping(uint256 => bool) public deadlineExtended;

function extendDeadline(uint256 _campaignId, uint256 _newDeadline) public {
    require(_campaignId < campaignCount, "Campaign does not exist");
    Campaign storage campaign = campaigns[_campaignId];

    require(msg.sender == campaign.owner, "Only owner can extend");
    require(!deadlineExtended[_campaignId], "Already extended");
    require(_newDeadline > campaign.deadline, "New deadline must be later");

    deadlineExtended[_campaignId] = true;
    campaign.deadline = _newDeadline;
}

 // 🆕 Function to return all donors for a campaign
    function getDonors(uint256 _campaignId) public view returns (address[] memory) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return campaigns[_campaignId].donors;
    }

}

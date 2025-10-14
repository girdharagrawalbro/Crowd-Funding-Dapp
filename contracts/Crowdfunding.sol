// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract Crowdfunding {
    struct Donor {
        address addr;
        string name;
        uint256 amount; 
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountCollected;
        Donor[] donors;
        mapping(address => uint256) donations;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) private campaigns;

    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => bool) public fundsWithdrawn;
    mapping(uint256 => bool) public deadlineExtended;

    // 🧾 Events
    event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title, uint256 goal, uint256 deadline);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount, string name);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event CampaignUpdated(uint256 indexed campaignId);
    event DeadlineExtended(uint256 indexed campaignId, uint256 newDeadline);

    // 🎯 Create a campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_goal > 0, "Goal must be greater than 0");

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

    // 🤝 Donate to a campaign
    function donateToCampaign(uint256 _campaignId, string memory _name) public payable  {
        require(_campaignId < campaignCount, "Campaign does not exist");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH");

        Campaign storage campaign = campaigns[_campaignId];

        // 🧠 Add new donor to the list
        if (campaign.donations[msg.sender] == 0) {
            campaign.donors.push(Donor(msg.sender, _name, msg.value));
        } else {
            // Update the donor's previous entry amount
            for (uint256 i = 0; i < campaign.donors.length; i++) {
                if (campaign.donors[i].addr == msg.sender) {
                    campaign.donors[i].amount += msg.value;
                    break;
                }
            }
        }

        campaign.donations[msg.sender] += msg.value;
        campaign.amountCollected += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value, _name);
    }

    // 📈 Get campaign details
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
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.deadline,
            campaign.amountCollected
        );
    }

    // 🔍 Get individual donation amount
    function getDonationAmount(uint256 _campaignId, address _donor) public view returns (uint256) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return donations[_campaignId][_donor];
    }

    // 🔁 Refund for failed campaign
    function refund(uint256 _campaignId) public  {
        require(_campaignId < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.deadline, "Campaign still active");
        require(campaign.amountCollected < campaign.goal, "Campaign was successful");

        uint256 donatedAmount = donations[_campaignId][msg.sender];
        require(donatedAmount > 0, "No donations made");

        donations[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(donatedAmount);
    }

    // 🏦 Withdraw funds if campaign succeeded
    function withdrawFunds(uint256 _campaignId) public  {
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

    // 🛠️ Update campaign before donations
    function updateCampaign(
        uint256 _campaignId,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        require(_campaignId < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Only owner can update");
        require(block.timestamp < campaign.deadline, "Campaign expired");
        require(campaign.amountCollected == 0, "Cannot edit after donations");

        campaign.title = _title;
        campaign.description = _description;
        campaign.goal = _goal;
        campaign.deadline = _deadline;

        emit CampaignUpdated(_campaignId);
    }

    // ⏳ Extend campaign deadline (only once)
    function extendDeadline(uint256 _campaignId, uint256 _newDeadline) public {
        require(_campaignId < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Only owner can extend");
        require(!deadlineExtended[_campaignId], "Already extended");
        require(_newDeadline > campaign.deadline, "New deadline must be later");

        deadlineExtended[_campaignId] = true;
        campaign.deadline = _newDeadline;

        emit DeadlineExtended(_campaignId, _newDeadline);
    }

    // 👥 Get list of donors for a campaign
    function getDonors(uint256 _campaignId) public view returns (Donor[] memory) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        return campaigns[_campaignId].donors;
    }

    // 🆕 Return number of campaigns
    function getNumberOfCampaigns() public view returns (uint256) {
        return campaignCount;
    }
    
    // ❌ Reject ETH sent directly
    receive() external payable {
        revert("Direct ETH not accepted");
    }

    fallback() external payable {
        revert("Invalid function call");
    }
}

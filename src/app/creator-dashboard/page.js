'use client'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import CampaignCard from '../components/CampaignCard'
import DonorModal from '../components/DonorModal'
import toast from 'react-hot-toast'
import { contractABI, contractAddress } from '../lib/constants'
import { updateUserName } from '../store/slices/userSlice'

export default function CreatorDashboard () {
  const dispatch = useDispatch()
  const { walletAddress } = useSelector(state => state.account)
  const { user, status, error } = useSelector(state => state.user)

  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRaised: 0,
    activeCampaigns: 0,
    successfulCampaigns: 0
  })
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [donors, setDonors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contract, setContract] = useState(null)

  const [nameInput, setNameInput] = useState(user?.name || '')
  const [isEditingName, setIsEditingName] = useState(false)

  // Update local state when user changes
  useEffect(() => {
    setNameInput(user?.name || '')
  }, [user])

  const handleNameChange = (e) => {
    setNameInput(e.target.value)
  }

  const handleEditClick = () => {
    setIsEditingName(true)
  }

  const handleUpdateName = async () => {
    if (!nameInput.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    try {
      // Dispatch the update action with walletAddress as metaid
      await dispatch(updateUserName({ 
        metaid: walletAddress, 
        name: nameInput 
      })).unwrap()
      
      setIsEditingName(false)
      toast.success('Name updated successfully')
    } catch (error) {
      console.error('Error updating name:', error)
      toast.error('Failed to update name')
      // Revert to previous name if update fails
      setNameInput(user?.name || '')
    }
  }

  const fetchCreatorCampaigns = useCallback(async () => {
    if (!contract || !walletAddress) return

    try {
      const count = await contract.campaignCount()
      let creatorCampaigns = []
      let totalRaised = 0
      let active = 0
      let successful = 0

      for (let i = 0; i < count; i++) {
        const campaignData = await contract.getCampaign(i)
        if (campaignData.owner.toLowerCase() === walletAddress.toLowerCase()) {
          const campaign = {
            id: i,
            owner: campaignData.owner,
            title: campaignData.title,
            description: campaignData.description,
            goal: parseFloat(ethers.formatEther(campaignData.goal)),
            deadline: new Date(Number(campaignData.deadline) * 1000),
            amountCollected: parseFloat(
              ethers.formatEther(campaignData.amountCollected)
            )
          }

          creatorCampaigns.push(campaign)

          totalRaised += campaign.amountCollected

          if (new Date() < campaign.deadline) {
            active++
          }

          if (campaign.amountCollected >= campaign.goal) {
            successful++
          }
        }
      }

      setCampaigns(creatorCampaigns)
      setStats({
        totalCampaigns: creatorCampaigns.length,
        totalRaised,
        activeCampaigns: active,
        successfulCampaigns: successful
      })
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error('Failed to fetch campaigns')
    }
  }, [contract, walletAddress])

  useEffect(() => {
    if (!walletAddress) return

    const initializeContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        const crowdfundingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
        setContract(crowdfundingContract)
      } catch (error) {
        console.error('Error initializing contract:', error)
        toast.error('Failed to initialize contract')
      }
    }

    initializeContract()
  }, [walletAddress])

  useEffect(() => {
    if (contract && walletAddress) {
      fetchCreatorCampaigns()
    }
  }, [contract, walletAddress, fetchCreatorCampaigns])

  const handleWithdraw = async campaignId => {
    try {
      // Test call to simulate withdrawal and catch errors
      const tx = await contract.withdrawFunds(campaignId)
      await tx.wait()
      // If no error, proceed with actual tx

      toast.success('Funds withdrawn successfully!')
      fetchCreatorCampaigns()
    } catch (error) {
      console.error('Withdrawal failed:', error)
      if (error.reason) {
        toast.error(`Withdrawal failed: ${error.reason}`)
      } else {
        toast.error('Withdrawal failed')
      }
    }
  }

  const showDonors = async campaignId => {
    try {
      const donors = await contract.getDonors(campaignId)
      setDonors(donors)
      setSelectedCampaign(campaigns.find(c => c.id === campaignId))
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching donors:', error)
      toast.error('Failed to fetch donors')
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='theme-bg border border-green-300 theme-text p-6 rounded-lg mb-8'>
        {user && (
          <div className='flex items-center gap-2 mb-2'>
            {isEditingName ? (
              <>
                <input
                  type='text'
                  value={nameInput}
                  onChange={handleNameChange}
                  className='text-xl font-bold border border-gray-300 rounded px-2 py-1'
                />
                <button
                  onClick={handleUpdateName}
                  className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded'
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <h2 className='text-xl font-bold'>{nameInput}</h2>
                <button
                  onClick={handleEditClick}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </>
            )}
          {error && <p>Error: {error}</p>}
          </div>
        )}

        <h3 className='text-3xl font-bold'>Creator Dashboard</h3>
        <p>Manage your crowdfunding campaigns</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <StatCard title='Total Campaigns' value={stats.totalCampaigns} />
        <StatCard
          title='Funds Raised'
          value={`${stats.totalRaised.toFixed(5)} ETH`}
        />
        <StatCard title='Active Campaigns' value={stats.activeCampaigns} />
        <StatCard
          title='Successful Campaigns'
          value={stats.successfulCampaigns}
        />
      </div>

      <h2 className='text-2xl font-semibold mb-4'>Your Campaigns</h2>
      {campaigns.length === 0 ? (
        <p className='text-gray-600'>You haven't created any campaigns yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onWithdraw={handleWithdraw}
              onShowDonors={showDonors}
            />
          ))}
        </div>
      )}

      <DonorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donors={donors}
        campaign={selectedCampaign}
      />
    </div>
  )
}

const StatCard = ({ title, value }) => (
  <div className='bg-white p-4 rounded-lg shadow'>
    <h3 className='text-gray-500 text-sm font-medium'>{title}</h3>
    <p className='text-2xl font-bold'>{value}</p>
  </div>
)
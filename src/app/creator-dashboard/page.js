'use client'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CampaignCard from '../components/CampaignCard'
import DonorModal from '../components/DonorModal'
import toast from 'react-hot-toast'
import { updateUserName } from '../store/slices/userSlice'

export default function CreatorDashboard () {
  const dispatch = useDispatch()
  const { userId, name: accountName } = useSelector(state => state.account)
  const { user } = useSelector(state => state.user)

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
  const [loading, setLoading] = useState(true)

  const [nameInput, setNameInput] = useState(user?.name || accountName || '')
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    setNameInput(user?.name || accountName || '')
  }, [user, accountName])

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
      await dispatch(updateUserName({ 
        userId: userId, 
        name: nameInput 
      })).unwrap()
      
      setIsEditingName(false)
      toast.success('Name updated successfully')
    } catch (error) {
      console.error('Error updating name:', error)
      toast.error('Failed to update name')
      setNameInput(user?.name || accountName || '')
    }
  }

  const fetchCreatorCampaigns = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const res = await fetch(`/api/events/user/${userId}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch campaigns')

      const creatorCampaigns = data.map(c => ({
        ...c,
        goal: Number(c.goal),
        amountCollected: Number(c.amountCollected),
        deadline: new Date(c.deadline)
      }))

      let totalRaised = 0
      let active = 0
      let successful = 0

      creatorCampaigns.forEach(campaign => {
        totalRaised += campaign.amountCollected
        if (new Date() < campaign.deadline) {
          active++
        }
        if (campaign.amountCollected >= campaign.goal) {
          successful++
        }
      })

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
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchCreatorCampaigns()
  }, [fetchCreatorCampaigns])

  const handleWithdraw = async campaignId => {
    toast.success('Withdrawal request submitted! You will receive funds in your bank account soon.')
  }

  const showDonors = async campaignId => {
    try {
      const res = await fetch(`/api/donations?campaignId=${campaignId}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch donors')
      
      setDonors(data.map(d => ({
        donor: d.donorId,
        amount: d.amount,
        name: d.donorName || 'Anonymous'
      })))
      
      setSelectedCampaign(campaigns.find(c => c._id === campaignId || c.id === campaignId))
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching donors:', error)
      toast.error('Failed to fetch donors')
    }
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Please login to view your creator dashboard</h2>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='theme-bg border border-green-300 theme-text p-6 rounded-lg mb-8'>
        <div className='flex items-center gap-2 mb-2'>
          {isEditingName ? (
            <>
              <input
                type='text'
                value={nameInput}
                onChange={handleNameChange}
                className='text-xl font-bold border border-gray-300 rounded px-2 py-1 theme-text outfit'
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
              <h2 className='text-3xl font-bold capitalize'>{nameInput}</h2>
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
        </div>
        <p className='text-emerald-700 opacity-80'>Manage your fundraising campaigns</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <StatCard title='Total Campaigns' value={stats.totalCampaigns} />
        <StatCard
          title='Funds Raised'
          value={`₹${stats.totalRaised}`}
        />
        <StatCard title='Active' value={stats.activeCampaigns} />
        <StatCard
          title='Successful'
          value={stats.successfulCampaigns}
        />
      </div>

      <h2 className='text-2xl font-semibold mb-4'>Your Campaigns</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <p className='text-gray-600'>You haven&apos;t created any campaigns yet.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign._id || campaign.id}
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
  <div className='bg-white p-4 rounded-lg shadow border border-gray-100'>
    <h3 className='text-gray-500 text-sm font-medium'>{title}</h3>
    <p className='text-2xl font-bold theme-text'>{value}</p>
  </div>
)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Fetch all events
export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('/api/events')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch events')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Fetch events by user ID
export const fetchEventsByUser = createAsyncThunk(
    'events/fetchEventsByUser',
    async (userId, thunkAPI) => {
        try {
            const res = await fetch(`/api/events/user/${userId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch user events')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Create new event
export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData, thunkAPI) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create event')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Create donation
export const createDonation = createAsyncThunk(
    'events/createDonation',
    async (donationData, thunkAPI) => {
        try {
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donationData),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create donation')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Fetch donations for an event
export const fetchEventDonations = createAsyncThunk(
    'events/fetchEventDonations',
    async (eventId, thunkAPI) => {
        try {
            const res = await fetch(`/api/donations/event/${eventId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch donations')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        currentEvent: null,
        donations: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearEvents: (state) => {
            state.events = []
            state.currentEvent = null
            state.donations = []
            state.status = 'idle'
            state.error = null
        },
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Events
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.events = action.payload
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Fetch Events by User
            .addCase(fetchEventsByUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEventsByUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.events = action.payload
            })
            .addCase(fetchEventsByUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Create Event
            .addCase(createEvent.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.events.push(action.payload)
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Create Donation
            .addCase(createDonation.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createDonation.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.donations.push(action.payload)
                // Update current event's donation amount if it exists
                if (state.currentEvent) {
                    state.currentEvent.currentDonation += action.payload.donationAmount
                }
            })
            .addCase(createDonation.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Fetch Event Donations
            .addCase(fetchEventDonations.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEventDonations.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.donations = action.payload
            })
            .addCase(fetchEventDonations.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { clearEvents, setCurrentEvent } = eventSlice.actions
export default eventSlice.reducer
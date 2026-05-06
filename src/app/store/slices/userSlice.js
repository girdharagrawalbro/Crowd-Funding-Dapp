import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Fetch user profile
export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (userId, thunkAPI) => {
        try {
            const res = await fetch(`/api/users/${userId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch user')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Create or update user
export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, thunkAPI) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create user')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Update user name
export const updateUserName = createAsyncThunk(
    'user/updateUserName',
    async (newName, { getState, rejectWithValue }) => {
        const state = getState();
        const userId = state.account.userId;
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to update name');
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message || 'An error occurred while updating the name');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearUser: (state) => {
            state.user = null
            state.status = 'idle'
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Create User
            .addCase(createUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            // Update Name
            .addCase(updateUserName.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.name = action.payload.name;
                }
            })
    },
})

export const { clearUser } = userSlice.actions
export default userSlice.reducer

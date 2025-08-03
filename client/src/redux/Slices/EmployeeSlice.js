import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AsyncReducer } from "../AsyncReducers/asyncreducer"
import { HandlePostEmployees, HandleGetEmployees, HandleEmployeeLogout } from "../Thunks/EmployeeThunk"

const EmployeeSlice = createSlice({
    name: 'employees',
    initialState: {
        data: null,
        isLoading: false,
        isAuthenticated: false,
        isAuthourized: false,
        isResetPasswords: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        AsyncReducer(builder, HandlePostEmployees);
        AsyncReducer(builder, HandleGetEmployees)
        
        // Handle logout specifically
        builder
            .addCase(HandleEmployeeLogout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleEmployeeLogout.fulfilled, (state, action) => {
                // Reset all authentication states on successful logout
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isAuthourized = false;
                state.isResetPasswords = false;
                state.data = null;
                state.error = {
                    status: false,
                    message: null,
                    content: null
                };
            })
            .addCase(HandleEmployeeLogout.rejected, (state, action) => {
                // Even if logout API fails, reset authentication states
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isAuthourized = false;
                state.isResetPasswords = false;
                state.data = null;
                state.error = {
                    status: true,
                    message: action.payload?.message || "Logout failed",
                    content: action.payload
                };
            });
    }
})

export default EmployeeSlice.reducer
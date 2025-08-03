import { createSlice } from "@reduxjs/toolkit";
import { HRAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandlePostHumanResources, HandleGetHumanResources, HandleHRLogout } from "../Thunks/HRThunk.js";

const HRSlice = createSlice({
    name: "HumanResources",
    initialState: {
        data: null,
        isLoading: false,
        isAuthenticated: false,
        isSignUp: false,
        isAuthourized: false,
        isVerified: false,
        isVerifiedEmailAvailable : false,
        isResetPassword: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        HRAsyncReducer(builder, HandlePostHumanResources)
        HRAsyncReducer(builder, HandleGetHumanResources)
        
        // Handle logout specifically
        builder
            .addCase(HandleHRLogout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(HandleHRLogout.fulfilled, (state, action) => {
                // Reset all authentication states on successful logout
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isSignUp = false;
                state.isAuthourized = false;
                state.isVerified = false;
                state.isVerifiedEmailAvailable = false;
                state.isResetPassword = false;
                state.data = null;
                state.error = {
                    status: false,
                    message: null,
                    content: null
                };
            })
            .addCase(HandleHRLogout.rejected, (state, action) => {
                // Even if logout API fails, reset authentication states
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isSignUp = false;
                state.isAuthourized = false;
                state.isVerified = false;
                state.isVerifiedEmailAvailable = false;
                state.isResetPassword = false;
                state.data = null;
                state.error = {
                    status: true,
                    message: action.payload?.message || "Logout failed",
                    content: action.payload
                };
            });
    }
})

export default HRSlice.reducer
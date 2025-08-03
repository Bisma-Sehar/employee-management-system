import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { LeaveEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetAllLeaves = createAsyncThunk("HandleGetAllLeaves", async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(LeaveEndPoints.GETALL, {
            withCredentials: true
        });
        return { ...response.data, type: "AllLeaves" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleGetLeave = createAsyncThunk("HandleGetLeave", async (leaveID, { rejectWithValue }) => {
    try {
        const response = await apiService.get(LeaveEndPoints.GETONE(leaveID), {
            withCredentials: true
        });
        return { ...response.data, type: "GetLeave" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleCreateLeave = createAsyncThunk("HandleCreateLeave", async (leaveData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(LeaveEndPoints.HR_CREATE, leaveData, {
            withCredentials: true
        });
        return { ...response.data, type: "CreateLeave" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateLeaveByEmployee = createAsyncThunk("HandleUpdateLeaveByEmployee", async (leaveData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(LeaveEndPoints.UPDATE_BY_EMPLOYEE, leaveData, {
            withCredentials: true
        });
        return { ...response.data, type: "UpdateLeaveByEmployee" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateLeaveByHR = createAsyncThunk("HandleUpdateLeaveByHR", async (leaveData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(LeaveEndPoints.UPDATE_BY_HR, leaveData, {
            withCredentials: true
        });
        return { ...response.data, type: "UpdateLeaveByHR" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteLeave = createAsyncThunk("HandleDeleteLeave", async (leaveID, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(LeaveEndPoints.DELETE(leaveID), {
            withCredentials: true
        });
        return { ...response.data, type: "DeleteLeave" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
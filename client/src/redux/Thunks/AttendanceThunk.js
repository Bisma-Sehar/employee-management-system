import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { AttendanceEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetAllAttendance = createAsyncThunk("HandleGetAllAttendance", async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(AttendanceEndPoints.GETALL, {
            withCredentials: true
        });
        return { ...response.data, type: "AllAttendance" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleGetAttendance = createAsyncThunk("HandleGetAttendance", async (attendanceID, { rejectWithValue }) => {
    try {
        const response = await apiService.get(AttendanceEndPoints.GETONE(attendanceID), {
            withCredentials: true
        });
        return { ...response.data, type: "GetAttendance" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleInitializeAttendance = createAsyncThunk("HandleInitializeAttendance", async (attendanceData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(AttendanceEndPoints.HR_INITIALIZE, attendanceData, {
            withCredentials: true
        });
        return { ...response.data, type: "InitializeAttendance" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateAttendance = createAsyncThunk("HandleUpdateAttendance", async (attendanceData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(AttendanceEndPoints.UPDATE, attendanceData, {
            withCredentials: true
        });
        return { ...response.data, type: "UpdateAttendance" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteAttendance = createAsyncThunk("HandleDeleteAttendance", async (attendanceID, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(AttendanceEndPoints.DELETE(attendanceID), {
            withCredentials: true
        });
        return { ...response.data, type: "DeleteAttendance" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
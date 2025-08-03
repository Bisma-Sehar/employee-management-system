import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService.js";
import { SalaryEndPoints } from "../apis/APIsEndpoints.js";

export const HandleGetAllSalaries = createAsyncThunk("HandleGetAllSalaries", async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(SalaryEndPoints.GETALL, {
            withCredentials: true
        });
        return { ...response.data, type: "AllSalaries" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleGetSalary = createAsyncThunk("HandleGetSalary", async (salaryID, { rejectWithValue }) => {
    try {
        const response = await apiService.get(SalaryEndPoints.GETONE(salaryID), {
            withCredentials: true
        });
        return { ...response.data, type: "GetSalary" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleCreateSalary = createAsyncThunk("HandleCreateSalary", async (salaryData, { rejectWithValue }) => {
    try {
        const response = await apiService.post(SalaryEndPoints.CREATE, salaryData, {
            withCredentials: true
        });
        return { ...response.data, type: "CreateSalary" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleUpdateSalary = createAsyncThunk("HandleUpdateSalary", async (salaryData, { rejectWithValue }) => {
    try {
        const response = await apiService.patch(SalaryEndPoints.UPDATE, salaryData, {
            withCredentials: true
        });
        return { ...response.data, type: "UpdateSalary" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteSalary = createAsyncThunk("HandleDeleteSalary", async (salaryID, { rejectWithValue }) => {
    try {
        const response = await apiService.delete(SalaryEndPoints.DELETE(salaryID), {
            withCredentials: true
        });
        return { ...response.data, type: "DeleteSalary" };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
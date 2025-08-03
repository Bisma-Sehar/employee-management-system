import { createSlice } from "@reduxjs/toolkit";
import { LeaveAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { 
    HandleGetAllLeaves, 
    HandleGetLeave, 
    HandleCreateLeave, 
    HandleUpdateLeaveByEmployee,
    HandleUpdateLeaveByHR, 
    HandleDeleteLeave 
} from "../Thunks/LeaveThunk.js";

const LeaveSlice = createSlice({
    name: "Leave",
    initialState: {
        data: null,
        leaveData: null,
        isLoading: false,
        success: {
            status: false,
            message: null,
            content: null
        },
        fetchData: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        LeaveAsyncReducer(builder, HandleGetAllLeaves);
        LeaveAsyncReducer(builder, HandleGetLeave);
        LeaveAsyncReducer(builder, HandleCreateLeave);
        LeaveAsyncReducer(builder, HandleUpdateLeaveByEmployee);
        LeaveAsyncReducer(builder, HandleUpdateLeaveByHR);
        LeaveAsyncReducer(builder, HandleDeleteLeave);
    }
});

export default LeaveSlice.reducer;
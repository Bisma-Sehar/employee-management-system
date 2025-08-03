import { createSlice } from "@reduxjs/toolkit";
import { AttendanceAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { 
    HandleGetAllAttendance, 
    HandleGetAttendance, 
    HandleInitializeAttendance, 
    HandleUpdateAttendance, 
    HandleDeleteAttendance 
} from "../Thunks/AttendanceThunk.js";

const AttendanceSlice = createSlice({
    name: "Attendance",
    initialState: {
        data: null,
        attendanceData: null,
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
        AttendanceAsyncReducer(builder, HandleGetAllAttendance);
        AttendanceAsyncReducer(builder, HandleGetAttendance);
        AttendanceAsyncReducer(builder, HandleInitializeAttendance);
        AttendanceAsyncReducer(builder, HandleUpdateAttendance);
        AttendanceAsyncReducer(builder, HandleDeleteAttendance);
    }
});

export default AttendanceSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { SalaryAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { 
    HandleGetAllSalaries, 
    HandleGetSalary, 
    HandleCreateSalary, 
    HandleUpdateSalary, 
    HandleDeleteSalary 
} from "../Thunks/SalaryThunk.js";

const SalarySlice = createSlice({
    name: "Salary",
    initialState: {
        data: null,
        salaryData: null,
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
        SalaryAsyncReducer(builder, HandleGetAllSalaries);
        SalaryAsyncReducer(builder, HandleGetSalary);
        SalaryAsyncReducer(builder, HandleCreateSalary);
        SalaryAsyncReducer(builder, HandleUpdateSalary);
        SalaryAsyncReducer(builder, HandleDeleteSalary);
    }
});

export default SalarySlice.reducer;
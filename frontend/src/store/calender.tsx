import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState:any = []

export const calender = createSlice({
    name:"calender",
    initialState,
    reducers:{
        calenderpick:(state,action:PayloadAction<any>)=>{
            state.push(action.payload)
        },
      
    }
})

export const {calenderpick} = calender.actions
export default  calender.reducer
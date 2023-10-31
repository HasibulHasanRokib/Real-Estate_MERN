import { createSlice } from "@reduxjs/toolkit";


const initialState={  
    currentUser:null,
    isLoading:false,
    error:null
}

export const userSlice=createSlice({
    name:"user",
    initialState,

    reducers:{

    GET_USER_REQUEST:(state)=>{
        state.isLoading=true
    },
    GET_USER_SUCCESSFUL:(state,action)=>{
        state.isLoading=false,
        state.currentUser=action.payload,
        state.error=null
    },
    GET_REQUEST_FAILED:(state,action)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=action.payload
    },
    UPDATE_USER_REQUEST:(state)=>{
        state.isLoading=true
    },
    UPDATE_USER_SUCCESS:(state,action)=>{
        state.isLoading=false,
        state.currentUser=action.payload,
        state.error=null
    },
    UPDATE_USER_FAILED:(state,action)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=action.payload
    },
    DELETE_USER_REQUEST:(state)=>{
        state.isLoading=true
    },
    DELETE_USER_SUCCESS:(state)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=null
    },
    DELETE_USER_FAILED:(state,action)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=action.payload
    },
    SIGNOUT_USER_REQUEST:(state)=>{
        state.isLoading=true
    },
    SIGNOUT_USER_SUCCESS:(state)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=null
    },
    SIGNOUT_USER_FAILED:(state,action)=>{
        state.isLoading=false,
        state.currentUser=null,
        state.error=action.payload
    }
    }
})

export const{GET_USER_REQUEST,GET_USER_SUCCESSFUL,GET_REQUEST_FAILED,UPDATE_USER_REQUEST,UPDATE_USER_SUCCESS,UPDATE_USER_FAILED,DELETE_USER_FAILED,DELETE_USER_REQUEST,DELETE_USER_SUCCESS,SIGNOUT_USER_FAILED,SIGNOUT_USER_REQUEST,SIGNOUT_USER_SUCCESS}=userSlice.actions;

export default userSlice.reducer;
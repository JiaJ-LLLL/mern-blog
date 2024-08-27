import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

// state: is the fields that is stored in the initialState
// action: is the passing argument

/**
 * These action creators correspond to the reducers defined within the createSlice call, allowing you to trigger different state changes in response to user authentication events.
 */
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.error = null;
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        }

    }
});


export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess} = userSlice.actions;

export default userSlice.reducer;
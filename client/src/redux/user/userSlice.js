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
        }

    }
});


export const { signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;
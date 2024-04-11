import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user/userSlice'

// Redux is a JS library for predictable and maintainable global state management.
export const store = configureStore({
  reducer: {
    user: userReducer
  },
})
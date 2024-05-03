import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from './theme/themeSlice';
import userReducer from './user/userSlice';
import  storage  from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux is a JS library for predictable and maintainable global state management.
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);
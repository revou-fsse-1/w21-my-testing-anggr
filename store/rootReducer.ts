import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlices';
import postReducer from './slices/postSlices';


const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

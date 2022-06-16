import { configureStore } from "@reduxjs/toolkit";
import { styleConfigReducer, currentUserReducer, currentChatReducer } from "./reducers";

export const store = configureStore({
  reducer: {
    styleMode: styleConfigReducer,
    currentUser: currentUserReducer,
    currentChat: currentChatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
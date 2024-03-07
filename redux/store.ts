import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import tripsReducer from "./features/trip/tripsSlice";
import transactionsReducer from "./features/transaction/transactionsSlice";
export default configureStore({
  reducer: {
    user: userReducer,
    trips: tripsReducer,
    transactions: transactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

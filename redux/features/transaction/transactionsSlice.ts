import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector, lruMemoize } from "reselect";
import firestore from "@react-native-firebase/firestore";
import { nanoid } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  status: "idle",
  error: null,
};

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction) => {
    try {
      /* ... */
      // const { category, tripId, amount, description,date } = transaction;
      transactionId = nanoid();

      await firestore()
        .collection("transactions")
        .doc(transactionId)
        .set({
          transactionId: transactionId,
          ...transaction,
        });
      return { transactionId: transactionId, ...transaction };
    } catch (e) {
      console.error(e);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId) => {
    try {
      // delete all related expenses
      await firestore().collection("transactions").doc(transactionId).delete();
      return transactionId;
    } catch (e) {
      console.error(e);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    try {
      let transactions = [];
      const response = await firestore()
        .collection("transactions")
        .get()
        .then((querySnapshot) => {
          /* ... */
          querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
          });
        });
      return transactions;
    } catch (e) {
      console.error(e);
    }
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTransactions.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      });
  },
});

const filterData = (transactions, tripId) => {
  return transactions.filter((transaction) => transaction.tripId === tripId);
};

export const createSelectTransactionById = createSelector(
  (filter) => filter,
  (filter) => {
    //if data is [1,2,3] and after filter you get [1,2]
    //  and the next render data is [1,2] and the filter
    //  still returns [1,2] it will not be memoized because
    //  the array returned by array.filter is a new array
    //  you can get arround this by using makeMemArray
    return createSelector(
      (state) => state.transactions.transactions,
      (data) => filterData(data, filter)
    );
  }
);

export default transactionsSlice.reducer;

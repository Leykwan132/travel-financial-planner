import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";

const initialState = {
  trips: [],
  tripStatus: "idle",
  addStatus: "idle",
  error: null,
};

export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (_, { getState }) => {
    // argument is the prefix for the generated action types
    try {
      let trips = [];
      const { user } = getState();
      const email = user.user.email;
      const response = await firestore()
        .collection("trips")
        .where("user", "==", email)
        .orderBy("date", "desc")
        .get()
        .then((querySnapshot) => {
          /* ... */
          querySnapshot.forEach((doc) => {
            trips.push(doc.data());
          });
        });
      return trips;
    } catch (e) {
      console.error(e);
    }
  }
);

export const addTrip = createAsyncThunk(
  "trips/addTrip",
  async (initialState) => {
    try {
      tripId = nanoid();
      await firestore()
        .collection("trips")
        .doc(tripId)
        .set({
          ...initialState,
          total: 0,
          tripId: tripId,
        });

      return { ...initialState, total: 0, tripId: tripId };
    } catch (e) {
      console.error(e);
    }
  }
);

export const deleteTrip = createAsyncThunk(
  "trips/deleteTrip",
  async (tripId) => {
    try {
      await firestore().collection("trips").doc(tripId).delete();

      return tripId;
    } catch (e) {
      console.error(e);
    }
  }
);

export const updateTripTotal = createAsyncThunk(
  "trips/updateTripTotal",
  async (data, { getState }) => {
    try {
      const { trips } = getState();
      console.log("trips", trips);
      console.log("data", data);
      // grab the trip from the state
      const trip = trips.trips.find((trip) => trip.tripId === data.tripId);

      // update the total with the sum of all transactions

      const total = trip.total + parseFloat(data.amount);

      await firestore().collection("trips").doc(data.tripId).update({
        total: total,
      });
      return { tripId, total };
    } catch (e) {
      console.log("failed");
      console.error(e);
    }
  }
);

export const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    removeTrip: (state, action: PayloadAction<any>) => {
      return state.trips.filter((trip) => trip.id !== action.payload);
    },
    updateTrip: (state, action: PayloadAction<any>) => {
      const { id, tripName, destination, baseCurrency } = action.payload;
      const existingTrip = state.trips.find((trip) => trip.id === id);
      if (existingTrip) {
        existingTrip.tripName = tripName;
        existingTrip.destination = destination;
        existingTrip.baseCurrency = baseCurrency;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.tripStatus = "succeeded";
        state.trips = action.payload;
      })
      .addCase(addTrip.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        // add to the first position
        state.trips.unshift(action.payload);
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(
          (trip) => trip.tripId !== action.payload
        );
      })
      .addCase(updateTripTotal.fulfilled, (state, action) => {
        console.log("updateTripTotal.fulfilled", action.payload);
        const { tripId, total } = action.payload;
        const existingTrip = state.trips.find((trip) => trip.tripId === tripId);
        if (existingTrip) {
          existingTrip.total = total;
        }
      });
  },
});

export const { removeTrip, updateTrip } = tripsSlice.actions;

export const selectTrips = (state) => state.trips;

export default tripsSlice.reducer;

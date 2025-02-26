// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Notification {
//   id: string;
//   type:
//     | "new_customer"
//     | "payment_received"
//     | "payment_overdue"
//     | "payment_pending"
//     | "payment_completed";
//   message: string;
// }

// const notificationSlice = createSlice({
//   name: "notifications",
//   initialState: [] as Notification[],
//   reducers: {
//     addNotification(state, action: PayloadAction<Notification>) {
//       state.push(action.payload);
//     },
//   },
// });

// export const { addNotification } = notificationSlice.actions;
// export default notificationSlice.reducer;

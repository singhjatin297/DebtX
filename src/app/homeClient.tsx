// "use client";

// import { useGetCustomersQuery, useLoginMutation } from "@/store/apiSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store";
// import { addNotification } from "@/store/notificationSlice";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function HomeClient() {
//   const { data: customers, error, isLoading } = useGetCustomersQuery();
//   const [login, { isLoading: loginLoading }] = useLoginMutation();
//   const notifications = useSelector((state: RootState) => state.notifications);
//   const dispatch = useDispatch();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleAddNotification = () => {
//     dispatch(
//       addNotification({
//         id: Date.now().toString(),
//         type: "new_customer",
//         message: "New customer added!",
//       })
//     );
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await login({ username, password }).unwrap();
//       toast.success(response.message);
//     } catch (err) {
//       console.error("Login failed:", err);
//     }
//   };

//   return (
//     <main>
//       <h1>Welcome to the Collection System</h1>
//       <div>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <Button onClick={handleLogin} disabled={loginLoading}>
//           {loginLoading ? "Logging in..." : "Login"}
//         </Button>
//       </div>
//       <Button onClick={handleAddNotification}>Add Notification</Button>
//       {isLoading && <p>Loading customers...</p>}
//       {error && <p>Error fetching customers: {JSON.stringify(error)}</p>}
//       {customers && (
//         <ul>
//           {customers.map((customer) => (
//             <li key={customer.id}>
//               {customer.name} - {customer.paymentStatus}
//             </li>
//           ))}
//         </ul>
//       )}
//       <ul>
//         {notifications.map((notif) => (
//           <li key={notif.id}>{notif.message}</li>
//         ))}
//       </ul>
//     </main>
//   );
// }

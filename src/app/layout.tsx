"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { useCheckAuthQuery } from "@/store/apiSlice";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: authData, isLoading } = useCheckAuthQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const isLoggedIn = authData?.isAuthenticated || false;

  return (
    <>
      {isLoggedIn && <Navbar />}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Provider store={store}>
          <div className="h-[6.5rem] w-full" />{" "}
          {/* Reserves space: 4rem height + 2.5rem top-10 */}
          <AuthWrapper>{children}</AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}

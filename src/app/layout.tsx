"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { useCheckAuthQuery } from "@/store/apiSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: authData, isLoading } = useCheckAuthQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authData && !authData.isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, authData, router]);

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
      {isLoggedIn && (
        <>
          <Navbar />
          <div className="h-[6.5rem] w-full" />
        </>
      )}
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
          <AuthWrapper>{children}</AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}

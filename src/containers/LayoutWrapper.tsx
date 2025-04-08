"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/containers/navbar";
import { Fragment } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <Fragment>
      {!isLoginPage && <Navbar />}
      <main
        className={`flex-1 w-full min-h-screen bg-gray-50 ${!isLoginPage ? "pt-16 sm:pt-0 sm:pl-0" : ""} overflow-x-hidden`}
      >
        <div className="container-fluid h-full">{children}</div>
      </main>
    </Fragment>
  );
}

"use server";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./nav_link";

export default async function Navbar() {
  return (
    <div className="w-64 h-screen flex flex-col border-r b border-r-gray-200">
      <div className="p-6">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={27} />
        </Link>
      </div>
      <ul className="flex-grow">
        <li className="block">
          <NavLink
            className="hover:text-primary-900 hover:font-bold hover:bg-primary-100 p-6 w-full h-full block"
            href="/"
          >
            대시보드
          </NavLink>
        </li>
        <li className="block">
          <NavLink
            className="hover:text-primary-900 hover:font-bold hover:bg-primary-100 p-6 w-full h-full block"
            href="/plan"
          >
            계획 관리
          </NavLink>
        </li>
        <li className="block">
          <NavLink
            className="hover:text-primary-900 hover:font-bold hover:bg-primary-100 p-6 w-full h-full block"
            href="/shipment"
          >
            선적 관리
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-64 h-screen flex flex-col border-r b border-r-gray-200">
      <div className="p-6">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={150} height={34} />
        </Link>
      </div>
      <ul className="flex-grow">
        <li className="block hover:text-primary-900 hover:font-bold hover:bg-primary-100">
          <Link className="p-6 w-full h-full block" href="/dashboard">
            대시보드
          </Link>
        </li>
        <li className="block hover:text-primary-900 hover:font-bold hover:bg-primary-100">
          <Link className="p-6 w-full h-full block" href="/plan-management">
            계획 관리
          </Link>
        </li>
        <li className="block hover:text-primary-900 hover:font-bold hover:bg-primary-100">
          <Link className="p-6 w-full h-full block" href="/shipment-management">
            선적 관리
          </Link>
        </li>
      </ul>
    </div>
  );
}

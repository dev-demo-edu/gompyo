"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function NavLink({ href, className, children }: NavLinkProps) {
  const pathName = usePathname();

  const linkClassName =
    pathName === href ? "text-primary-900 font-bold bg-primary-100" : "";

  return (
    <Link className={`${className} ${linkClassName}`} href={href}>
      {children}
    </Link>
  );
}

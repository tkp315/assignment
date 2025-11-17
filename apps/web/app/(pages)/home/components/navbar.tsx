"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Home", href: "/" },
  { label: "Tasks", href: "/tasks" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b bg-white">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          TaskApp
        </Link>

        {/* Center Tabs */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-md font-medium transition ${
                  isActive
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right - Login */}
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
      </nav>
    </div>
  );
}

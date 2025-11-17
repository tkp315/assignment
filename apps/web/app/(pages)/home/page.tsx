"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div>
        <Navbar/>
    <div className="max-w-4xl mx-auto mt-20 px-4 text-center">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to TaskApp
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-lg mb-8">
        A simple and efficient task manager to organize your daily work.
        Create tasks, update progress, and stay productive.
      </p>

      {/* Quick Button */}
      <Link href="/tasks">
        <Button size="lg" className="px-10 py-6 text-lg">
          View Tasks
        </Button>
      </Link>

    </div>
    <Footer/>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Profile() {
  // Dummy values — baad mein API se dynamic kar lena
  const user = {
    name: "Tushar Patil",
    email: "tushar@example.com",
    joined: "12 Jan 2024",
  };

  return (
    <div className="max-w-lg mx-auto mt-16">
      <Card className="p-6 shadow-md">
        <CardContent>
          <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input value={user.name} readOnly className="mt-1" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input value={user.email} readOnly className="mt-1" />
            </div>

            {/* Joined date */}
            <div>
              <label className="text-sm font-medium">Joined On</label>
              <Input value={user.joined} readOnly className="mt-1" />
            </div>

            {/* Edit Button */}
            <Button className="w-full mt-4">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;

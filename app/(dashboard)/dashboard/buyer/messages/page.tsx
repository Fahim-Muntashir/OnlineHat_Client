"use client";

import React from "react";
import { Chat } from "@/components/dashboard/Chat";

const MessagesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
        <p className="text-sm text-slate-500">Manage your conversations with sellers</p>
      </div>
      <Chat />
    </div>
  );
};

export default MessagesPage;

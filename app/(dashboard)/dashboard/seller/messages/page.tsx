import React from "react";

const MessagesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 text-gray-700">
      <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Messages</h1>
        <p className="text-gray-500 mb-6">
          This page is under construction. Your messages will appear here soon.
        </p>
        <div className="animate-pulse h-24 bg-gray-200 rounded-lg mb-2"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default MessagesPage;

"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  MessageSquare,
  Search,
  MoreVertical,
  ChevronLeft,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(date));
};

interface UserInfo {
  name: string;
  profileImage: string | null;
}

interface Participant {
  user: UserInfo;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderBuyerId: string | null;
  senderSellerId: string | null;
}

interface Conversation {
  id: string;
  buyerId: string;
  sellerId: string;
  buyer: Participant;
  seller: Participant;
  messages: Message[];
}

export function Chat() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const user = AuthStore.getUser();

  const { data: conversations, isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat/conversations");
      return res.data.data as Conversation[];
    },
    refetchInterval: 5000, // Poll every 5 seconds for new messages/convs
  });

  const { data: messages, isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", selectedId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chat/messages/${selectedId}`);
      return res.data.data as Message[];
    },
    enabled: !!selectedId,
    refetchInterval: 3000, // Poll every 3 seconds for new messages in active chat
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return axiosInstance.post("/chat/send-message", {
        content,
        conversationId: selectedId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setMessage("");
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedId) return;
    sendMessageMutation.mutate(message);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeConv = conversations?.find((c) => c.id === selectedId);
  const otherParty = activeConv 
    ? (user?.role === "BUYER" ? activeConv.seller : activeConv.buyer)
    : null;

  if (loadingConvs) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-x divide-slate-100">
      {/* Sidebar - Conversations List */}
      <div className={cn(
        "w-full lg:w-80 flex flex-col bg-slate-50/30",
        selectedId ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10 bg-slate-100 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 space-y-1">
            {conversations?.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="text-slate-400" size={20} />
                </div>
                <p className="text-sm font-medium text-slate-700">No messages yet</p>
                <p className="text-xs text-slate-400 mt-1">Contact a seller to start a conversation</p>
              </div>
            ) : (
              conversations?.map((conv) => {
                const partner = user?.role === "BUYER" ? conv.seller : conv.buyer;
                const lastMsg = conv.messages[0];
                const isActive = selectedId === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left",
                      isActive ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-white/60"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 rounded-xl border-2 border-white shadow-sm">
                        <AvatarImage src={partner.user.profileImage || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {partner.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Circle className="absolute -bottom-0.5 -right-0.5 fill-green-500 text-white w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {partner.user.name}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {formatTime(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {lastMsg ? lastMsg.content : "No messages yet"}
                      </p>
                    </div>
                    {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col bg-white",
        !selectedId ? "hidden lg:flex" : "flex"
      )}>
        {selectedId ? (
          <>
            {/* Header */}
            <div className="h-[72px] px-6 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-left">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden -ml-2 text-slate-500"
                  onClick={() => setSelectedId(null)}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Avatar className="h-10 w-10 rounded-xl border shadow-sm">
                  <AvatarImage src={otherParty?.user.profileImage || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {otherParty?.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-none mb-1">
                    {otherParty?.user.name}
                  </h3>
                  <p className="text-[11px] text-green-500 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical size={18} />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-slate-50/30 overflow-y-auto custom-scrollbar">
              <div 
                ref={scrollRef}
                className="p-6 space-y-4 min-h-full flex flex-col justify-end"
              >
                {loadingMsgs ? (
                  <div className="flex justify-center p-10">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center opacity-40">
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3">
                      <MessageSquare size={20} className="text-slate-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages?.map((msg) => {
                    const isMe = (user?.role === "BUYER" && !!msg.senderBuyerId) || 
                                (user?.role === "SELLER" && !!msg.senderSellerId);
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={cn(
                          "flex max-w-[85%] lg:max-w-[70%]",
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                          isMe 
                            ? "bg-primary text-white rounded-tr-none" 
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                        )}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className={cn(
                            "text-[10px] block mt-1 opacity-70",
                            isMe ? "text-right" : "text-left"
                          )}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-50 bg-white">
              <form 
                onSubmit={handleSend}
                className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="border-none bg-transparent focus-visible:ring-0 text-sm py-2"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="rounded-xl h-9 w-9 bg-primary hover:bg-primary/90 shrink-0 shadow-md"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="h-20 w-20 bg-primary/5 rounded-[40px] flex items-center justify-center mb-6 animate-bounce group hover:bg-primary/10 transition-colors">
              <MessageSquare className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Conversation</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Pick a message from the list on the left to start chatting with your clients or sellers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

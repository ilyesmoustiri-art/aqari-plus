"use client";

import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/lib/utils-format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  User,
  Clock,
  Building2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  propertyId: string | null;
  createdAt: string;
  sender: { name: string; role: string };
  receiver: { name: string; role: string };
  property?: { title: string } | null;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  propertyTitle?: string;
}

export default function MessagesPage() {
  const { user, setCurrentPage, setSelectedPropertyId, setUnreadMessages } = useAppStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; role: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    setLoading(true);
    try {
      const res = await fetch("/api/messages/conversations");
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
        // Update unread count
        const totalUnread = data.reduce((sum: number, c: Conversation) => sum + c.unreadCount, 0);
        setUnreadMessages(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(userId: string) {
    try {
      const res = await fetch(`/api/messages?with=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        // Mark as read
        const unreadIds = data.filter((m: Message) => !m.read && m.receiverId === user?.id).map((m: Message) => m.id);
        if (unreadIds.length > 0) {
          fetch("/api/messages/read", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messageIds: unreadIds }),
          });
          fetchConversations();
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedConv) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedConv,
          content: newMessage.trim(),
        }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages(selectedConv);
        fetchConversations();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSending(false);
    }
  }

  async function handleNewConversation(receiverId: string) {
    setSelectedConv(receiverId);
    setShowNewConv(false);
  }

  async function fetchAllUsers() {
    try {
      const res = await fetch("/api/messages/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllUsers(data.filter((u: any) => u.id !== user?.id));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl mb-2">الرسائل</h1>
            <p className="text-muted-foreground">
              تواصل مع المستخدمين بخصوص العقارات
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              fetchAllUsers();
              setShowNewConv(true);
            }}
          >
            <MessageSquare className="h-4 w-4" />
            رسالة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: "500px" }}>
          {/* Conversations List */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">المحادثات</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">لا توجد محادثات</p>
                  <p className="text-xs text-muted-foreground">ابدأ محادثة جديدة</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {conversations.map((conv) => (
                    <div
                      key={conv.userId}
                      className={`p-3 cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/50 ${
                        selectedConv === conv.userId ? "bg-primary/5 border-r-4 border-r-primary" : ""
                      }`}
                      onClick={() => setSelectedConv(conv.userId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {conv.userName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {conv.userName}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0 mr-2">
                              {conv.lastTime}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                          {conv.propertyTitle && (
                            <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {conv.propertyTitle}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full bg-primary text-primary-foreground shrink-0">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden h-8 w-8"
                      onClick={() => setSelectedConv(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {conversations.find(c => c.userId === selectedConv)?.userName?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {conversations.find(c => c.userId === selectedConv)?.userName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {conversations.find(c => c.userId === selectedConv)?.userRole}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "350px", minHeight: "300px" }}>
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                      <p className="text-sm text-muted-foreground">ابدأ المحادثة بإرسال رسالة</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[75%] p-3 rounded-xl ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {formatDate(msg.createdAt)}
                              </span>
                              {msg.property && (
                                <span className={`text-[10px] flex items-center gap-0.5 ${isMe ? "text-primary-foreground/70" : "text-primary"}`}>
                                  <Building2 className="h-2.5 w-2.5" />
                                  {msg.property.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="اكتب رسالتك..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">اختر محادثة</h3>
                  <p className="text-muted-foreground text-sm">
                    اختر محادثة من القائمة أو ابدأ محادثة جديدة
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* New Conversation Dialog */}
        {showNewConv && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewConv(false)}>
            <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>رسالة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                {allUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">لا يوجد مستخدمون آخرون</p>
                ) : (
                  <div className="space-y-2">
                    {allUsers.map((u) => (
                      <Button
                        key={u.id}
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => handleNewConversation(u.id)}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{u.name.charAt(0)}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.role}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
                <Button variant="ghost" className="w-full mt-3" onClick={() => setShowNewConv(false)}>
                  إلغاء
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

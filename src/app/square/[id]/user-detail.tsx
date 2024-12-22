"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, School, Briefcase, Heart, MessageSquare } from "lucide-react";
import type { User, UserDetailProps } from "@/types/square";

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/square/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        // 这里可以添加错误提示UI
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleContactRequest = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/square/users/${userId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contactMessage }),
      });
      
      if (!response.ok) throw new Error('Failed to send contact request');
      
      // 成功后关闭对话框
      setContactDialogOpen(false);
      setContactMessage("");
      // 这里可以添加成功提示UI
    } catch (error) {
      console.error('Error sending contact request:', error);
      // 这里可以添加错误提示UI
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-32" />
        </div>
        <Card className="overflow-hidden">
          <Skeleton className="h-96 rounded-none" />
          <div className="p-6 space-y-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">用户不存在</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium">{user.name}的主页</h1>
        </div>
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              申请联系方式
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>申请联系方式</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Textarea
                placeholder="请简单介绍一下你自己，以及想要认识对方的原因..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleContactRequest}
                  disabled={!contactMessage.trim() || submitting}
                >
                  {submitting ? "发送中..." : "发送申请"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        {user.photos[0] && (
          <div className="relative h-96">
            <Image
              src={user.photos[0]}
              alt={user.name}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-medium">
                {user.name}
                <span className="ml-2 text-lg text-muted-foreground">
                  {user.age}岁
                </span>
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <School className="h-4 w-4" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.major}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="h-6">
              {user.gender === 'male' ? '男生' : '女生'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                自我介绍
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {user.introduction}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                期待
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {user.expectation}
              </p>
            </div>
          </div>

          {user.photos.length > 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">更多照片</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.photos.slice(1).map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={photo}
                      alt={`${user.name}的照片 ${index + 2}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, School, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/shared";

interface UserDetailProps {
  user: UserDetail;
}

export function UserDetail({ user }: UserDetailProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestResponse, setRequestResponse] = useState<string | null>(null);
  const { toast } = useToast();

  // 获取申请状态
  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await fetch(`/api/square/users/${user.id}/request`);
        if (!response.ok) throw new Error("获取申请状态失败");
        const data = await response.json();
        if (data.success) {
          setRequestStatus(data.data.status);
          setRequestMessage(data.data.message);
          setRequestResponse(data.data.response);
        }
      } catch (error) {
        console.error("获取申请状态失败:", error);
      }
    };

    fetchRequestStatus();
  }, [user.id]);

  const handleRequest = async () => {
    if (!message.trim()) {
      toast({
        title: "请填写申请说明",
        description: "请描述一下你想认识对方的原因",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRequesting(true);
      const response = await fetch(`/api/square/users/${user.id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "申请失败");
      }

      toast({
        title: "申请成功",
        description: "请等待对方回复",
      });

      setMessage("");
      setRequestStatus("pending");
      setRequestMessage(message);
    } catch (error: any) {
      toast({
        title: "申请失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="p-6">
        <div className="flex gap-6">
          {/* 用户照片 */}
          <div className="relative h-32 w-32 rounded-lg overflow-hidden">
            <Image
              src={user.photos[0]}
              alt={user.nickname}
              fill
              className="object-cover"
            />
          </div>

          {/* 用户基本信息 */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{user.nickname}</h2>
              <Badge variant={user.gender === "male" ? "default" : "secondary"}>
                {user.gender === "male" ? "男" : "女"}
              </Badge>
              <span className="text-muted-foreground">{user.age}岁</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.location.province} {user.location.city}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <School className="h-4 w-4" />
              <span>{user.university}</span>
              {user.major && <span>· {user.major}</span>}
              <span>· {user.grade}</span>
            </div>

            {user.mbti && (
              <Badge variant="outline">MBTI: {user.mbti}</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* 照片展示 */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">照片</h3>
        <div className="grid grid-cols-3 gap-4">
          {user.photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={photo}
                alt={`${user.nickname}的照片 ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 自我介绍 */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">自我介绍</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {user.selfIntro}
        </p>
      </Card>

      {/* 期�� */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">期待</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {user.expectation}
        </p>
      </Card>

      {/* 申请联系方式 */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">申请联系方式</h3>
        {requestStatus ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={
                requestStatus === "approved" ? "success" :
                requestStatus === "rejected" ? "destructive" :
                "secondary"
              }>
                {requestStatus === "approved" ? "已通过" :
                 requestStatus === "rejected" ? "已拒绝" :
                 "等待回复"}
              </Badge>
              {requestStatus === "approved" && (
                <p className="text-sm text-muted-foreground">
                  微信号：{user.wechat}
                </p>
              )}
            </div>
            {requestMessage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">我的申请说明：</p>
                <p className="text-sm text-muted-foreground">{requestMessage}</p>
              </div>
            )}
            {requestResponse && (
              <div className="space-y-2">
                <p className="text-sm font-medium">对方回复：</p>
                <p className="text-sm text-muted-foreground">{requestResponse}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="请描述一下你想认识对方的原因..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleRequest}
              disabled={isRequesting}
            >
              <Heart className="h-4 w-4 mr-2" />
              申请联系方式
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 
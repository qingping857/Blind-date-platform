"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/shared";
import { locationData } from "@/components/shared/city-select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface UserDetailProps {
  userId: string;
}

export function UserDetailView({ userId }: UserDetailProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/square/users/${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        toast({
          title: "获取用户详情失败",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, toast]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "请填写申请说明",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/square/users/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "申请已发送",
          description: "请等待对方回复",
        });
        setMessage("");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "申请失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationLabel = (province: string, city: string) => {
    if (!province || province === "all") return "不限";

    // 检查直辖市
    const municipality = locationData.municipalities.find(m => m.value === province);
    if (municipality) {
      return municipality.label;
    }

    // 检查特别行政区
    const specialRegion = locationData.specialRegions.find(r => r.value === province);
    if (specialRegion) {
      return specialRegion.label;
    }

    // 检查普通省份
    const provinceData = locationData.provinces[province as keyof typeof locationData.provinces];
    if (!provinceData) return "未知地区";

    const cityData = provinceData.cities.find(c => c.value === city);
    return cityData ? `${provinceData.label} ${cityData.label}` : provinceData.label;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        用户不存在或已被删除
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        {/* 基本信息 */}
        <div className="flex gap-4">
          {user.photos[0] && (
            <img
              src={user.photos[0]}
              alt={user.nickname}
              className="h-32 w-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.nickname}</h2>
            <p className="text-muted-foreground">
              {user.age}岁 · {user.gender === "male" ? "男" : "女"}
            </p>
            <p className="text-muted-foreground">
              {getLocationLabel(user.province, user.city)}
            </p>
            <p className="text-muted-foreground">
              {user.university} · {user.grade}
              {user.major && ` · ${user.major}`}
            </p>
            {user.mbti && (
              <p className="text-muted-foreground">MBTI: {user.mbti}</p>
            )}
          </div>
        </div>

        {/* 自我介绍 */}
        <div className="space-y-2">
          <h3 className="font-semibold">自我介绍</h3>
          <p className="text-muted-foreground">{user.selfIntro}</p>
        </div>

        {/* 期待 */}
        <div className="space-y-2">
          <h3 className="font-semibold">期待</h3>
          <p className="text-muted-foreground">{user.expectation}</p>
        </div>

        {/* 照片墙 */}
        {user.photos.length > 1 && (
          <div className="space-y-2">
            <h3 className="font-semibold">照片墙</h3>
            <div className="grid grid-cols-2 gap-2">
              {user.photos.slice(1).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${user.nickname}的照片${index + 2}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* 申请联系按钮 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">申请联系</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>申请联系 {user.nickname}</DialogTitle>
              <DialogDescription>
                请简单介绍一下你自己，说明想要联系的原��
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="在这里写下你的申请说明..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "发送中..." : "发送申请"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
} 
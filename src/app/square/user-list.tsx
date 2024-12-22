"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserListItem } from "@/types/shared";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { locationData } from "@/components/shared/city-select";

interface UserListProps {
  users?: UserListItem[];
  isLoading?: boolean;
}

export function UserList({ users = [], isLoading = false }: UserListProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleViewProfile = (userId: string) => {
    router.push(`/square/users/${userId}`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        暂无用户数据
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            {user.photos[0] && (
              <img
                src={user.photos[0]}
                alt={user.nickname}
                className="h-24 w-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{user.nickname}</h3>
              <p className="text-sm text-muted-foreground">
                {user.age}岁 · {user.gender === "male" ? "男" : "女"}
              </p>
              <p className="text-sm text-muted-foreground">
                {getLocationLabel(user.province, user.city)}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.university} · {user.grade}
              </p>
              {user.mbti && (
                <p className="text-sm text-muted-foreground">
                  MBTI: {user.mbti}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm line-clamp-3">{user.selfIntro}</p>
          <Button
            variant="outline"
            onClick={() => handleViewProfile(user.id)}
          >
            查看资料
          </Button>
        </Card>
      ))}
    </div>
  );
} 
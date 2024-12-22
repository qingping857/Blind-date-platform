"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, School } from "lucide-react";
import { UserListItem } from "@/types/shared";

export function UserList() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/square/users?${searchParams.toString()}`);
        if (!response.ok) throw new Error("获取用户列表失败");
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          throw new Error(data.error || "获取用户列表失败");
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Link key={user.id} href={`/square/${user.id}`}>
          <Card className="p-4 space-y-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex gap-4">
              {/* 用户照片 */}
              <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                <Image
                  src={user.photos[0]}
                  alt={user.nickname}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 用户基本信息 */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{user.nickname}</h3>
                  <Badge variant={user.gender === "male" ? "default" : "secondary"}>
                    {user.gender === "male" ? "男" : "女"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.age}岁</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location.province} {user.location.city}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <School className="h-4 w-4" />
                  <span>{user.university}</span>
                  {user.major && <span>· {user.major}</span>}
                  <span>· {user.grade}</span>
                </div>
              </div>
            </div>

            {/* 自我介绍 */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {user.selfIntro}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
} 
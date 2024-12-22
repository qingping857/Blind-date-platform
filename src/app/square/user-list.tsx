"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, School } from "lucide-react";
import type { User, UserListProps } from "@/types/square";

export function UserList({}: UserListProps) {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/square/users?${searchParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // 这里可以添加错误提示UI
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暂无匹配的用户</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Link key={user.id} href={`/square/${user.id}`}>
          <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/30">
            {user.photos[0] && (
              <div className="relative h-48">
                <Image
                  src={user.photos[0]}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {user.name}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {user.age}岁
                  </span>
                </h3>
                <Badge variant="secondary">
                  {user.gender === 'male' ? '男生' : '女生'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.introduction}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <School className="h-3.5 w-3.5" />
                  <span>{user.university}</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 
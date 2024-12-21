"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">联系申请</h1>
        <div className="space-x-2">
          <Button variant="outline">收到的申请</Button>
          <Button variant="outline">发出的申请</Button>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">用户 {i}</h3>
                  <Badge>待处理</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  申请时间: 2023-12-21 14:30
                </p>
                <p className="text-sm">
                  申请理由: 您的个人简介很有趣,希望能进一步了解...
                </p>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline">拒绝</Button>
                <Button size="sm">同意</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
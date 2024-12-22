"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      {/* 消息列表 */}
      <div className="grid grid-cols-[300px_1fr] gap-4 h-[calc(100vh-2rem)]">
        {/* 左侧联系人列表 */}
        <div className="border rounded-lg p-4 space-y-4">
          <Input placeholder="搜索联系人..." />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4 cursor-pointer hover:bg-accent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div>
                    <h4 className="font-medium">联系人 {i}</h4>
                    <p className="text-sm text-muted-foreground">最后一条消息...</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 右侧聊天区域 */}
        <div className="border rounded-lg flex flex-col">
          {/* 聊天头部 */}
          <div className="border-b p-4">
            <h3 className="font-medium">联系人 1</h3>
          </div>

          {/* 聊天内容区域 */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  这是一条聊天消息，可能会很长很长很长很长很长很长很长很长很长很长
                </div>
              </div>
            ))}
          </div>

          {/* 输入区域 */}
          <div className="border-t p-4 space-y-4">
            <Textarea
              placeholder="输入消息..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button>发送</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
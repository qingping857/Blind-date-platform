"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">个人资料</h1>
        <Button>保存修改</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 基本信息 */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">基本信息</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>昵称</Label>
              <Input placeholder="输入昵称" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>年龄</Label>
                <Input type="number" placeholder="输入年龄" />
              </div>

              <div className="space-y-2">
                <Label>性别</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>地区</Label>
              <Input placeholder="输入地区" />
            </div>

            <div className="space-y-2">
              <Label>学历</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高中</SelectItem>
                  <SelectItem value="college">大专</SelectItem>
                  <SelectItem value="bachelor">本科</SelectItem>
                  <SelectItem value="master">硕士</SelectItem>
                  <SelectItem value="doctor">博士</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>个人简介</Label>
              <Textarea placeholder="描述一下自己..." />
            </div>
          </div>
        </Card>

        {/* 照片上传 */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">个人照片</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square group">
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-muted-foreground/50">
                  <Button variant="ghost" className="absolute">上传照片</Button>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            最多上传4张照片，每张照片不超过5MB
          </p>
        </Card>
      </div>
    </div>
  );
} 
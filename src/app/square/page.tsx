"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 筛选器部分 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>年龄范围</Label>
          <div className="flex items-center gap-2">
            <Input type="number" placeholder="最小" className="w-20" />
            <span>-</span>
            <Input type="number" placeholder="最大" className="w-20" />
          </div>
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
      </div>

      {/* 用户列表 */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 space-y-4">
            <div className="aspect-square rounded-md bg-muted" />
            <div className="space-y-2">
              <h3 className="font-medium">用户 {i}</h3>
              <p className="text-sm text-muted-foreground">
                25岁 · 女 · 北京 · 本科
              </p>
              <p className="text-sm">
                这里是个人简介,描述自己的兴趣爱好、生活方式等...
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

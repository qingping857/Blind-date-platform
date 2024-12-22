"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactRequest {
  id: string;
  requesterId: {
    id: string;
    nickname: string;
    age: number;
    gender: string;
    university: string;
    location: {
      province: string;
      city: string;
    };
    wechat?: string;
  };
  targetId: string;
  message: string;
  response?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();

  // 获取申请列表
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        
        // 分别获取收到和发出的申请
        const receivedRes = await fetch("/api/contact/received");
        const receivedData = await receivedRes.json();
        
        if (!receivedRes.ok) {
          throw new Error(receivedData.error || "获取收到的申请失败");
        }
        
        const sentRes = await fetch("/api/contact/sent");
        const sentData = await sentRes.json();
        
        if (!sentRes.ok) {
          throw new Error(sentData.error || "获取发出的申请失败");
        }

        // 更新状态
        if (receivedData.success) {
          setReceivedRequests(receivedData.data);
        }
        if (sentData.success) {
          setSentRequests(sentData.data);
        }
      } catch (error: any) {
        console.error("获取申请列表失败:", error);
        toast({
          title: "获取申请列表失败",
          description: error.message || "请刷新页面重试",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  // 处理申请
  const handleProcess = async (requestId: string, action: "approve" | "reject") => {
    if (action === "reject" && !responseMessage.trim()) {
      toast({
        title: "请填写回复内容",
        description: "请告诉对方拒绝的原因",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/contact/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          message: responseMessage.trim(),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "处理申请失败");
      }

      // 更新申请列表
      setReceivedRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: action === "approve" ? "approved" : "rejected", response: responseMessage.trim() }
            : req
        )
      );

      toast({
        title: action === "approve" ? "已通过申请" : "已拒绝申请",
        description: action === "approve" ? "对方可以看到你的微信号了" : "已通知对方",
      });

      setResponseMessage("");
    } catch (error: any) {
      toast({
        title: "处理失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <Card className="p-8">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="received">收到的申请</TabsTrigger>
          <TabsTrigger value="sent">发出的申请</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              暂无收到的申请
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="space-y-4">
                  {/* 申请者信息 */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {request.requesterId.nickname}
                        </span>
                        <Badge variant={request.requesterId.gender === "male" ? "default" : "secondary"}>
                          {request.requesterId.gender === "male" ? "男" : "女"}
                        </Badge>
                        <span className="text-muted-foreground">
                          {request.requesterId.age}岁
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.requesterId.university} ·{" "}
                        {request.requesterId.location.province}{" "}
                        {request.requesterId.location.city}
                      </div>
                    </div>
                    <Badge variant={
                      request.status === "approved" ? "default" :
                      request.status === "rejected" ? "destructive" :
                      "secondary"
                    }>
                      {request.status === "approved" ? "已通过" :
                       request.status === "rejected" ? "已拒绝" :
                       "待处理"}
                    </Badge>
                  </div>

                  {/* 申请说明 */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">申请说明：</p>
                    <p className="text-sm text-muted-foreground">
                      {request.message}
                    </p>
                  </div>

                  {/* 处理区域 */}
                  {request.status === "pending" && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="填写回复内容..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleProcess(request.id, "reject")}
                          disabled={isProcessing}
                        >
                          拒绝
                        </Button>
                        <Button
                          onClick={() => handleProcess(request.id, "approve")}
                          disabled={isProcessing}
                        >
                          通过
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 回复内容 */}
                  {request.response && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">我的回复：</p>
                      <p className="text-sm text-muted-foreground">
                        {request.response}
                      </p>
                    </div>
                  )}

                  {/* 申请时间 */}
                  <p className="text-sm text-muted-foreground">
                    申请时间：{new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              暂无发出的申请
            </Card>
          ) : (
            sentRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="space-y-4">
                  {/* 申请状态 */}
                  <div className="flex justify-between items-center">
                    <Badge variant={
                      request.status === "approved" ? "default" :
                      request.status === "rejected" ? "destructive" :
                      "secondary"
                    }>
                      {request.status === "approved" ? "已通过" :
                       request.status === "rejected" ? "已拒绝" :
                       "等待回复"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* 申请说明 */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">我的申请说明：</p>
                    <p className="text-sm text-muted-foreground">
                      {request.message}
                    </p>
                  </div>

                  {/* 对方回复 */}
                  {request.response && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">对方回复：</p>
                      <p className="text-sm text-muted-foreground">
                        {request.response}
                      </p>
                    </div>
                  )}

                  {/* 如果通过了，显示微信号 */}
                  {request.status === "approved" && request.requesterId.wechat && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">对方的微信号：</p>
                      <p className="text-sm">
                        {request.requesterId.wechat}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
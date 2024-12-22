"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ContactRequestListItem } from "@/types/shared";
import { locationData } from "@/components/shared/city-select";

export default function ContactPage() {
  const [receivedRequests, setReceivedRequests] = useState<ContactRequestListItem[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const [receivedRes, sentRes] = await Promise.all([
          fetch("/api/contact/received"),
          fetch("/api/contact/sent")
        ]);

        const [receivedData, sentData] = await Promise.all([
          receivedRes.json(),
          sentRes.json()
        ]);

        if (receivedData.success) {
          setReceivedRequests(receivedData.data);
        }

        if (sentData.success) {
          setSentRequests(sentData.data);
        }
      } catch (error: any) {
        toast({
          title: "获取联系方式申请失败",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const handleResponse = async (requestId: string, status: "approved" | "rejected") => {
    if (status === "rejected" && !response.trim()) {
      toast({
        title: "请填写拒绝原因",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/contact/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          response: response.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: status === "approved" ? "已通过申请" : "已拒绝申请",
        });

        // 更新请求列表
        setReceivedRequests(prev =>
          prev.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  status,
                  response: response.trim(),
                  respondedAt: new Date().toISOString(),
                }
              : request
          )
        );

        setResponse("");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationLabel = (province?: string, city?: string) => {
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">联系方式申请</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="received">
            收到的申请 ({receivedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            发出的申请 ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无收到的申请
            </div>
          ) : (
            receivedRequests.map((request) => (
              <Card key={request.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{request.requester.nickname}</h3>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {request.status === "approved"
                          ? "已通过"
                          : request.status === "rejected"
                          ? "已拒绝"
                          : "待处理"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getLocationLabel(request.requester.province, request.requester.city)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm">{request.message}</p>

                {request.status === "pending" ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="填写回复内容..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={() => handleResponse(request.id, "approved")}
                        disabled={isSubmitting}
                      >
                        通过申请
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleResponse(request.id, "rejected")}
                        disabled={isSubmitting}
                      >
                        拒绝申请
                      </Button>
                    </div>
                  </div>
                ) : (
                  request.response && (
                    <div className="text-sm">
                      <p className="font-medium">我的回复：</p>
                      <p className="text-muted-foreground">{request.response}</p>
                    </div>
                  )
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无发出的申请
            </div>
          ) : (
            sentRequests.map((request) => (
              <Card key={request.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{request.target.nickname}</h3>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {request.status === "approved"
                          ? "已通过"
                          : request.status === "rejected"
                          ? "已拒绝"
                          : "待处理"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getLocationLabel(request.target.province, request.target.city)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">我的申请：</p>
                  <p className="text-muted-foreground">{request.message}</p>
                </div>

                {request.status !== "pending" && request.response && (
                  <div className="text-sm">
                    <p className="font-medium">对方回复：</p>
                    <p className="text-muted-foreground">{request.response}</p>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="text-sm">
                    <p className="font-medium">微信号：</p>
                    <p className="text-muted-foreground">{request.target.wechat}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
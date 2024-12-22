"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Filter, Search, X, MessageSquare, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FilterState, UserFilterProps } from "@/types/square";

const initialState: FilterState = {
  query: "",
  searchType: "intro",
  ageRange: [18, 50],
  gender: "all",
  location: "all",
};

export function UserFilter({}: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get("query") || initialState.query,
    searchType: (searchParams.get("searchType") as "intro" | "expectation") || initialState.searchType,
    ageRange: [
      Number(searchParams.get("minAge")) || initialState.ageRange[0],
      Number(searchParams.get("maxAge")) || initialState.ageRange[1],
    ],
    gender: searchParams.get("gender") || initialState.gender,
    location: searchParams.get("location") || initialState.location,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) {
      params.set("query", filters.query);
      params.set("searchType", filters.searchType);
    }
    if (filters.gender !== "all") params.set("gender", filters.gender);
    if (filters.location !== "all") params.set("location", filters.location);
    params.set("minAge", filters.ageRange[0].toString());
    params.set("maxAge", filters.ageRange[1].toString());
    router.push(`/square?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters(initialState);
    router.push("/square");
  };

  const handleTypeChange = (type: "intro" | "expectation") => {
    console.log("Changing type to:", type); // 添加日志
    setFilters(prev => ({ ...prev, searchType: type }));
  };

  return (
    <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b">
      <div className="flex items-center gap-2 p-4">
        <div className="relative flex-1">
          {/* 搜索类型切换按钮 */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex gap-1 bg-background/50 p-1 rounded-md">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleTypeChange("intro")}
              onKeyDown={(e) => e.key === "Enter" && handleTypeChange("intro")}
              className={cn(
                "flex items-center justify-center",
                "w-8 h-8 rounded-sm cursor-pointer",
                "transition-all duration-200",
                filters.searchType === "intro"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <UserRound className="h-4 w-4" />
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleTypeChange("expectation")}
              onKeyDown={(e) => e.key === "Enter" && handleTypeChange("expectation")}
              className={cn(
                "flex items-center justify-center",
                "w-8 h-8 rounded-sm cursor-pointer",
                "transition-all duration-200",
                filters.searchType === "expectation"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>

          {/* 搜索框 */}
          <div className={cn(
            "relative rounded-lg transition-all duration-300",
            "bg-muted/50 hover:bg-muted/70"
          )}>
            <Input
              placeholder={filters.searchType === "intro" ? "搜索自我介绍..." : "搜索对TA的期待..."}
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={cn(
                "pl-24 pr-10",
                "border-0",
                "bg-transparent",
                "placeholder:text-muted-foreground/70",
                "focus-visible:ring-1 focus-visible:ring-primary/30"
              )}
            />
            {filters.query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-background/50"
                onClick={() => setFilters(prev => ({ ...prev, query: "" }))}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-background/50"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 筛选按钮 */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10",
                "border-0 bg-muted/50",
                "hover:bg-muted",
                "focus-visible:ring-1 focus-visible:ring-primary/30"
              )}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>筛选条件</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* 年龄范围 */}
              <div className="space-y-2">
                <Label>年龄范围</Label>
                <div className="pt-2">
                  <Slider
                    value={filters.ageRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value as [number, number] }))}
                    min={18}
                    max={50}
                    step={1}
                    minStepsBetweenThumbs={1}
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    {filters.ageRange[0]} - {filters.ageRange[1]} 岁
                  </div>
                </div>
              </div>

              {/* 性别选择 */}
              <div className="space-y-2">
                <Label>性别</Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="male">男生</SelectItem>
                    <SelectItem value="female">女生</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 地区选择 */}
              <div className="space-y-2">
                <Label>地区</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="beijing">北京</SelectItem>
                    <SelectItem value="shanghai">上海</SelectItem>
                    <SelectItem value="guangzhou">广州</SelectItem>
                    <SelectItem value="shenzhen">深圳</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  重置
                </Button>
                <Button className="flex-1" onClick={() => { handleSearch(); setIsOpen(false); }}>
                  应用
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 
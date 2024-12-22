"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Filter, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FilterState, UserFilterProps } from "@/types/square";

const initialState: FilterState = {
  query: "",
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
    ageRange: [
      Number(searchParams.get("minAge")) || initialState.ageRange[0],
      Number(searchParams.get("maxAge")) || initialState.ageRange[1],
    ],
    gender: searchParams.get("gender") || initialState.gender,
    location: searchParams.get("location") || initialState.location,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
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

  return (
    <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b">
      <div className="flex items-center gap-2 p-4">
        <div className="relative flex-1">
          <Input
            placeholder="搜索用户..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className={cn(
              "pl-4 pr-10",
              "bg-muted/50",
              "border-0",
              "placeholder:text-muted-foreground/70",
              "focus-visible:ring-1 focus-visible:ring-primary/30"
            )}
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
              onClick={() => setFilters(prev => ({ ...prev, query: "" }))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
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
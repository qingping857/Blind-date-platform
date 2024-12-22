"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Filter, Search, X, MessageSquare, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FilterState, UserFilterProps } from "@/types/square";

// MBTI类型选项
const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// 年级选项
const gradeOptions = [
  { value: 'freshman', label: '大一' },
  { value: 'sophomore', label: '大二' },
  { value: 'junior', label: '大三' },
  { value: 'senior', label: '大四' },
  { value: 'master1', label: '研一' },
  { value: 'master2', label: '研二' },
  { value: 'master3', label: '研三' },
  { value: 'phd', label: '博士' },
  { value: 'graduated', label: '已毕业' }
];

// 省份和城市数据
const locationData = {
  municipalities: [
    { value: 'beijing', label: '北京市' },
    { value: 'shanghai', label: '上海市' },
    { value: 'tianjin', label: '天津市' },
    { value: 'chongqing', label: '重庆市' }
  ],
  specialRegions: [
    { value: 'hongkong', label: '香港特别行政区' },
    { value: 'macao', label: '澳门特别行政区' }
  ],
  provinces: {
    guangdong: {
      label: '广东省',
      cities: [
        { value: 'guangzhou', label: '广州市' },
        { value: 'shenzhen', label: '深圳市' },
        { value: 'zhuhai', label: '珠海市' },
        { value: 'foshan', label: '佛山市' },
        { value: 'dongguan', label: '东莞市' },
        { value: 'zhongshan', label: '中山市' },
        { value: 'huizhou', label: '惠州市' },
        { value: 'jiangmen', label: '江门市' },
        { value: 'zhaoqing', label: '肇庆市' }
      ]
    },
    zhejiang: {
      label: '浙江省',
      cities: [
        { value: 'hangzhou', label: '杭州市' },
        { value: 'ningbo', label: '宁波市' },
        { value: 'wenzhou', label: '温州市' },
        { value: 'shaoxing', label: '绍兴市' },
        { value: 'jiaxing', label: '嘉兴市' },
        { value: 'huzhou', label: '湖州市' },
        { value: 'jinhua', label: '金华市' },
        { value: 'taizhou', label: '台州市' }
      ]
    },
    jiangsu: {
      label: '江苏省',
      cities: [
        { value: 'nanjing', label: '南京市' },
        { value: 'suzhou', label: '苏州市' },
        { value: 'wuxi', label: '无锡市' },
        { value: 'changzhou', label: '常州市' },
        { value: 'nantong', label: '南通市' },
        { value: 'yangzhou', label: '扬州市' },
        { value: 'xuzhou', label: '徐州市' },
        { value: 'zhenjiang', label: '镇江市' }
      ]
    },
    fujian: {
      label: '福建省',
      cities: [
        { value: 'fuzhou', label: '福州市' },
        { value: 'xiamen', label: '厦门市' },
        { value: 'quanzhou', label: '泉州市' },
        { value: 'zhangzhou', label: '漳州市' },
        { value: 'putian', label: '莆田市' },
        { value: 'nanping', label: '南平市' }
      ]
    },
    shandong: {
      label: '山东省',
      cities: [
        { value: 'jinan', label: '济南市' },
        { value: 'qingdao', label: '青岛市' },
        { value: 'yantai', label: '烟台市' },
        { value: 'weifang', label: '潍坊市' },
        { value: 'weihai', label: '威海市' },
        { value: 'linyi', label: '临沂市' },
        { value: 'zibo', label: '淄博市' }
      ]
    },
    sichuan: {
      label: '四川省',
      cities: [
        { value: 'chengdu', label: '成都市' },
        { value: 'mianyang', label: '绵阳市' },
        { value: 'deyang', label: '德阳市' },
        { value: 'yibin', label: '宜宾市' },
        { value: 'zigong', label: '自贡市' },
        { value: 'leshan', label: '乐山市' }
      ]
    },
    hubei: {
      label: '湖北省',
      cities: [
        { value: 'wuhan', label: '武汉市' },
        { value: 'yichang', label: '宜昌市' },
        { value: 'xiangyang', label: '襄阳市' },
        { value: 'huangshi', label: '黄石市' },
        { value: 'jingzhou', label: '荆州市' },
        { value: 'shiyan', label: '十堰市' }
      ]
    },
    hunan: {
      label: '湖南省',
      cities: [
        { value: 'changsha', label: '长沙市' },
        { value: 'zhuzhou', label: '株洲市' },
        { value: 'xiangtan', label: '湘潭市' },
        { value: 'hengyang', label: '衡阳市' },
        { value: 'yueyang', label: '岳阳市' },
        { value: 'changde', label: '常德市' }
      ]
    },
    henan: {
      label: '河南省',
      cities: [
        { value: 'zhengzhou', label: '郑州市' },
        { value: 'luoyang', label: '洛阳市' },
        { value: 'kaifeng', label: '开封市' },
        { value: 'nanyang', label: '南阳市' },
        { value: 'xinxiang', label: '新乡市' },
        { value: 'anyang', label: '安阳市' }
      ]
    },
    hebei: {
      label: '河北省',
      cities: [
        { value: 'shijiazhuang', label: '石家庄市' },
        { value: 'tangshan', label: '唐山市' },
        { value: 'baoding', label: '保定市' },
        { value: 'langfang', label: '廊坊市' },
        { value: 'qinhuangdao', label: '秦皇岛市' },
        { value: 'handan', label: '邯郸市' }
      ]
    },
    shanxi: {
      label: '山西省',
      cities: [
        { value: 'taiyuan', label: '太原市' },
        { value: 'datong', label: '大同市' },
        { value: 'yangquan', label: '阳泉市' },
        { value: 'changzhi', label: '长治市' },
        { value: 'jincheng', label: '晋城市' }
      ]
    },
    shaanxi: {
      label: '陕西省',
      cities: [
        { value: 'xian', label: '西安市' },
        { value: 'baoji', label: '宝鸡市' },
        { value: 'xianyang', label: '咸阳市' },
        { value: 'weinan', label: '渭南市' },
        { value: 'hanzhong', label: '汉中市' }
      ]
    },
    gansu: {
      label: '甘肃省',
      cities: [
        { value: 'lanzhou', label: '兰州市' },
        { value: 'jiayuguan', label: '嘉峪关市' },
        { value: 'jinchang', label: '金昌市' },
        { value: 'baiyin', label: '白银市' }
      ]
    },
    liaoning: {
      label: '辽宁省',
      cities: [
        { value: 'shenyang', label: '沈阳市' },
        { value: 'dalian', label: '大连市' },
        { value: 'anshan', label: '鞍山市' },
        { value: 'fushun', label: '抚顺市' },
        { value: 'benxi', label: '本溪市' },
        { value: 'dandong', label: '丹东市' }
      ]
    },
    jilin: {
      label: '吉林省',
      cities: [
        { value: 'changchun', label: '长春市' },
        { value: 'jilin', label: '吉林市' },
        { value: 'siping', label: '四平市' },
        { value: 'tonghua', label: '通化市' },
        { value: 'baishan', label: '白山市' }
      ]
    },
    heilongjiang: {
      label: '黑龙江省',
      cities: [
        { value: 'haerbin', label: '哈尔滨市' },
        { value: 'qiqihaer', label: '齐齐哈尔市' },
        { value: 'jixi', label: '鸡西市' },
        { value: 'daqing', label: '大庆市' },
        { value: 'mudanjiang', label: '牡丹江市' }
      ]
    },
    anhui: {
      label: '安徽省',
      cities: [
        { value: 'hefei', label: '合肥市' },
        { value: 'wuhu', label: '芜湖市' },
        { value: 'bengbu', label: '蚌埠市' },
        { value: 'huainan', label: '淮南市' },
        { value: 'maanshan', label: '马鞍山市' }
      ]
    },
    jiangxi: {
      label: '江西省',
      cities: [
        { value: 'nanchang', label: '南昌市' },
        { value: 'jingdezhen', label: '景德镇市' },
        { value: 'pingxiang', label: '萍乡市' },
        { value: 'jiujiang', label: '九江市' },
        { value: 'xinyu', label: '新余市' }
      ]
    },
    guangxi: {
      label: '广西壮族自治区',
      cities: [
        { value: 'nanning', label: '南宁市' },
        { value: 'liuzhou', label: '柳州市' },
        { value: 'guilin', label: '桂林市' },
        { value: 'wuzhou', label: '梧州市' },
        { value: 'beihai', label: '北海市' }
      ]
    },
    yunnan: {
      label: '云南省',
      cities: [
        { value: 'kunming', label: '昆明市' },
        { value: 'qujing', label: '曲靖市' },
        { value: 'yuxi', label: '玉溪市' },
        { value: 'baoshan', label: '保山市' },
        { value: 'zhaotong', label: '昭通市' }
      ]
    },
    guizhou: {
      label: '贵州省',
      cities: [
        { value: 'guiyang', label: '贵阳市' },
        { value: 'liupanshui', label: '六盘水市' },
        { value: 'zunyi', label: '遵义市' },
        { value: 'anshun', label: '安顺市' }
      ]
    },
    hainan: {
      label: '海南省',
      cities: [
        { value: 'haikou', label: '海口市' },
        { value: 'sanya', label: '三亚市' },
        { value: 'sansha', label: '三沙市' },
        { value: 'danzhou', label: '儋州市' }
      ]
    },
    neimenggu: {
      label: '内蒙古自治区',
      cities: [
        { value: 'huhehaote', label: '呼和浩特市' },
        { value: 'baotou', label: '包头市' },
        { value: 'wuhai', label: '乌海市' },
        { value: 'chifeng', label: '赤峰市' },
        { value: 'tongliao', label: '通辽市' }
      ]
    },
    xizang: {
      label: '西藏自治区',
      cities: [
        { value: 'lasa', label: '拉萨市' },
        { value: 'rikaze', label: '日喀则市' },
        { value: 'changdu', label: '昌都市' },
        { value: 'linzhi', label: '林芝市' }
      ]
    },
    ningxia: {
      label: '宁夏回族自治区',
      cities: [
        { value: 'yinchuan', label: '银川市' },
        { value: 'shizuishan', label: '石嘴山市' },
        { value: 'wuzhong', label: '吴忠市' },
        { value: 'guyuan', label: '固原市' }
      ]
    },
    xinjiang: {
      label: '新疆维吾尔自治区',
      cities: [
        { value: 'wulumuqi', label: '乌鲁木齐市' },
        { value: 'kelamayi', label: '克拉玛依市' },
        { value: 'tulufan', label: '吐鲁番市' },
        { value: 'hami', label: '哈密市' }
      ]
    },
    qinghai: {
      label: '青海省',
      cities: [
        { value: 'xining', label: '西宁市' },
        { value: 'haidong', label: '海东市' },
        { value: 'geermu', label: '格尔木市' }
      ]
    }
  }
};

const initialState: FilterState = {
  query: "",
  searchType: "intro",
  minAge: 18,
  maxAge: 50,
  gender: "all",
  province: "all",
  city: "all",
  mbti: "all",
  grade: "all"
};

export function UserFilter({}: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get("query") || initialState.query,
    searchType: (searchParams.get("searchType") as "intro" | "expectation") || initialState.searchType,
    minAge: Number(searchParams.get("minAge")) || initialState.minAge,
    maxAge: Number(searchParams.get("maxAge")) || initialState.maxAge,
    gender: searchParams.get("gender") || initialState.gender,
    province: searchParams.get("province") || initialState.province,
    city: searchParams.get("city") || initialState.city,
    mbti: searchParams.get("mbti") || initialState.mbti,
    grade: searchParams.get("grade") || initialState.grade
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) {
      params.set("query", filters.query);
      params.set("searchType", filters.searchType);
    }
    if (filters.gender !== "all") params.set("gender", filters.gender);
    if (filters.province) params.set("province", filters.province);
    if (filters.city) params.set("city", filters.city);
    if (filters.mbti) params.set("mbti", filters.mbti);
    if (filters.grade) params.set("grade", filters.grade);
    params.set("minAge", filters.minAge.toString());
    params.set("maxAge", filters.maxAge.toString());
    router.push(`/square?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters(initialState);
    router.push("/square");
  };

  const handleTypeChange = (type: "intro" | "expectation") => {
    setFilters(prev => ({ ...prev, searchType: type }));
  };

  // 处理省份选择
  const handleProvinceChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      province: value,
      city: "" // 清空城市选择
    }));
  };

  // 获取当前可选的城市列表
  const getCityOptions = () => {
    const { province } = filters;
    if (!province) return [];
    
    // 处理直辖市
    const municipality = locationData.municipalities.find(m => m.value === province);
    if (municipality) {
      return [{ value: province, label: municipality.label }];
    }
    
    // 处理特别行政区
    const specialRegion = locationData.specialRegions.find(r => r.value === province);
    if (specialRegion) {
      return [{ value: province, label: specialRegion.label }];
    }
    
    // 处理普通省份
    return locationData.provinces[province]?.cities || [];
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
              {/* 年龄区间 */}
              <div className="space-y-2">
                <Label>年龄区间</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={18}
                    max={filters.maxAge}
                    value={filters.minAge}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minAge: Math.min(Number(e.target.value), prev.maxAge)
                    }))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">至</span>
                  <Input
                    type="number"
                    min={filters.minAge}
                    max={50}
                    value={filters.maxAge}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxAge: Math.max(Number(e.target.value), prev.minAge)
                    }))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">岁</span>
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
                <div className="flex gap-2">
                  {/* 省份选择 */}
                  <Select
                    value={filters.province}
                    onValueChange={handleProvinceChange}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="选择省份" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {/* 直辖市 */}
                      {locationData.municipalities.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                      {/* 特别行政区 */}
                      {locationData.specialRegions.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                      {/* 省份 */}
                      {Object.entries(locationData.provinces).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* 城市选择 */}
                  <Select
                    value={filters.city}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                    disabled={!filters.province || filters.province === "all"}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="选择城市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {getCityOptions().map(city => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* MBTI选择 */}
              <div className="space-y-2">
                <Label>MBTI 性格类型</Label>
                <Select
                  value={filters.mbti}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, mbti: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择MBTI类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {mbtiTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 年级选择 */}
              <div className="space-y-2">
                <Label>年级</Label>
                <Select
                  value={filters.grade}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, grade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择年级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {gradeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
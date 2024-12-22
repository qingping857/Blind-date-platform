import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 省份和城市数据
export const locationData = {
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
    }
  }
} as const;

interface CitySelectProps {
  province: string;
  city: string;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  error?: string;
}

export function CitySelect({
  province,
  city,
  onProvinceChange,
  onCityChange,
  error
}: CitySelectProps) {
  // 获取当前可选的城市列表
  const getCityOptions = () => {
    if (!province || province === "all") return [];
    
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
    return locationData.provinces[province as keyof typeof locationData.provinces]?.cities || [];
  };

  // 处理省份变更
  const handleProvinceChange = (value: string) => {
    onProvinceChange(value);
    // 如果选择了新的省份，清空城市选择
    if (value !== province) {
      onCityChange("all");
    }
  };

  return (
    <div className="space-y-2">
      <Label>地区</Label>
      <div className="flex gap-2">
        {/* 省份选择 */}
        <Select value={province} onValueChange={handleProvinceChange}>
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
          value={city}
          onValueChange={onCityChange}
          disabled={!province || province === "all"}
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
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 
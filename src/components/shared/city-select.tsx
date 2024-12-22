import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 省份和城市数据
export const locationData = {
  municipalities: [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'tianjin', label: '天津' },
    { value: 'chongqing', label: '重庆' }
  ],
  specialRegions: [
    { value: 'hongkong', label: '香港' },
    { value: 'macao', label: '澳门' }
  ],
  provinces: {
    guangdong: {
      label: '广东',
      cities: [
        { value: 'guangzhou', label: '广州' },
        { value: 'shenzhen', label: '深圳' },
        { value: 'zhuhai', label: '珠海' },
        { value: 'foshan', label: '佛山' },
        { value: 'dongguan', label: '东莞' },
        { value: 'zhongshan', label: '中山' },
        { value: 'huizhou', label: '惠州' },
        { value: 'jiangmen', label: '江门' },
        { value: 'zhaoqing', label: '肇庆' }
      ]
    },
    zhejiang: {
      label: '浙江',
      cities: [
        { value: 'hangzhou', label: '杭州' },
        { value: 'ningbo', label: '宁波' },
        { value: 'wenzhou', label: '温州' },
        { value: 'shaoxing', label: '绍兴' },
        { value: 'jiaxing', label: '嘉兴' },
        { value: 'huzhou', label: '湖州' },
        { value: 'jinhua', label: '金华' },
        { value: 'taizhou', label: '台州' }
      ]
    },
    jiangsu: {
      label: '江苏',
      cities: [
        { value: 'nanjing', label: '南京' },
        { value: 'suzhou', label: '苏州' },
        { value: 'wuxi', label: '无锡' },
        { value: 'changzhou', label: '常州' },
        { value: 'nantong', label: '南通' },
        { value: 'yangzhou', label: '扬州' },
        { value: 'xuzhou', label: '徐州' },
        { value: 'zhenjiang', label: '镇江' }
      ]
    },
    fujian: {
      label: '福建',
      cities: [
        { value: 'fuzhou', label: '福州' },
        { value: 'xiamen', label: '厦门' },
        { value: 'quanzhou', label: '泉州' },
        { value: 'zhangzhou', label: '漳州' },
        { value: 'putian', label: '莆田' },
        { value: 'nanping', label: '南平' }
      ]
    },
    shandong: {
      label: '山东',
      cities: [
        { value: 'jinan', label: '济南' },
        { value: 'qingdao', label: '青岛' },
        { value: 'yantai', label: '烟台' },
        { value: 'weifang', label: '潍坊' },
        { value: 'weihai', label: '威海' },
        { value: 'linyi', label: '临沂' },
        { value: 'zibo', label: '淄博' }
      ]
    },
    sichuan: {
      label: '四川',
      cities: [
        { value: 'chengdu', label: '成都' },
        { value: 'mianyang', label: '绵阳' },
        { value: 'deyang', label: '德阳' },
        { value: 'yibin', label: '宜宾' },
        { value: 'zigong', label: '自贡' },
        { value: 'leshan', label: '乐山' }
      ]
    },
    hubei: {
      label: '湖北',
      cities: [
        { value: 'wuhan', label: '武汉' },
        { value: 'yichang', label: '宜昌' },
        { value: 'xiangyang', label: '襄阳' },
        { value: 'huangshi', label: '黄石' },
        { value: 'jingzhou', label: '荆州' },
        { value: 'shiyan', label: '十堰' }
      ]
    },
    hunan: {
      label: '湖南',
      cities: [
        { value: 'changsha', label: '长沙' },
        { value: 'zhuzhou', label: '株洲' },
        { value: 'xiangtan', label: '湘潭' },
        { value: 'hengyang', label: '衡阳' },
        { value: 'yueyang', label: '岳阳' },
        { value: 'changde', label: '常德' }
      ]
    },
    henan: {
      label: '河南',
      cities: [
        { value: 'zhengzhou', label: '郑州' },
        { value: 'luoyang', label: '洛阳' },
        { value: 'kaifeng', label: '开封' },
        { value: 'nanyang', label: '南阳' },
        { value: 'xinxiang', label: '新乡' },
        { value: 'anyang', label: '安阳' }
      ]
    },
    hebei: {
      label: '河北',
      cities: [
        { value: 'shijiazhuang', label: '石家庄' },
        { value: 'tangshan', label: '唐山' },
        { value: 'baoding', label: '保定' },
        { value: 'langfang', label: '廊坊' },
        { value: 'qinhuangdao', label: '秦皇岛' },
        { value: 'handan', label: '邯郸' }
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
      return [{ value: municipality.value, label: municipality.label }];
    }
    
    // 处理特别行政区
    const specialRegion = locationData.specialRegions.find(r => r.value === province);
    if (specialRegion) {
      return [{ value: specialRegion.value, label: specialRegion.label }];
    }
    
    // 处理普通省份
    return locationData.provinces[province as keyof typeof locationData.provinces]?.cities || [];
  };

  // 处理省份变更
  const handleProvinceChange = (value: string) => {
    onProvinceChange(value);
    // 如果是直辖市或特别行政区，自动设置城市值
    const isMunicipality = locationData.municipalities.some(m => m.value === value);
    const isSpecialRegion = locationData.specialRegions.some(r => r.value === value);
    
    if (isMunicipality || isSpecialRegion) {
      onCityChange(value);
    } else {
      // 如果是普通省份，清空城市选择
      onCityChange("all");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* 省份选择 */}
        <Select value={province} onValueChange={handleProvinceChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="选择省份" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限</SelectItem>
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
          disabled={!province || province === "all" || locationData.municipalities.some(m => m.value === province) || locationData.specialRegions.some(r => r.value === province)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="选择城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">不限</SelectItem>
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
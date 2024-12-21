import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UserFilter() {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Input
        placeholder="搜索自我介绍或期待..."
        className="w-full md:w-64 bg-gray-900 border-gray-800"
      />
      
      <Select>
        <SelectTrigger className="w-[160px] bg-gray-900 border-gray-800">
          <SelectValue placeholder="城市" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beijing">北京</SelectItem>
          <SelectItem value="shanghai">上海</SelectItem>
          {/* 更多城市... */}
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[160px] bg-gray-900 border-gray-800">
          <SelectValue placeholder="年龄" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="18-24">18-24岁</SelectItem>
          <SelectItem value="25-30">25-30岁</SelectItem>
          {/* 更多年龄段... */}
        </SelectContent>
      </Select>

      {/* 其他筛选器... */}

      <Button className="bg-blue-600 hover:bg-blue-700">
        应用筛选
      </Button>
    </div>
  )
} 
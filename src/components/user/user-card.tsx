import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function UserCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12">
            <Image
              src="/placeholder.jpg"
              alt="用户头像"
              className="rounded-full object-cover"
              fill
            />
          </div>
          <div>
            <h3 className="font-semibold">昵称</h3>
            <p className="text-sm text-gray-400">大学 · 年级</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400">年龄:</span>
            <span>25岁</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400">城市:</span>
            <span>北京</span>
          </div>
          {/* 其他信息... */}
        </div>
        <p className="text-sm text-gray-300">自我介绍内容...</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          申请联系方式
        </Button>
      </CardFooter>
    </Card>
  )
} 
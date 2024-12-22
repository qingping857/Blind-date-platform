// 数据模型类型
export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  university: string;
  major: string;
  photos: string[];
  introduction: string;
  expectation: string;
}

// 筛选器状态类型
export interface FilterState {
  query: string;
  searchType: "intro" | "expectation";
  ageRange: [number, number];
  gender: string;
  location: string;
}

// 联系请求类型
export interface ContactRequest {
  userId: string;
  requesterId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// 组件属性类型
export interface UserFilterProps {
  className?: string;
}

export interface UserListProps {
  className?: string;
}

export interface UserDetailProps {
  userId: string;
  className?: string;
} 
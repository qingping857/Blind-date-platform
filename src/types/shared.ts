// 省份和城市类型
export interface Location {
  province: string;
  city: string;
}

// 用户基本信息类型
export interface UserBasicInfo {
  nickname: string;
  gender: "male" | "female";
  age: number;
  location: Location;
  mbti?: string;
  university: string;
  major?: string;
  grade: string;
  selfIntro: string;
  expectation: string;
  wechat: string;
  photos: string[];
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 筛选器状态类型
export interface FilterState {
  query: string;
  searchType: "selfIntro" | "expectation";
  minAge: number;
  maxAge: number;
  gender: string;
  province: string;
  city: string;
  mbti: string;
  grade: string;
}

// 用户列表项类型
export interface UserListItem extends UserBasicInfo {
  id: string;
}

// 用户详情类型
export interface UserDetail extends UserBasicInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 联系方式申请状态
export type ContactRequestStatus = "pending" | "approved" | "rejected";

// 联系方式申请
export interface ContactRequest {
  id: string;
  requesterId: string;
  targetId: string;
  message: string;
  status: ContactRequestStatus;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 联系方式申请列表项
export interface ContactRequestListItem {
  id: string;
  requester: {
    id: string;
    nickname: string;
    avatar: string;
  };
  target: {
    id: string;
    nickname: string;
    avatar: string;
  };
  message: string;
  status: ContactRequestStatus;
  response?: string;
  respondedAt?: string;
  createdAt: string;
} 
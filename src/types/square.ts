import { UserBasicInfo } from "./shared";

// 用户列表项
export interface UserListItem extends UserBasicInfo {
  id: string;
}

// 用户详情
export interface UserDetail extends UserBasicInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 筛选器状态
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

// 分页信息
export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 用户列表响应
export interface UserListResponse {
  users: UserListItem[];
  pagination: PaginationInfo;
} 
import * as React from 'react';

// shadcn/ui 组件类型声明
declare module '@/components/ui/sheet' {
  import * as SheetPrimitive from '@radix-ui/react-dialog';
  
  export interface SheetProps extends SheetPrimitive.DialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  export const Sheet: React.FC<SheetProps>;
  export const SheetTrigger: React.FC<SheetPrimitive.DialogTriggerProps>;
  export const SheetClose: React.FC<SheetPrimitive.DialogCloseProps>;
  export const SheetContent: React.FC<SheetPrimitive.DialogContentProps & { className?: string }>;
  export const SheetHeader: React.FC<{ children: React.ReactNode; className?: string }>;
  export const SheetFooter: React.FC<{ children: React.ReactNode; className?: string }>;
  export const SheetTitle: React.FC<SheetPrimitive.DialogTitleProps & { className?: string }>;
  export const SheetDescription: React.FC<SheetPrimitive.DialogDescriptionProps & { className?: string }>;
}

declare module '@/components/ui/button' {
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  export const Button: React.FC<ButtonProps>;
}

declare module '@/components/ui/card' {
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
  }
  export const Card: React.FC<CardProps>;
}

declare module '@/components/ui/badge' {
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }
  export const Badge: React.FC<BadgeProps>;
}

declare module '@/components/ui/input' {
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/label' {
  export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
  export const Label: React.FC<LabelProps>;
}

declare module '@/components/ui/select' {
  export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    children: React.ReactNode;
  }
  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }>;
  export const SelectValue: React.FC<{ 
    className?: string;
    placeholder?: string;
  }>;
  export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }>;
  export const SelectItem: React.FC<{ 
    value: string; 
    children: React.ReactNode;
    className?: string;
    key?: React.Key;
  }>;
}

declare module '@/components/ui/slider' {
  export interface SliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    minStepsBetweenThumbs?: number;
    className?: string;
    defaultValue?: number[];
    name?: string;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
    thumbs?: number;
    inverted?: boolean;
    showTicks?: boolean;
    tickCount?: number;
  }
  export const Slider: React.FC<SliderProps>;
}

declare module '@/components/ui/skeleton' {
  export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const Skeleton: React.FC<SkeletonProps>;
}

declare module '@/components/ui/tabs' {
  export interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    defaultValue?: string;
    className?: string;
    children: React.ReactNode;
  }
  export const Tabs: React.FC<TabsProps>;
  export const TabsList: React.FC<{ children: React.ReactNode; className?: string }>;
  export const TabsTrigger: React.FC<{ 
    value: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

// 通用组件类型声明
declare module '@/components/ui/*' {
  const Component: React.ComponentType<any>;
  export default Component;
  export * from '@radix-ui/react-*';
} 
import { Connection, Mongoose } from 'mongoose';
import * as React from 'react';

declare global {
  // MongoDB 全局类型
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };

  // JSX 全局类型
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  // 通用工具类型
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };

  type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any;
}

export {}; 
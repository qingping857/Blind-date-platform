import * as React from 'react';

declare module 'react' {
  // 扩展 React.FC 类型
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
  }

  // 扩展 React.Component 类型
  interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}

  // 扩展 JSX.Element 类型
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
}

// 扩展 Next.js 的 Page 组件类型
declare module 'next' {
  interface NextPage<P = {}, IP = P> {
    (props: P): React.ReactElement<any, any> | null;
    getInitialProps?(context: any): IP | Promise<IP>;
  }
} 
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

//QueryClient是react-query管理和缓存远程数据的核心；
const queryClient = new QueryClient();
//   {
//   defaultOptions: {
//     queries: {
//       // retry重新获取次数；如果查询失败，react-query将会重新请求3次；
//       retry: 3,
//       // cacheTime缓存时间；如果query没有观察者observe，即没有组件正在使用当前query，这个query就被认为是inactive非活动的，就会在5分钟后从缓存中删除，即垃圾收集；
//       cacheTime: 300_000, //5分钟
//       // staleTime过时时间；指定数据现在被认为是新鲜的时间，设置为0，意味着从得到一条数据的那一刻起j就被视为旧的，所以下次我们需要同一条数据时，react-query将从后端重新获取数据；设置为10，意味着10秒之后这条数据就是旧的；
//       staleTime: 10 * 1000, //10秒
//       // react-query在三种情况下，会自动刷新旧数据： 1.网络重新连接时；如果不需要在这种情况下刷新，refetchOnWindowFocus:false;  2.加载组件时；如果不需要在这种情况下刷新，refetchOnMount:false；  3.当浏览器窗口重新聚焦时；如果不需要在这种情况下刷新，refetchOnReconnect:false；
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: false,
//       refetchOnMount: false,
//       // refetchOnMount:true，意味着组件第一次加载安装时获取query，一般都是需要这样；
//     },
//   },
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);

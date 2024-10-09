import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostQuery {
  // userId: number | undefined;
  // page: number;
  pageSize: number;
}
const usePosts = (query: PostQuery) =>
  useInfiniteQuery<Post[], Error>({
    // 这里对数据分层，应该遵循一个层次结构来表示我们的对象之间的关系，从顶层对象开始，这与我们在为 AP |设计 U RL 时遵循的模式相同，比如，如果您想构建一个 API来获取用户的帖子，我们将添加一个像这样的  /users/userId/posts   ==>   /users/1/posts
    // 我们在这里遵循同样的模式，所以当我们从左到右这样列queryKey，数据变得更具体了。
    // 每次userId改变时，react-query将从后端获取该用户的帖子，这与useEffect钩子依赖数组很类似；
    // queryKey: userId ? ["users", userId, "posts"] : ["posts"],

    //query的值变化，react-query会重新请求数据；
    queryKey: ["posts", query],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          //请求数据的参数
          params: {
            _start: (pageParam - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then((res) => res.data),
    //数据缓存的过时时间
    staleTime: 10 * 6 * 1000, //1分钟
    //不显示加载刷新页面的效果，直接用当前数据替代旧数据
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      //1 -> 2
      return allPages.length > 0 ? allPages.length + 1 : undefined;
    },
  });

export default usePosts;

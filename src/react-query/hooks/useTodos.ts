import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CACHE_KEY_TODOS } from "./constants";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}
const useTodos = () => {
  const fetchTodos = () =>
    axios
      // 返回的数据是Todo类型的数组
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.data);
  // react-query会自动重试（如果对服务器请求数据失败，react-query会自动重试几次，这个可以配置），自动刷新（一段时间后自动刷新数据，这个可以配置），会缓存（第一次获取到数据后，它就存储在缓存中，并在一定时间内保持新鲜，下次我们需要相同的数据时，如果它仍在缓存中，不会再去请求服务器，而是直接去缓存里获取）。

  // useQuery返回的对象里有data,error,isLoading等数据，这里将useQuery返回的数据对象里的data解构出来，并重命名为todos；
  // axios的所有error都是所有浏览器可用的error接口的实例；所以要指定在获取数据时可能发生的error类型；

  return useQuery<Todo[], Error>({
    queryKey: CACHE_KEY_TODOS,
    queryFn: fetchTodos,
    //将当前数据缓存的过时时间设置为10秒钟
    staleTime: 10 * 1000,
  });
};

export default useTodos;

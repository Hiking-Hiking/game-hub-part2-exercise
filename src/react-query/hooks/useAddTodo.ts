import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Todo } from "./useTodos";
import { CACHE_KEY_TODOS } from "./constants";

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();
  //在useMutation ({})时，给参数提供泛类型；第一个参数是我们从后端获取的数据，第二个参数是错误，第三个参数是我们发送到后端的数据;
  // 第一个参数是Tdata，这代表我们从后端获取的数据，在本例中是一个Todo对象；第二个参数是Terror，代表错误，将成为一个Error对象；第三个参数是Tvariables，是变量，代表我们现在发送到后端的数据，在本例中是一个Todo对象；
  // 在某些应用场景中，我们发送到后端的数据与我们从后端响应中获取到的数据类型不同，在这些情况下，我们将有不同的接口类型来表示输入和输出；
  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        //对发送的数据进行类型限定
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),

    //onmutate函数在突变mutation被执行之前调用；参数是变量，这里称为newTodo，指的是输入，我们发送到后端的数据，
    onMutate: (newTodo: Todo) => {
      // 拿到更新之前存储的数据，注意，previousTodos可能为空数组；
      const previousTodos =
        queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
      //用CACHE_KEY_TODOS替换掉['todos'];给todos设置默认值为空数组[]，这样就不用在展开数组的时候再用或来展开 ...(todos || [])
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos = []) => [
        newTodo,
        ...todos,
      ]);
      onAdd();
      // 返回一个包含previousTodos属性的对象，这个对象即上下文。
      return { previousTodos };
    },
    //请求数据成功之后的操作；savedTodo 是后台返回的数据,newTodo是我们传递的数据
    onSuccess: (savedTodo, newTodo) => {
      // console.log(savedTodo);
      // console.log(newTodo);
      //有两个更新列表的选项,用useQueryClient：第一种方法是，使缓存失效，用useQueryClient；第二种方法是，直接更新缓存中的数据；
      // -------------------------------------------
      // 第一种方法是，使缓存失效，用useQueryClient；
      // 我们告诉react-query，我们在缓存中的内容无效，那么react-query现在将从后端重新获取数据，但是这种方法不适合我们在用的jsonplaceholder接口，因为我们发送到后端的对象并没有真正保存，因为这是一个假的api；
      // APPROACH 1: Invalidating the cache
      // queryClient.invalidateQueries({
      //   // 调用queryClient来使查询无效并给它一个对象，这将使所有以 todos开头的键查询无效，但这个方法对我们使用的jsonplaceholder接口无效，因为是假api
      //   queryKey: CACHE_KEY_TODOS,
      // });
      // ---------------------------------------------
      //第二种方法是，直接更新缓存中的数据，用queryClient.setQueryData；
      // APPROAChl 2: Updating the data in the cache
      // queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) => [
      //   savedTodo,
      //   ...(todos || []),
      // ]);
      // if (ref.current) ref.current.value = "";
      // --------------------------------
      // savedTodo是后端返回的数据，newTodo是我们在客户端的输入，发送给后端的数据
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
        // 找到queryKey为'todos'的缓存，迭代这个数组并检查，如果当前的todo与我们输入的newTodo相同，就用后端返回的savedTodo替代掉当前todo项，否则还是返回相同的todo项；
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context?.previousTodos);
    },
  });
};
export default useAddTodo;

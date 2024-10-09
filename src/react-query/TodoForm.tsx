import { useRef } from "react";
import useAddTodo from "./hooks/useAddTodo";

const TodoForm = () => {
  const addTodo = useAddTodo(() => {
    if (ref.current) ref.current.value = "";
  });
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {addTodo.error && (
        <div className="alert alert-danger">{addTodo.error.message}</div>
      )}
      <form
        className="row mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          //先判断输入值是否为空，如果有值再进行提交
          if (ref.current && ref.current.value)
            //调用addTodo.mutate()方法，而不是addTodo()；
            //所有突变对象都有一个用于变异数据的mutate方法，当我们调用addTodo.mutate()方法时，react-query会使用mutationFn将我们的数据发送到后端；
            addTodo.mutate({
              id: 0,
              title: ref.current?.value,
              completed: false,
              userId: 1,
            });
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary">
            {addTodo.isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;

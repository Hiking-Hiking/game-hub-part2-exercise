import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// 这里为什么要用类class来封装apiClient，原因有如下几个：
//1. 状态管理:
// 类允许你更容易地管理状态。在这个例子中，`endpoint` 是一个需要在多个方法中共享的状态。使用类，你可以在构造函数中初始化它，然后在所有方法中访问它。

// 2. 实例化和复用:
//    使用类，你可以创建多个实例，每个实例都有自己的 `endpoint`。这在处理多个API端点时非常有用。例如:

//    ```typescript
//    const usersAPI = new APIClient<User>('/users');
//    const postsAPI = new APIClient<Post>('/posts');
//    ```

// 3. 类型安全:
//    通过使用泛型 `<T>`，这个类为不同的数据类型提供了类型安全。这在 TypeScript 中特别有用，可以在编译时捕获类型错误。

// 4. 扩展性:
//    类更容易扩展。如果你稍后决定添加更多方法或属性，可以很容易地将它们添加到类中，而不会影响现有的代码。

// 5. 面向对象编程:
//    类提供了一种更面向对象的方法来组织代码，这可能与某些开发者的编程风格更相符。

// 6. this 上下文:
//    在类中，`this` 关键字自动绑定到当前实例，这使得在方法中引用其他方法或属性变得更简单。

// 虽然使用类有这些优点，但也值得注意的是，在某些情况下，使用函数可能更简单、更直接。例如，如果你不需要维护状态或创建多个实例，函数可能就足够了。

// 使用工厂函数：
// function createAPIClient<T>(endpoint: string) {
//   return {
//     getAll: () => axiosInstance.get<T[]>(endpoint).then((res) => res.data),
//     post: (data: T) => axiosInstance.post<T>(endpoint, data).then((res) => res.data)
//   };
// }

class APIClient<T> {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  getAll = () => {
    // debugger;
    return axiosInstance.get<T[]>(this.endpoint).then((res) => res.data);
  };
  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };
}
export default APIClient;

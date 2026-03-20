import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./component/user/Home";
import Login from "./component/user/LoginNew";
import UserInfo from "./component/user/UserInfo";
import Error from "./component/Error";
import Register from "./component/user/Register";
import MyPage, {myPageLoader} from "./component/user/MyPage";
import MyInfo, {myInfoLoader} from "./component/user/MyInfo";
import ResetPassword from "./component/user/ResetPassword";
import Post, {postLoader} from "./component/post/Post";
import PostDetail, {postDetailLoader} from "./component/post/PostDetail";
import PostEdit, {postEditLoader} from "./component/post/PostEdit";

const router = createBrowserRouter([
  {path: "/", element: <MyPage />, loader: myPageLoader},
  {path: "/register", element: <Register />},
  {
    path: "/user",
    element: <UserInfo />,
    children: [{path: ":id", element: <UserInfo />}],
  },
  {path: "/login", element: <Login />},
  {path: "/reset/password", element: <ResetPassword />},
  {path: "/mypage", element: <MyPage />, loader: myPageLoader},
  {path: "/myinfo", element: <MyInfo />, loader: myInfoLoader},
  {path: "/test", element: <MyPage />, loader: myPageLoader},
  {path: "/post", element: <Post />, loader: postLoader},
  {
    path: "/post/detail/:postingId",
    element: <PostDetail />,
    loader: postDetailLoader,
  },
  {
    path: "/post/edit/:postingId",
    element: <PostEdit />,
    loader: postEditLoader,
  },
  {path: "/*", element: <Error />},
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

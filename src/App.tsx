import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./component/user/Home";
import Login from "./component/user/Login";
import UserInfo from "./component/user/UserInfo";
import MyPage from "./component/Test";
import Error from "./component/Error";
import Register from "./component/user/Register";
import Test from "./component/user/MyPage";
import MyInfo from "./component/user/MyInfo";
import ResetPassword from "./component/user/ResetPassword";
import Post from "./component/post/Post";
import PostDetail from "./component/post/PostDetail";
import PostEdit from "./component/post/PostEdit";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserInfo />}>
          <Route path=":id" element={<UserInfo />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/reset/password" element={<ResetPassword />} />
        <Route path="/mypage" element={<Test />} />
        <Route path="/myinfo" element={<MyInfo />} />
        <Route path="/test" element={<MyPage />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/detail/:postingId" element={<PostDetail />} />
        <Route path="/post/edit/:postingId" element={<PostEdit />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;

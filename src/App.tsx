import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import UserInfo from "./component/UserInfo";
import MyPage from "./component/Test";
import Error from "./component/Error";
import Register from "./component/Register";
import Test from "./component/MyPage";
import ResetPassword from "./component/ResetPassword";

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
        <Route path="/test" element={<MyPage />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;

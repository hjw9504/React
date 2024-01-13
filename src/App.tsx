import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Index from "./component/Index";
import MyPage from "./component/MyPage";
import Error from "./component/Error";
import Register from "./component/Register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/index" element={<Index />}>
          <Route path=":id" element={<Index />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;

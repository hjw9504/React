import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function MyPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [data, setData] = useState(null);

  useLayoutEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => {
        setData(response.data);
      });

      setIsLogin(true);
      console.log(isLogin);
      // if (!isLogin) {
      //   // return <Navigate to="/login" replace={true} />;
      //   setIsLogin(true)
      //   console.log(isLogin);
      // }
  }, []);

  function onClick() {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/2")
      .then((response) => {
        setData(response.data);
      });
  }
  
  return (
    <div>
      <h1>MyPage</h1>
      <p>MyPage 페이지입니다.</p>

      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readOnly={true}
        />
      )}
    </div>
  );
}
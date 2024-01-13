import axios from "axios";
import {useEffect, useLayoutEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

export default function MyPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      });

    checkLogin();
    console.log("useLayoutEffect: ", isLogin);
  }, []);

  useEffect(() => {});

  const checkLogin = () => {
    console.log("Login: ", isLogin);
    if (input === "5") {
      setIsLogin(false);
      navigate("login");
    }
  };

  const onClick = async () => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${input}`)
        .then((res) => res.json())
        .then((res) => onHandleData(res));

      checkLogin();
    } catch (err) {
      console.log(err);
    }
  };

  const onHandleData = (response: any) => {
    setData(response);
  };

  return (
    <div>
      <h1>MyPage</h1>
      <p>MyPage 페이지입니다.</p>
      <div>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && <textarea rows={7} value={data["title"]} readOnly={true} />}
    </div>
  );
}

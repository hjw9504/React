import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function MyPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(response => response.json())
    .then(response => {
      setData(response);
    })

      setIsLogin(true);
      console.log(isLogin);
  }, []);

  useEffect(() => {
    // return <Navigate to="/login" replace={true} />;
    setIsLogin(false);
  })

  async function onClick() {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${input}`)
      const response = await res.json();
      setData(response);
      console.log(isLogin);
    }
    catch(err) {
      console.log(err);
    }
  }
  
  return (
    <div>
      <h1>MyPage</h1>
      <p>MyPage 페이지입니다.</p>
      <div>
        <input
        value = {input}
        onChange = {(e)=>{
            setInput(e.target.value);
        }}/>
      </div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={data['title']}
          readOnly={true}
        />
      )}
    </div>
  );
}

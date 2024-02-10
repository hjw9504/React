import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";
import cookie from "react-cookies";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    console.log("useLayoutEffect: ", isLogin);
  }, []);

  useEffect(() => {
    const token = cookie.load("token");
    if (token === undefined) {
      navigate("/login");
    }
  });

  useEffect(() => {});

  return (
    <div className="Home">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}

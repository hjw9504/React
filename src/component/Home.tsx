import {Link, Navigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  useLayoutEffect(() => {
    console.log("useLayoutEffect: ", isLogin);
  }, []);

  useEffect(() => {});

  return (
    <div className="Home">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}

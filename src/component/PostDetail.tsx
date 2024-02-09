import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog} from "@headlessui/react";
import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Headers from "../utils/Headers";
import cookie from "react-cookies";

export default function UserInfo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [post, setPost] = useState({
    id: "",
    memberId: "",
    title: "",
    body: "",
    registerTime: "",
    modTime: "",
    name: "",
  });
  const [postingId, setPostingId] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getPostingDetail();
  }, []);

  const getPostingId = (id: any) => {
    setPostingId(id);
  };

  const getPostingDetail = async () => {
    await fetch(
      `/posting/detail/${params.postingId}?memberId=${cookie.load("memberId")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res.resultData);
        setPost(res.resultData);
      });
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <Headers />

      <div></div>
    </div>
  );
}

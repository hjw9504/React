import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog} from "@headlessui/react";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Headers from "../utils/Headers";
import cookie from "react-cookies";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Alert from "../utils/Alert";

const modules = {
  toolbar: {
    container: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [{font: []}],
      [{align: []}],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{list: "ordered"}, {list: "bullet"}, "link"],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
        {background: []},
      ],
      ["image", "video"],
      ["clean"],
    ],
  },
};

export default function PostDetail() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotUser, setIsNotUser] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useLayoutEffect(() => {
    getPostingDetail();

    if (cookie.load("role") === "ADMIN") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (showAlert) {
      let showAlertTimer = setTimeout(() => {
        setShowAlert(false);
        navigate(`/post/detail/${params.postingId}`);
      }, 1000);
      return () => {
        clearTimeout(showAlertTimer);
      };
    }

    if (isNotUser) {
      let isNotUserTimer = setTimeout(() => {
        setIsNotUser(false);
        navigate(`/post/detail/${params.postingId}`);
      }, 1000);
      return () => {
        clearTimeout(isNotUserTimer);
      };
    }
  }, [showAlert, isNotUser]);

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
        setPost(res.resultData);
        setBody(res.resultData.body);
        setTitle(res.resultData.title);
      });
  };

  const onSaveTitle = (event: any) => {
    setTitle(event.target.value);
  };

  const onSavePost = (text: any) => {
    setBody(text);
  };

  const onEditPost = async () => {
    if (!isAdmin && cookie.load("memberId") !== post.memberId) {
      setIsNotUser(true);
      return;
    }

    const data = {
      id: params.postingId,
      memberId: cookie.load("memberId"),
      title: title,
      body: body,
    };
    await fetch(`/posting/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: cookie.load("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setShowAlert(true);
      });
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <Headers />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Post Edit
          </h2>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
          </div>
          <div className="flex mt-2 my-2">
            <input
              id="title"
              value={title}
              onChange={onSaveTitle}
              name="title"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <ReactQuill value={body} onChange={onSavePost} modules={modules} />
        </div>
        <div>
          {showAlert ? (
            <Alert alertMessage="Success" alertType="alert-success" />
          ) : null}
        </div>
        <div>
          {isNotUser ? (
            <Alert
              alertMessage="You can't edit this post"
              alertType="alert-error"
            />
          ) : null}
        </div>
        <div className="flex justify-end pt-5 mr-5">
          <a className="tooltip tooltip-right" data-tip="Home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={onEditPost}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

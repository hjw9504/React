import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import cookie from "react-cookies";

const REFRESH_MARGIN_MS = 5 * 60 * 1000; // 만료 5분 전 refresh

function getJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function saveCookies(accessToken: string, refreshToken: string) {
  const expires = new Date();
  expires.setHours(expires.getHours() + 2);
  cookie.save("accessToken", accessToken, {path: "/", expires});
  cookie.save("refreshToken", refreshToken, {path: "/", expires});
}

export function useTokenRefresh() {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doRefresh = async () => {
    const refreshToken = cookie.load("refreshToken");
    const memberId = cookie.load("memberId");
    if (!refreshToken || !memberId) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/token/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-refresh-token": refreshToken,
        },
        body: JSON.stringify({member_id: memberId}),
      });
      const data = await res.json();
      if (data.error_code === 0) {
        const {access_token, refresh_token} = data.result_data;
        saveCookies(access_token, refresh_token);
        scheduleRefresh(access_token);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  };

  const scheduleRefresh = (accessToken: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const exp = getJwtExp(accessToken);
    if (!exp) return;
    const delay = exp - Date.now() - REFRESH_MARGIN_MS;
    if (delay <= 0) {
      doRefresh();
      return;
    }
    timerRef.current = setTimeout(doRefresh, delay);
  };

  useEffect(() => {
    const accessToken = cookie.load("accessToken");
    if (accessToken) {
      scheduleRefresh(accessToken);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import cookie from "react-cookies";

type Step = "terms" | "profile";

export default function Terms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromIdp = searchParams.get("from") === "idp";

  const [step, setStep] = useState<Step>("terms");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 프로필 입력 (IDP 전용)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");

  const canProceed = agreeService && agreePrivacy && agreeAge;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
    setAgreeAge(checked);
  };

  const handleIndividual = (setter: (v: boolean) => void, value: boolean) => {
    setter(value);
    if (!value) setAgreeAll(false);
    else {
      setTimeout(() => {
        setAgreeAll(agreeService && agreePrivacy && agreeAge);
      }, 0);
    }
  };

  const setCookie = (cookieName: string, cookieValue: string) => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);
    cookie.save(cookieName, cookieValue, {path: "/", expires});
  };

  // 약관 동의 완료
  const handleProceed = () => {
    if (!canProceed) return;
    if (fromIdp) {
      setStep("profile");
    } else {
      navigate("/register");
    }
  };

  // IDP 프로필 입력 후 회원가입 + 로그인
  const handleProfileSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setProfileError("이름과 이메일을 모두 입력해주세요.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setProfileError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    const stored = sessionStorage.getItem("idp_pending");
    if (!stored) {
      navigate("/login");
      return;
    }
    const {idp_token, idpType} = JSON.parse(stored);
    setIsProcessing(true);
    setProfileError("");

    const headers = {"Content-Type": "application/json"};

    try {
      await fetch(`/api/user/idp/register`, {
        method: "POST",
        headers,
        body: JSON.stringify({idpType, idp_token, name: name.trim(), email: email.trim()}),
      });

      const loginRes = await fetch(`/api/user/idp/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({idpType, idp_token}),
      });
      const loginData = await loginRes.json();

      if (loginData.error_code === 0) {
        const user = loginData.result_data;
        setCookie("accessToken", user.access_token);
        setCookie("refreshToken", user.refresh_token);
        setCookie("name", user.name);
        setCookie("memberId", user.member_id);
        setCookie("role", user.role);
        setCookie("userId", user.user_id);
        sessionStorage.removeItem("idp_pending");
        window.location.href = "/mypage";
      } else {
        setProfileError("회원가입에 실패했습니다. 다시 시도해주세요.");
        setIsProcessing(false);
      }
    } catch {
      setProfileError("오류가 발생했습니다. 다시 시도해주세요.");
      setIsProcessing(false);
    }
  };

  const sections = [
    {
      key: "service",
      title: "서비스 이용약관 (필수)",
      checked: agreeService,
      setter: setAgreeService,
      content: `제1조 (목적)
본 약관은 JUNGS(이하 "서비스")의 이용조건 및 절차에 관한 기본적인 사항을 규정합니다.

제2조 (이용약관의 효력)
본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.

제3조 (서비스 이용)
회원은 서비스를 통해 게시글 작성, 팔로우, 댓글 등의 기능을 이용할 수 있습니다.

제4조 (금지행위)
회원은 타인의 명예를 훼손하거나 불법적인 콘텐츠를 게시해서는 안 됩니다.

제5조 (서비스 변경 및 중단)
운영상 필요에 따라 서비스 내용을 변경하거나 중단할 수 있습니다.`,
    },
    {
      key: "privacy",
      title: "개인정보 수집 및 이용 동의 (필수)",
      checked: agreePrivacy,
      setter: setAgreePrivacy,
      content: `1. 수집하는 개인정보 항목
- 필수: 아이디, 비밀번호, 이름, 이메일
- 소셜 로그인: 카카오 계정 정보 (닉네임, 프로필 이미지)

2. 개인정보의 수집 및 이용 목적
- 회원 가입 및 관리
- 서비스 제공 및 개선
- 본인 확인 및 불량 회원 방지

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 보유 후 즉시 파기
- 단, 관련 법령에 따라 일정 기간 보존될 수 있습니다.

4. 동의 거부 권리
개인정보 수집·이용에 동의를 거부할 수 있으나, 필수 항목 미동의 시 서비스 이용이 제한됩니다.`,
    },
    {
      key: "age",
      title: "만 14세 이상 확인 (필수)",
      checked: agreeAge,
      setter: setAgreeAge,
      content: `본 서비스는 만 14세 이상만 이용 가능합니다.

만 14세 미만의 아동은 법정대리인(부모 등)의 동의 없이 개인정보를 제공할 수 없으며, 서비스 가입이 제한됩니다.

만 14세 이상임을 확인하고 동의합니다.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

        {/* ── 스텝 인디케이터 (IDP 전용) ── */}
        {fromIdp && (
          <div className="flex px-6 pt-5 gap-2">
            {["약관 동의", "정보 입력"].map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${i === (step === "terms" ? 0 : 1)
                    ? "bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md"
                    : i < (step === "terms" ? 0 : 1)
                    ? "bg-green-400 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
                  {i < (step === "terms" ? 0 : 1) ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === (step === "terms" ? 0 : 1) ? "text-orange-500" : "text-gray-400 dark:text-gray-500"}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-16 h-0.5 bg-gray-200 dark:bg-gray-700 hidden" />
          </div>
        )}

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 px-6 py-5 mt-3">
          <h1 className="text-xl font-extrabold text-white">
            {step === "profile" ? "프로필 설정" : "서비스 이용약관"}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {step === "profile"
              ? "서비스 이용을 위해 정보를 입력해주세요"
              : fromIdp ? "카카오 계정으로 가입하기 전 약관에 동의해주세요"
              : "회원가입 전 약관에 동의해주세요"}
          </p>
        </div>

        {/* ── 프로필 입력 스텝 ── */}
        {step === "profile" && (() => {
          const stored = sessionStorage.getItem("idp_pending");
          const idpType = stored ? JSON.parse(stored).idpType : "kakao";
          const isNaver = idpType === "naver";
          const isGoogle = idpType === "google";
          const providerLabel = isNaver ? "네이버" : isGoogle ? "구글" : "카카오";
          return (
          <div className="p-6 space-y-5">
            {/* 소셜 배너 */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
              isNaver
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                : isGoogle
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${
                isNaver ? "bg-[#03C75A] border-transparent"
                : isGoogle ? "bg-white border-gray-200"
                : "bg-yellow-400 border-transparent"
              }`}>
                {isNaver ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                  </svg>
                ) : isGoogle ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                    <path d="M12 3C6.477 3 2 6.597 2 11c0 2.775 1.638 5.206 4.1 6.652l-.9 3.568a.3.3 0 0 0 .462.322l4.347-2.903C10.63 18.877 11.307 19 12 19c5.523 0 10-3.597 10-8S17.523 3 12 3z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {providerLabel} 계정으로 가입
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">아래 정보를 입력하면 가입이 완료됩니다</p>
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                이름 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setProfileError(""); }}
                placeholder="실명을 입력해주세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent
                           transition-all duration-200"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                이메일 <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setProfileError(""); }}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent
                           transition-all duration-200"
              />
            </div>

            {/* 에러 메시지 */}
            {profileError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setStep("terms")}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                           text-gray-600 dark:text-gray-300 font-semibold text-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
                           disabled:opacity-50"
              >
                ← 이전
              </button>
              <button
                onClick={handleProfileSubmit}
                disabled={isProcessing || !name.trim() || !email.trim()}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white
                           bg-gradient-to-r from-orange-400 to-rose-400
                           hover:from-orange-500 hover:to-rose-500
                           shadow-md transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    가입 중...
                  </span>
                ) : "가입 완료 →"}
              </button>
            </div>
          </div>
          );
        })()}

        {/* ── 약관 동의 스텝 ── */}
        {step === "terms" && (
        <div className="p-6 space-y-4">
          {/* 전체 동의 */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => handleAgreeAll(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500 cursor-pointer"
            />
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                전체 동의
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                필수 약관에 모두 동의합니다
              </p>
            </div>
          </label>

          {/* 구분선 */}
          <div className="border-t border-gray-100 dark:border-gray-700" />

          {/* 개별 약관 */}
          <div className="space-y-3">
            {sections.map((s) => (
              <div
                key={s.key}
                className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4">
                  <input
                    type="checkbox"
                    checked={s.checked}
                    onChange={(e) =>
                      handleIndividual(s.setter, e.target.checked)
                    }
                    className="w-4 h-4 rounded accent-orange-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {s.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === s.key ? null : s.key
                      )
                    }
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-orange-500 flex-shrink-0 transition-colors"
                  >
                    {expandedSection === s.key ? "접기 ▲" : "보기 ▼"}
                  </button>
                </div>
                {expandedSection === s.key && (
                  <div className="px-4 pb-4">
                    <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {s.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 동의 버튼 */}
          <button
            onClick={handleProceed}
            disabled={!canProceed || isProcessing}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 mt-2
              ${
                canProceed
                  ? "bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
          >
            {isProcessing
              ? "처리 중..."
              : canProceed
              ? "동의하고 시작하기 →"
              : "필수 약관에 모두 동의해주세요"}
          </button>

          {/* 뒤로가기 */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            취소하고 돌아가기
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

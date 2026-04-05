import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import cookie from "react-cookies";

export default function Terms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromIdp = searchParams.get("from") === "idp";

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleProceed = async () => {
    if (!canProceed) return;

    if (fromIdp) {
      // IDP 회원가입 처리
      const stored = sessionStorage.getItem("idp_pending");
      if (!stored) {
        navigate("/login");
        return;
      }
      const {accessToken, idpType} = JSON.parse(stored);
      setIsProcessing(true);

      const body = JSON.stringify({idpType, accessToken});
      const headers = {"Content-Type": "application/json"};

      try {
        await fetch(`/api/user/idp/register`, {method: "POST", headers, body});

        const loginRes = await fetch(`/api/user/idp/login`, {
          method: "POST",
          headers,
          body,
        });
        const loginData = await loginRes.json();

        if (loginData.error_code === 0) {
          const user = loginData.result_data;
          setCookie("accessToken", user.access_token);
          setCookie("name", user.name);
          setCookie("memberId", user.member_id);
          setCookie("role", user.role);
          setCookie("userId", user.user_id);
          sessionStorage.removeItem("idp_pending");
          window.location.href = "/mypage";
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/register");
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
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 px-6 py-5">
          <h1 className="text-xl font-extrabold text-white">서비스 이용약관</h1>
          <p className="text-sm text-white/80 mt-1">
            {fromIdp ? "카카오 계정으로 가입하기 전" : "회원가입 전"} 약관에
            동의해주세요
          </p>
        </div>

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
      </div>
    </div>
  );
}

# JUNGS - 소셜 블로깅 플랫폼

React + TypeScript로 구축된 소셜 미디어/블로깅 웹 애플리케이션입니다.

## 주요 기능

- **회원 관리** - 회원가입, 로그인, 비밀번호 재설정, 프로필 수정
- **소셜 로그인** - 카카오 OAuth 지원
- **게시글** - 작성, 조회, 수정, 삭제 (소유자 권한 검증)
- **소셜 기능** - 좋아요, 댓글
- **다크 모드** - localStorage 기반 테마 유지
- **반응형 디자인** - Tailwind CSS 기반 모바일/데스크탑 지원

## 기술 스택

| 분류      | 기술                                     |
| --------- | ---------------------------------------- |
| Framework | React 18, TypeScript                     |
| Routing   | React Router DOM 6                       |
| Styling   | Tailwind CSS, DaisyUI, Material Tailwind |
| Auth      | 쿠키 기반 JWT, Kakao OAuth               |
| HTTP      | Fetch API                                |
| Deploy    | AWS EC2 (Ubuntu)                         |

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.
API 요청은 백엔드 서버로 프록시됩니다.

### 프로덕션 빌드

```bash
npm run build
```

### 배포

```bash
npm run deploy
```

AWS EC2 서버의 `/var/www/html/`에 SCP로 업로드됩니다.

## 프로젝트 구조

```
src/
├── component/
│   ├── user/       # 회원가입, 로그인, 프로필, OAuth
│   ├── post/       # 게시글 목록, 상세, 작성, 수정
│   └── utils/      # 공통 헤더, 알림 컴포넌트
├── App.tsx         # 라우터 설정 및 데이터 로더
├── index.tsx       # 앱 진입점
└── setUpProxy.ts   # 개발 환경 API 프록시
```

## 라우팅

| 경로               | 설명                      |
| ------------------ | ------------------------- |
| `/`                | 메인 피드 (리다이렉트)    |
| `/login`           | 로그인                    |
| `/register`        | 회원가입                  |
| `/reset/password`  | 비밀번호 재설정           |
| `/mypage`          | 게시글 피드               |
| `/myinfo`          | 내 프로필                 |
| `/post`            | 게시글 작성               |
| `/post/detail/:id` | 게시글 상세 (좋아요/댓글) |
| `/post/edit/:id`   | 게시글 수정               |
| `/user/:id`        | 유저 프로필               |
| `/idp/result`      | OAuth 콜백                |

## 환경 변수

`.env.development` / `.env.production` 파일에 설정:

```env
REACT_APP_AUTH_SERVER=<백엔드 서버 URL>
```

## 인증 방식

로그인 성공 시 쿠키에 다음 정보를 저장합니다 (60분 만료):

| 쿠키           | 설명                |
| -------------- | ------------------- |
| `access_token` | 인증 토큰           |
| `name`         | 사용자 이름         |
| `memberId`     | 사용자 ID           |
| `role`         | 권한 (USER / ADMIN) |
| `userId`       | 로그인 아이디       |

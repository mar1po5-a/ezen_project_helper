import { useNavigate } from "react-router-dom";
import NoticeSection from "../components/NoticeSection";
import FloatingBanner from "../components/FloatingBanner";
import { useAuth } from "../contexts/AuthContext";

function MainPage() {

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 챗봇 링크 클릭 시 호출될 함수
  const handleChatbotClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) { // 로그인 상태가 아닐 경우
      alert("로그인 후 이용 가능합니다.");
      navigate("/auth/login"); // 로그인 페이지로 이동
    } else {
      // 로그인 상태일 경우, 챗봇 페이지로 이동 (원래 Link가 하던 역할)
      navigate("/member/chatbot/ask"); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 relative">
      {/* 공지사항 섹션 */}
      <NoticeSection />

      {/* 중앙 메인 콘텐츠 */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-10 mt-10 mb-16">
        {/* 서비스 타이틀 */}
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight leading-snug text-center">
          정부 정책 안내 챗봇
        </h1>

        {/* 서비스 소개 문구 + 이미지 */}
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl text-center md:text-left">
          {/* 텍스트 소개 */}
          <div className="flex-1 space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              정부 정책 안내 챗봇은 복잡한 정책 정보를 쉽게 검색하고 이해할 수 있도록 도와주는
              서비스입니다. 필요한 정책을 빠르게 찾아보고, 궁금한 점은 챗봇에게 직접 질문하세요.
            </p>
            <p className="text-gray-500 text-sm">
              누구나 쉽고 빠르게 정책 정보를 확인할 수 있도록 설계되었습니다.
            </p>
          </div>

          {/* 대표 이미지 */}
          <div className="flex-1 max-w-sm">
<img
  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjhsaG01eGc2ZWoyc3VxaGV1MjF6eDVwMXMwNTI4Zndqa2ljNXdmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/0uQv3gEQAGCXhtq6ZQ/giphy.gif"
  alt="서비스 소개 이미지"
  className="w-full object-cover"
/>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button
            onClick={handleChatbotClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded text-lg shadow transition duration-300"
          >
            챗봇 바로가기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 정부 정책 안내 챗봇 서비스
      </footer>

      {/* 플로팅 배너 */}
      <FloatingBanner />
    </div>
  );
}

export default MainPage;

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // useAuth 훅 임포트

const Navbar = () => {
  // ***핵심: memberId와 isLoggedIn 상태를 useAuth 훅으로 가져옵니다.***
  const { memberId, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // 로그아웃 버튼 클릭
  const handleLogout = async (e) => {
    e.preventDefault();
    const success = await logout(); // AuthContext의 logout 함수 호출
    if (success) {
      navigate("/"); // 로그아웃 성공 시 홈으로 이동
    }
  };

  // 로그인 상태가 아닌데 챗봇 버튼 클릭 시시
  const handleChatbotClick = (e) => {
    alert("로그인 후 이용할 수 있습니다.");
    navigate("/auth/login");
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        정책 챗봇
      </Link>
      <div className="space-x-4">
        <Link to="/user/notice/list" className="text-gray-700 hover:text-blue-600 font-medium">
          공지사항
        </Link>
        {isLoggedIn ? (
          <Link to="/member/chatbot/ask" className="text-gray-700 hover:text-blue-600 font-medium">
            챗봇
          </Link>) :
          (<button onClick={handleChatbotClick} className="text-gray-700 hover:text-blue-600 font-medium">
            챗봇
          </button>)
        }
        <Link to="user/qna/list" className="text-gray-700 hover:text-blue-600 font-medium">
          Q&A
        </Link>
        {/* ***핵심: isLoggedIn 상태에 따라 조건부 렌더링*** */}
        {isLoggedIn ? (
          <span className="text-gray-700 font-medium">
            {memberId}님
          </span>
        ) : (
          <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
            로그인
          </Link>
        )}
        {/* ***핵심: isLoggedIn 상태에 따라 조건부 렌더링*** */}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 font-medium">
            로그아웃
          </button>
        ) : (
          <Link to="/auth/signup" className="text-gray-700 hover:text-blue-600 font-medium">
            회원가입
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
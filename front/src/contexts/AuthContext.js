import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_IP } from '../Config';

// 1. AuthContext 생성
// 기본값은 { memberId: null, isLoggedIn: false, login: () => {}, logout: () => {}, checkAuthStatus: () => {} }
// 이 기본값은 컨텍스트를 사용할 때 자동 완성(intellisense)에 도움을 줍니다.
export const AuthContext = createContext({
  memberId: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  checkAuthStatus: () => {},
});

// 2. AuthProvider 컴포넌트 생성
// 이 컴포넌트가 로그인 상태를 관리하고 하위 컴포넌트에 제공합니다.
export const AuthProvider = ({ children }) => {
  const [memberId, setMemberId] = useState(null); // 로그인한 사용자의 ID (없으면 null)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

  // 인증 상태를 확인하는 함수
  const checkAuthStatus = async () => {
    const requestUrl = `http://${API_IP}/auth/getId.do`;
    try {
      const res = await axios.get(requestUrl, { withCredentials: true });
      if (res.data) {
        setMemberId(res.data);
        setIsLoggedIn(true);
        console.log("인증 상태 확인: 로그인됨 -", res.data);
      } else {
        setMemberId(null);
        setIsLoggedIn(false);
        console.log("인증 상태 확인: 로그아웃됨");
      }
    } catch (error) {
      setMemberId(null);
      setIsLoggedIn(false);
      console.error("인증 상태 확인 오류:", error);
    }
  };

  // 컴포넌트가 마운트될 때, 초기 인증 상태를 확인합니다.
  useEffect(() => {
    checkAuthStatus();
  }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 한 번만 실행

  // 로그인 처리 함수 (외부에서 호출될 수 있음, 예: 로그인 페이지에서)
  const login = (id) => {
    setMemberId(id);
    setIsLoggedIn(true);
    console.log("로그인 처리:", id);
    // 실제 로그인 API 호출은 로그인 페이지에서 담당하고, 여기서는 상태만 업데이트합니다.
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    const requestUrl = `http://${API_IP}/auth/logout.do`;
    try {
      // 서버에 로그아웃 요청
      const response = await axios.post(requestUrl, { member_id: memberId }, { withCredentials: true });
      alert("성공적으로 로그아웃되었습니다. 메인페이지로 이동합니다."); // 서버 응답 메시지 표시
      
      // 상태 초기화
      setMemberId(null);
      setIsLoggedIn(false);
      console.log("로그아웃 처리 완료");

      // 로그아웃 후 홈으로 리다이렉트
      // navigate('/) 는 이 AuthProvider 에서는 직접 사용하기 어렵습니다.
      // 로그아웃을 호출하는 컴포넌트(예: Navbar)에서 navigate를 처리합니다.
      return true; // 로그아웃 성공 여부 반환 (선택 사항)
    } catch (error) {
      alert("로그아웃 중 알 수 없는 오류 발생했습니다. 다시 시도해주시기 바랍니다.");
      console.error("로그아웃 오류:", error);
      return false; // 로그아웃 실패 반환
    }
  };

  // Context를 통해 제공할 값
  const contextValue = {
    memberId,
    isLoggedIn,
    login, // 로그인 페이지 등에서 호출하여 상태를 업데이트
    logout, // Navbar 등에서 호출하여 로그아웃 처리
    checkAuthStatus, // 필요할 때 현재 인증 상태를 강제로 다시 확인
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 컨텍스트를 더 쉽게 사용하기 위한 커스텀 훅 (선택 사항이지만 권장)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
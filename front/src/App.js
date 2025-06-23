// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// 페이지
import MainPage from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import QnAList from "./pages/QnAList";
import QuestionWrite from "./pages/QuestionWrite";
import QnAView  from "./pages/QnAView";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NoticeList from "./pages/NoticeList";
import NoticeWrite from "./pages/NoticeWrite";
import NoticeView from "./pages/NoticeView";
import NoticeUpdate from "./pages/NoticeUpdate";
import QuestionUpdate from "./pages/QuestionUpdate";
import AnswerWrite from "./pages/AnswerWrite";

// 컴포넌트
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import AnswerUpdate from "./pages/AnswerUpdate";

const Layout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 페이지 내용 */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/member/chatbot/ask" element={<ChatPage />} />
          <Route path="/user/qna/list" element={<QnAList />} />
          <Route path="/member/qna/write" element={<QuestionWrite />} />
          <Route path="/member/qna/update" element={<QuestionUpdate />} />
          <Route path="/user/qna/view" element={<QnAView />} />
          <Route path="/admin/qna/write" element={<AnswerWrite />} />
          <Route path="/admin/qna/update" element={<AnswerUpdate/>}/>
          <Route path="/user/notice/list" element={<NoticeList />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/admin/notice/write" element={<NoticeWrite />} />
          <Route path="/admin/notice/update" element={<NoticeUpdate />}/>
          <Route path="/user/notice/view" element={<NoticeView />} />
        </Routes>
      </div>

      {/* 푸터 */}
      {!isMainPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;

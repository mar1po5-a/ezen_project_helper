import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { getTokenFromCookie } from "../utils/CookieUtils";
import PolicyList from "./PolicyList";
import { API_IP } from '../Config';

function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [question, setQuestion] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");
  
  const messageEndRef = useRef(null);

  // 자동 스크롤 맨 아래로
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enter 키 전송 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isAnswering === false) {
      handleSubmit(e);
    }
  };

  // 전송 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestUrl = `http://${API_IP}/member/chatbot/ask.do`
    if (question.length > 0 && isAnswering === false) {
      setMessages((prev) => [...prev, { sender: "user", text: question }]);
      setQuestion("");
      setIsAnswering(true);
      try {
        const res = await axios.post(requestUrl, { question }, {
          headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
        });
        setMessages((prev) => [...prev, { sender: "bot", text: res.data }]);
        setIsAnswering(false);
      } catch {
        setMessages((prev) => [...prev, { sender: "bot", text: "알 수 없는 오류가 발생했습니다. 다시 시도해주시기 바랍니다." }]);
        setIsAnswering(false);
      }
    }
    else return;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-6">

        {/* 정책 검색 */}
        <div>
          <div className="text-lg font-semibold text-gray-700 mb-2">정책 검색</div>
          <PolicyList />
        </div>

        {/* 챗봇 상담 */}
        <div className="text-xl font-semibold text-gray-700 mt-6">챗봇 상담</div>

        <div className="flex-1 max-h-[400px] overflow-y-auto border p-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg whitespace-pre-wrap ${msg.sender === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-800"
                  }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        {/* 입력창 */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border rounded px-3 py-2 focus:outline-none"
            placeholder="메시지를 입력하세요..."
          />
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../utils/CookieUtils";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_IP } from '../Config';
  
export function QuestionWrite() {
  const {memberId} = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 작성해주시기 바랍니다.");
      return;
    }
    try {
      const res = await axios.post(
        `http://${API_IP}:80/member/qna/write.do`,
        { title, content, member_id:memberId },
        {
          headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
        }
      );
      alert("질문이 성공적으로 등록되었습니다.");
      navigate("/user/qna/list");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert('인증되지 않은 사용자이거나 세션이 만료되었습니다. 로그인이 필요합니다.');
        } else if (err.response.status === 403) {
          alert('이 작업을 수행할 권한이 없습니다.');
        } else {
          const serverMessage = typeof err.response.data === 'string' ? err.response.data : '질문 게시글 등록에 실패했습니다.';
          alert(serverMessage);
        }
      } else if (err.request) {
        alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
      } else {
        alert(`예상치 못한 오류가 발생했습니다: ${err.message}`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Q&A 질문 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded h-40"
            required
          ></textarea>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/user/qna/list")}
            className="px-4 py-2 border rounded"
          >
            취소
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
export default QuestionWrite;
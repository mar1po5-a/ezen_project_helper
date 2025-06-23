// src/pages/QnAView.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import { getTokenFromCookie } from "../utils/CookieUtils";
import { API_IP } from '../Config';

function QnAView() {
  const { memberId } = useAuth();
  const [questionVO, setQuestionVO] = useState(null);
  const [answerVO, setAnswerVO] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const question_no = queryParams.get('question_no');

  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");


  useEffect(() => {
    const fetchView = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://${API_IP}/user/qna/view.do?question_no=${question_no}`);
        setQuestionVO(res.data.questionVO);
        setAnswerVO(res.data.answerVO);
      } catch (err) {
        setQuestionVO(null);
        setAnswerVO(null);
      } finally {
        setLoading(false);
      }
    };
    fetchView();
  }, [question_no]);

  const handleUpdateClick = () => {
    navigate(`/member/qna/update?question_no=${questionVO.question_no}`);
  }

  const handleQuestionDelete = async () => {
    if (!window.confirm("정말로 해당 게시글을 삭제하시겠습니까?"))
      return;
    try {
      const res = await axios.post(`http://${API_IP}/member/qna/delete.do`,
        {
          question_no: question_no,
          member_id: memberId
        },
        {
          headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
        }
      );
      alert("게시물을 성공적으로 삭제하였습니다.");
      navigate("/user/qna/list");
    } catch (error) {
      alert("게시물을 삭제하는데 실패하였습니다. 다시 시도해주시기 바랍니다.");
    }
  }

  const handleAnswerDelete = async () => {
    if (!window.confirm("정말로 해당 답변을 삭제하시겠습니까?"))
      return;
    try {
      const res = await axios.post(`http://${API_IP}/admin/qna/delete.do`,
        {question_no},
        {
          headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
        }
      );
      alert("답변을 성공적으로 삭제하였습니다.");
      navigate(`/user/qna/view?question_no=${question_no}`);
      setAnswerVO(null);
    } catch (error) {
      alert("답변을 삭제하는데 실패하였습니다. 다시 시도해주시기 바랍니다.");
    }
  }

  if (loading) {
    return <p>질문 게시글 상세 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Q&A 상세보기</h2>

      {/* 질문 */}
      <div className="border rounded p-4 space-y-2 bg-white">
        <h3 className="text-xl font-semibold">{questionVO.title}</h3>
        <div className="text-sm text-gray-600">
          작성자: {questionVO.member_id} | 작성일: {dayjs(questionVO.created_at).format('YYYY-MM-DD')}
        </div>
        <p className="mt-4 whitespace-pre-line">{questionVO.content}</p>
      </div>

      {/* 답변 */}
      {answerVO ? (
        <div className="mt-6 border-l-4 border-green-500 bg-green-50 rounded p-4">
          <div className="text-lg font-semibold text-green-800">답변</div>
          <p className="mt-2 text-gray-800 whitespace-pre-line">{answerVO.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            작성일: {dayjs(answerVO.created_at).format('YYYY-MM-DD')}
          </div>
        </div>
      ) : (
        <div className="mt-6 text-gray-500 italic">아직 등록된 답변이 없습니다.</div>
      )}

      {/* 버튼 */}
      <div className="mt-6 flex justify-end">
        {questionVO.member_id === memberId && (
          <>
            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleUpdateClick}>
              수정
            </button>

            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleQuestionDelete}>
              질문 삭제
            </button>
          </>
        )}
        {memberId === "admin" && (
          <>
            {!answerVO && (
              <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => navigate(`/admin/qna/write?question_no=${questionVO.question_no}`)}>
                답변하기
              </button>
            )}
            {answerVO && (
              <>
                <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => navigate(`/admin/qna/update?question_no=${question_no}`)}>
                  답변 수정
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleAnswerDelete}>
                  답변 삭제
                </button>
              </>
            )}
            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleQuestionDelete}>
              질문 삭제
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/user/qna/list")}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}
export default QnAView;
import { useEffect, useState } from "react"
import { getTokenFromCookie } from "../utils/CookieUtils";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_IP } from '../Config';

const AnswerWrite = () => {
    const [content, setContent] = useState("");
    const [questionVO, setQuestionVO] = useState(null);
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
            } catch (err) {
                setQuestionVO(null);
            } finally {
                setLoading(false);
            }
        };
        fetchView();
    }, [question_no]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert("답변 내용을 작성해주시기 바랍니다.");
            return;
        }
        try {
            const res = await axios.post(
                `http://${API_IP}/admin/qna/write.do`,
                { question_no, content },
                {
                    headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
                }
            )
            alert("답변이 성공적으로 등록되었습니다.");
            navigate(`/user/qna/view?question_no=${question_no}`);

        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    alert('인증되지 않은 사용자이거나 세션이 만료되었습니다. 로그인이 필요합니다.');
                } else if (err.response.status === 403) {
                    alert('이 작업을 수행할 권한이 없습니다.');
                } else {
                    const serverMessage = typeof err.response.data === 'string' ? err.response.data : '답변 등록에 실패했습니다.';
                    alert(serverMessage);
                }
            } else if (err.request) {
                alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            } else {
                alert(`예상치 못한 오류가 발생했습니다: ${err.message}`);
            }
        }
    }

    if (loading) {
        return <p>질문 게시글 상세 정보를 불러오는 중입니다...</p>;
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold mb-6">Q&A 답변 등록</h2>

            <div className="border rounded p-4 space-y-2 bg-white">
                <h3 className="text-xl font-semibold">{questionVO.title}</h3>
                <div className="text-sm text-gray-600">
                    작성자: {questionVO.member_id} | 작성일: {dayjs(questionVO.created_at).format('YYYY-MM-DD')}
                </div>
                <p className="mt-4 whitespace-pre-line">{questionVO.content}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">답변 내용</label>
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
                        onClick={() => navigate(`/user/qna/view?question_no=${question_no}`)}
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
    )
}
export default AnswerWrite;
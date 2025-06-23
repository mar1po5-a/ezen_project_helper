import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getTokenFromCookie } from "../utils/CookieUtils";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import { API_IP } from '../Config';

const NoticeView = () => {
  const { memberId } = useAuth();
  const [vo, setVo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null); // 수정/삭제 시 에러
  const [loadError, setLoadError] = useState(null); // 로딩 시 에러
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = getTokenFromCookie('accessToken');
  const refreshToken = getTokenFromCookie('refreshToken');

  const queryParams = new URLSearchParams(location.search);
  const notice_no = queryParams.get('notice_no');

  useEffect(() => {
    if (!notice_no) {
      setLoadError("공지사항 번호가 URL에 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchView = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await axios.get(`http://${API_IP}/user/notice/view.do?notice_no=${notice_no}`);
        setVo(response.data);
      } catch (err) {
        if (err.response) {
          setLoadError(`Error: ${err.response.status} - ${err.response.data || err.response.statusText}`);
        } else if (err.request) {
          setLoadError('네트워크 오류: 서버에 연결할 수 없습니다.');
        } else {
          setLoadError(`예상치 못한 오류가 발생했습니다: ${err.message}`);
        }
        setVo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchView();
  }, [notice_no]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 해당 공지사항을 삭제하시겠습니까?")) {
      return;
    }
    setActionError(null);

    if (!refreshToken) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const response = await axios.post(
        `http://${API_IP}:80/admin/notice/delete.do`,
        { notice_no: notice_no },
        {
          headers: { Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json' }
        }
      );
      alert(response.data);
      if (response.data.includes("성공")) {
        navigate('/user/notice/list');
      } else {
        setActionError(response.data);
      }
    } catch (err) {
      handleActionError(err, '삭제');
    }
  };

  const handleActionError = (err, actionName) => {
    if (err.response) {
      if (err.response.status === 401) {
        alert('인증되지 않은 사용자이거나 세션이 만료되었습니다. 로그인이 필요합니다.');
      } else if (err.response.status === 403) {
        alert(`공지사항 ${actionName} 권한이 없습니다.`);
      } else {
        const serverMessage = typeof err.response.data === 'string' ? err.response.data : `공지사항 ${actionName}에 실패했습니다.`;
        alert(serverMessage);
        setActionError(`${actionName} 실패: ${err.response.status}`);
      }
    } else if (err.request) {
      alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
      setActionError('네트워크 오류');
    } else {
      alert(`예상치 못한 오류가 발생했습니다: ${err.message}`);
      setActionError(`오류: ${err.message}`);
    }
  };

  const handleUpdateClick = () => {
    if (!refreshToken) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    navigate(`/admin/notice/update?notice_no=${vo.notice_no}`);
  };

  if (loading) {
    return <p>공지사항 상세 정보를 불러오는 중입니다...</p>;
  }

  if (loadError) {
    return (
      <div>
        <p style={{ color: 'red' }}>{loadError}</p>
        <Link to="/user/notice/list">목록으로 돌아가기</Link>
      </div>
    );
  }

  if (!vo) {
    return (
      <div>
        <p>해당 공지사항을 찾을 수 없습니다.</p>
        <Link to="/user/notice/list">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">공지사항 상세보기</h2>
      {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
      <div className="border rounded p-4 space-y-2">
        <h3 className="text-xl font-semibold">{vo.title}</h3>
        <div className="text-sm text-gray-600">
          작성일: {dayjs(vo.created_at).format('YYYY-MM-DD')}
        </div>
        <p className="mt-4 whitespace-pre-line">{vo.content}</p>
      </div>
      <div className="mt-6 flex justify-end">
        {memberId === "admin" && (
          <>
            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleUpdateClick}>
              수정
            </button>

            <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/user/notice/list")}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}
export default NoticeView;
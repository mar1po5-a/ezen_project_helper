// src/pages/NoticeList.js
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_IP } from '../Config';

function NoticeList() {
  const {memberId} = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [pageObject, setPageObject] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  
  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        setLoading(true);
        const response = await axios.get(`http://${API_IP}/user/notice/list.do?page=${page}&perPageNum=10`);
        if (response.data && response.data.list) {
          setList(response.data.list);
          setPageObject(response.data.pageObject);
        } else {
          setList([]);
        }
        setError(null);
      } catch (err) {
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          setError('네트워크 오류: 서버에 연결할 수 없습니다.');
        } else {
          setError(`예상치 못한 오류가 발생했습니다: ${err.message}`);
        }
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(currentPage);
  }, [currentPage]);
  
  if (loading) {
    return <p>공지사항을 불러오는 중입니다...</p>;
  }
  
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  
  const submit = (notice_no) => {
    console.log("넘겨질 게시글 번호", notice_no)
    navigate(`/user/notice/view?notice_no=${notice_no}`)
  }
 
  // -----------------------

  const handlePageClick = (page) => {
    setSearchParams({ page: page.toString() })
  }

  const handlePrevGroup = () => {
    if (pageObject && pageObject.startPage > 1) {
      const prevPage = pageObject.startPage - 1
      setSearchParams({ page: prevPage.toString() })
    }
  }

  const handleNextGroup = () => {
    if (pageObject && pageObject.endPage < pageObject.totalPage) {
      const nextPage = pageObject.endPage + 1
      setSearchParams({ page: nextPage.toString() })
    }
  }

const renderPagination = () => {
    if (!pageObject) return null;

    const pages = [];
    const liStyle = { display: 'inline-block', margin: '0 5px' };

    if (pageObject.startPage > 1) {
      pages.push(
        <li key="prev-group" style={liStyle}>
          <button className="px-3 py-1 border rounded"
            onClick={handlePrevGroup} aria-label="Previous group">
            «
          </button>
        </li>,
      );
    }

    if (pageObject.page > 1) {
      pages.push(
        <li key="prev" style={liStyle}>
          <button className="px-3 py-1 border rounded"
            onClick={() => handlePageClick(pageObject.page - 1)} aria-label="Previous">
            ‹
          </button>
        </li>,
      );
    }

    for (let i = pageObject.startPage; i <= pageObject.endPage; i++) {
      pages.push(
        <li key={i} style={liStyle}>
          <button className="px-3 py-1 border rounded"
            onClick={() => handlePageClick(i)} 
            style={i === pageObject.page ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}
          >
            {i}
          </button>
        </li>,
      );
    }

    if (pageObject.page < pageObject.totalPage) {
      pages.push(
        <li key="next" style={liStyle}>
          <button className="px-3 py-1 border rounded"
            onClick={() => handlePageClick(pageObject.page + 1)} aria-label="Next">
            ›
          </button>
        </li>,
      );
    }

    if (pageObject.endPage < pageObject.totalPage) {
      pages.push(
        <li key="next-group" style={liStyle}>
          <button className="px-3 py-1 border rounded"
            onClick={handleNextGroup} aria-label="Next group">
            »
          </button>
        </li>,
      );
    }

    return <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', marginTop: '20px' }}>{pages}</ul>;
  };


  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">공지사항</h2>
        {memberId === "admin" && (
          <button
            onClick={() => navigate("/admin/notice/write")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            글쓰기
          </button>
        )}
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 w-16">No</th>
            <th className="border px-4 py-2">제목</th>
            <th className="border px-4 py-2 w-32">날짜</th>
          </tr>
        </thead>
        <tbody>
          {list.map(vo => (
            <tr
              key={vo.notice_no}
              onClick={() => submit(vo.notice_no)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="border px-4 py-2 text-center">{vo.notice_no}</td>
              <td className="border px-4 py-2">{vo.title}</td>
              <td className="border px-4 py-2 text-center">{dayjs(vo.created_at).format('YYYY-MM-DD')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-center gap-2">
        {renderPagination()}
      </div>

    </div>
  );
}

export default NoticeList;
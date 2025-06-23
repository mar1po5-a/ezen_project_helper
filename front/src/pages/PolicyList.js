import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTokenFromCookie } from "../utils/CookieUtils";
import { API_IP } from '../Config';

function PolicyList() {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const currentWord = searchParams.get("word") || "";

  const [pageObject, setPageObject] = useState(null)

  const [searchForm, setSearchForm] = useState(currentWord);

  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");

  useEffect(() => {
    const fetchData = async (page = 1, word = "") => {

      if (!refreshToken) {
        setLoading(false);
        setError("로그인이 필요합니다.");
        return;
      }
      setLoading(true);

      try {

        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("perPageNum", "10");
        if (word) {
          params.append("word", word);
        }

        console.log("params= ", params)
        const response = await axios.get(`http://${API_IP}:80/member/policy/list.do?${params.toString()}`,
          {
            withCredentials: true
          }
        );
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

    fetchData(currentPage, currentWord);
  }, [currentPage, currentWord, accessToken, refreshToken]);

  if (loading) {
    return <p>정책 리스트를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // -----------search------------

  const handleSearchFormChange = (e) => {
    setSearchForm(e.target.value);
  };

  const handleSearch = () => {
    setSearchParams({ page: "1", word: searchForm });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // -----------search------------

  // -----------pageObject------------

  const handlePageClick = (page) => {
    setSearchParams({ page: page.toString(), word: currentWord })
  }

  const handlePrevGroup = () => {
    if (pageObject && pageObject.startPage > 1) {
      const prevPage = pageObject.startPage - 1
      setSearchParams({ page: prevPage.toString(), word: currentWord })
    }
  }

  const handleNextGroup = () => {
    if (pageObject && pageObject.endPage < pageObject.totalPage) {
      const nextPage = pageObject.endPage + 1
      setSearchParams({ page: nextPage.toString(), word: currentWord })
    }
  }

  const renderPagination = () => {
    if (!pageObject) return null;

    const pages = [];
    const liStyle = { display: 'inline-block', margin: '0 5px' };

    if (pageObject.startPage > 1) {
      pages.push(
        <li key="prev-group" style={liStyle}>
          <button onClick={handlePrevGroup} aria-label="Previous group">
            «
          </button>
        </li>,
      );
    }

    if (pageObject.page > 1) {
      pages.push(
        <li key="prev" style={liStyle}>
          <button onClick={() => handlePageClick(pageObject.page - 1)} aria-label="Previous">
            ‹
          </button>
        </li>,
      );
    }

    for (let i = pageObject.startPage; i <= pageObject.endPage; i++) {
      pages.push(
        <li key={i} style={liStyle}>
          <button
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
          <button onClick={() => handlePageClick(pageObject.page + 1)} aria-label="Next">
            ›
          </button>
        </li>,
      );
    }

    if (pageObject.endPage < pageObject.totalPage) {
      pages.push(
        <li key="next-group" style={liStyle}>
          <button onClick={handleNextGroup} aria-label="Next group">
            »
          </button>
        </li>,
      );
    }

    return <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', marginTop: '20px' }}>{pages}</ul>;
  };

  // -----------pageObject------------

  return (
    <div>
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          value={searchForm}
          onKeyDown={handleKeyPress}
          onChange={handleSearchFormChange}
          className="flex-grow border px-3 py-2 rounded"
          placeholder="검색할 정책 키워드를 입력하세요"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 w-16">No</th>
            <th className="border px-4 py-2">제목</th>
          </tr>
        </thead>
        {list.map(vo => (
          <tr key={vo.policy_no}
            className="cursor-pointer hover:bg-gray-50">
            <td className="border px-4 py-2 text-center">{vo.policy_no}</td>
            <td className="border px-4 py-2"><a href={vo.url} target="_blank">{vo.title}</a></td>
          </tr>
        ))}
      </table>
      {renderPagination()}
    </div>
  );

} export default PolicyList;
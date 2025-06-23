import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { API_IP } from "../Config";

const NoticeSection = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://${API_IP}/user/notice/list.do?page=1&perPageNum=2`
        );

        if (response.data && response.data.list) {
          setList(response.data.list);
        } else {
          setList([]);
        }
        setError(null);
      } catch (err) {
        console.error("최신 공지사항 로딩 실패: ", err)
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderData = () => {
    if (loading) {
      return <p className="mt-1 text-sm text-gray-500">로딩 중...</p>;
    }
    if (error) {
      return <p className="mt-1 text-sm text-red-500">{error}</p>;
    }
    if (list.length === 0) {
      return <p className="mt-1 text-sm text-gray-500">등록된 공지사항이 없습니다.</p>;
    }

    return (
    <ul className="mt-1 list-disc list-inside text-sm">
      {list.map((vo) => (
        <li
          key={vo.notice_no}
          className="flex justify-between items-center" 
        >
          <span>({dayjs(vo.created_at).format('YYYY-MM-DD')}) {vo.title}</span>
        </li>
      ))}
    </ul>
    );
  };

  return (
    <section className="w-full bg-yellow-100 text-gray-800 py-3 px-6 shadow-inner">
      <h2 className="text-lg font-semibold">📢 공지사항</h2>
      {renderData()}
    </section>
  );
};

export default NoticeSection;

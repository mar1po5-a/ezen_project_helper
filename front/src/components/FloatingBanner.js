const FloatingBanner = () => {
  const handleClick = () => {
    alert("중요 공지사항 영역으로 이동 예정입니다. - 수정 필요");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-lg hover:bg-blue-700 cursor-pointer animate-bounce"
      >
        📌 중요 공지사항
      </div>
    </div>
  );
};

export default FloatingBanner;

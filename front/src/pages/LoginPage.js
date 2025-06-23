import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { API_IP } from '../Config';

function LoginPage() {
  const [member_id, setMember_id] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const { checkAuthStatus, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestUrl = `http://${API_IP}/auth/login.do`;
    try {
      const response = await axios.post(requestUrl, {member_id, pw}, {
        withCredentials: true
      })
      alert("로그인에 성공하였습니다. 메인페이지로 이동합니다.");
      login(member_id);
      await checkAuthStatus();
      navigate("/");
    } catch(error){
      alert("로그인에 실패하였습니다. 다시 시도해주시기 바랍니다.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">아이디</label>
            <input
              type="id"
              value={member_id}
              onChange={(e) => setMember_id(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            로그인
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">계정이 없으신가요? </span>
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => navigate("/auth/signup")}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
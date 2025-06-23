import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_IP } from '../Config';

function SignUpPage() {
  const memberIdRegEx = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const [member_id, setMember_id] = useState("");
  const [pw, setPw] = useState("");
  const [isMemberIdReadOnly, setIsMemberIdReadOnly] = useState(false);
  const navigate = useNavigate();

  // 아이디 형식 검사
  const checkMemberId = (member_id) => {
    return memberIdRegEx.test(member_id);
  };

  // 아이디 중복 체크 버튼 클릭
  const handleCheckMemberId = async (e) => {
    e.preventDefault();
    const requestUrl = `http://${API_IP}/auth/validateMemberId.do`;
    // 아이디를 입력하지 않은 경우
    if (!member_id.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    // 아이디 형식이 틀린 경우
    else if (!checkMemberId(member_id)) {
      alert("아이디 형식과 일치하지 않습니다.\n아이디 형식 : 첫글자 영문자, 영숫자만 사용 (4~20자)");
    }
    // 아이디 중복 체크 시작
    else {
      try {
        const response = await axios.post(requestUrl, { member_id }, {
          withCredentials: true // Http 통신시 쿠키나 HTTP 인증 헤더와 같은 인증 정보를 함께 전송하도록 설정
        });
        alert("사용 가능한 아이디입니다.");
        setIsMemberIdReadOnly(true);

      } catch (error) {
        console.log(error);
        alert("이미 사용중인 아이디입니다.");
        setIsMemberIdReadOnly(false);
      }
    }
  };

  // 회원가입 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestUrl = `http://${API_IP}/auth/signUp.do`;
    if(!isMemberIdReadOnly){
      alert("아이디 중복 확인 이후 클릭해주시기 바랍니다.");
    }
    else if(pw.length < 4) {
      alert("비밀번호 형식이 일치하지 않습니다.\n비밀번호 형식 : 4자 이상");
    }
    else {
      try{
          const res = await axios.post(requestUrl, {member_id, pw}, {
            withCredentials: true
          })
          alert("회원가입에 성공하였습니다. 로그인 페이지로 이동합니다.");
          navigate("/auth/login");
      }catch(error){
        alert("회원가입에 실패하였습니다. 다시 시도해주시기 바랍니다.");
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">아이디</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={member_id}
                onChange={(e) => {
                  setMember_id(e.target.value);
                }}
                required
                readOnly={isMemberIdReadOnly}
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                type="button"
                onClick={handleCheckMemberId}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                disabled={isMemberIdReadOnly}
              >
                중복 확인
              </button>
            </div>
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
            회원가입
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-500 underline"
              onClick={() => navigate("/auth/login")}
            >
              로그인으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;

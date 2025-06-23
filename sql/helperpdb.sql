-- 사용자 테이블
DROP TABLE member CASCADE CONSTRAINTS;
CREATE TABLE member (
    member_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_id VARCHAR2(50) UNIQUE NOT NULL,
    pw VARCHAR2(100) NOT NULL,
    auth VARCHAR2(12) CHECK (auth IN('ROLE_MEMBER', 'ROLE_ADMIN')) NOT NULL
); 

INSERT INTO member (member_id, pw, auth) VALUES ('test', '1111','ROLE_MEMBER');
INSERT INTO member (member_id, pw, auth) VALUES ('admin', '1111', 'ROLE_ADMIN');


-- 정책 테이블 
DROP TABLE policies CASCADE CONSTRAINTS;

CREATE TABLE policies (
    policy_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 기본키(PK) 역할
    title VARCHAR2(200) NOT NULL, --정책 제목을 저장하는 문자열 컬럼이며, 최대 200자까지 허용
    url VARCHAR2(500) NOT NULL, --정책과 관련된 웹 주소(링크)를 저장할 수 있는 문자열 컬럼
    CONSTRAINT unique_title_url UNIQUE (title, url) -- insert 시 (title, url)중복 체크
);

-- 공지사항/게시판
DROP TABLE notice CASCADE CONSTRAINTS;
CREATE TABLE notice (
    notice_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,-- 기본키(PK) 역할(공지사항 고유번호)
    title VARCHAR2(200) NOT NULL, -- 공지 제목 컬럼
    content VARCHAR2(3000) NOT NULL, --공지 내용 저장 컬럼
    created_at DATE DEFAULT SYSDATE --작성일 컬럼 : 기본값으로 현재 날짜(SYSDATE) 
);


-- 게시판 
DROP TABLE question CASCADE CONSTRAINTS;
CREATE TABLE question (
    question_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 기본키(PK) 역할
    title VARCHAR2(200) NOT NULL,-- 질문 제목
    content VARCHAR2(4000) NOT NULL, --질문 내용
    member_id VARCHAR2(50) NOT NULL,-- 작성자
    created_at DATE DEFAULT SYSDATE, --질문 작성일. 기본값은 현재 날짜/시간
    
    CONSTRAINT fk_question_member -- 제약 조건에 붙이는 이름(식별자)
    FOREIGN KEY (member_id) -- question테이블 안에 있는 member_id 컬럼이 외래키라는 뜻
    REFERENCES member (member_id) -- member 테이블의 member_id 컬럼을 참조
    ON DELETE CASCADE  -- member 테이블에서 어떤 사용자가 삭제되면, 그 사용자의 member_id를 참조하는 question 테이블의 모든 데이터도 같이 삭제
);

-- Answer 
DROP TABLE answer CASCADE CONSTRAINTS;
CREATE TABLE answer (
    question_no NUMBER PRIMARY KEY, -- 기본키(PK) 역할
    content VARCHAR2(3000) NOT NULL,-- 답변 내용
    created_at DATE DEFAULT SYSDATE, -- 답변 작성일자

    CONSTRAINT fk_answer_question -- 제약 조건에 붙이는 이름(식별자)
    FOREIGN KEY (question_no)-- answer테이블 안에 있는 question_no 컬럼이 외래키라는 뜻
    REFERENCES question (question_no) -- question 테이블의 question_no 컬럼을 참조
    ON DELETE CASCADE -- question 테이블에서 어떤 사용자가 삭제되면, 그 사용자의 question_no 참조하는 answer 테이블의 모든 데이터도 같이 삭제
);     
-- 외래키 제약조건을 정의 / 이 답변은 qna 테이블의 qna_no와 연결
    -- ON DELETE CASCADE: 연결된 질문이 삭제되면, 그에 대한 답변도 함께 삭제


-- 리프레시 토큰 관리
DROP TABLE refresh_token CASCADE CONSTRAINTS;    
CREATE TABLE refresh_token (
    token_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,-- 자동 증가하는 숫자형 기본키
    token_value VARCHAR2(255) NOT NULL, -- 토큰 값
    member_id VARCHAR2(20) NOT NULL, -- 회원 아이디
    expiry_date DATE NOT NULL, -- 만료 날짜
    issued_date DATE DEFAULT SYSDATE NOT NULL, --발급일자

    CONSTRAINT fk_refresh_token_member -- 제약 조건에 붙이는 이름(식별자)
    FOREIGN KEY (member_id) -- refresh_token테이블 안에 있는 member_id 컬럼이 외래키라는 뜻
    REFERENCES member (member_id) -- member 테이블의 member_id 컬럼을 참조
    ON DELETE CASCADE -- member 테이블에서 어떤 사용자가 삭제되면, 그 사용자의 member_id를 참조하는 refresh_token 테이블의 모든 데이터도 같이 삭제
    -- member_id는 member 테이블의 member_id와 외래키 관계이며, 
    -- 회원이 삭제되면 해당 토큰도 자동 삭제
);

SELECT * FROM policies;

commit;  
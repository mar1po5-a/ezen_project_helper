import requests
from bs4 import BeautifulSoup
import re
import oracledb as cx_Oracle
import os
import glob
from pathlib import Path

from rich.console import Console

# ✅ 정책 상세 정보 섹션 크롤링
def crawl_all_sections(url):
    response = requests.get(url)    # 상세 페이지 요청
    response.encoding = 'utf-8'     # 인코딩 설정
    soup = BeautifulSoup(response.text, "html.parser")  # HTML 파싱

    data_store = {}
    titles = soup.find_all("strong", class_="tit")

    for title in titles:
        section_name = title.get_text(strip=True)   # 섹션 제목 텍스트 추축
        table = title.find_next("table", class_="form-table form-resp-table")
        if table:
            section_data = {}
            rows = table.find_all("tr") # 표의 모든 행추출
            for row in rows:
                ths = row.find_all("th")
                tds = row.find_all("td")
                for th, td in zip(ths, tds):
                    key = th.get_text(strip=True)   # 항목 명
                    val = td.get_text(" ", strip=True).replace("\xa0", " ") # 값 (공백 포함 처리)
                    section_data[key] = val # 섹션 데이터에 저장
            data_store[section_name] = section_data # 전체 저장소에 섹션 저장
    return data_store   # 결과 반환

# ✅ 질문 관련 섹션 찾기
def find_best_section(question, data_store):
    question_lower = question.lower()   # 질문 소문자 화
    best_section = None
    max_matches = 0

    for section_name in data_store.keys():
        matches = sum(1 for word in section_name.lower().split() if word in question_lower)
        # 유사 단어 수 체크
        if matches > max_matches:
            max_matches = matches
            best_section = section_name # 가장 유사한 섹션 갱신
    return best_section # 유사도가 가장 높은 섹션 반환

# ✅ 답변 생성
def generate_answer(question, data_store):
    section = find_best_section(question, data_store)   # 관련 섹션 찾기
    if not section:
        return "관련된 정보를 찾을 수 없습니다."

    content = data_store.get(section, {})   # 섹션 내용 가져오기
    answer = f"{section}\n"
    for k, v in content.items():
        answer += f"{k}: {v}\n" #항목 : 값 형태로 구성
    return answer   # 완성된 답변 반환

# ✅ 정책 리스트 크롤링
def crawl_policy_list(list_url):
    response = requests.get(list_url)   # 정책 목록 페이지 요청
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, "html.parser")  #HTML 파싱

    policy_items = soup.select("ul.policy-list li") # 정책 항목들 선택
    policy_data = []

    for item in policy_items:
        try:
            category = item.select_one("span.bg-blue").get_text(strip=True) # 카테고리 추출
            a_tag = item.select_one("a.tit.txt-over1")  # 제목링크
            title = a_tag.get_text(strip=True)  # 제목내용
            onclick = a_tag.get("onclick", "")  # 클릭 시 이동
            class_attr = a_tag.get("class", []) # 클래스 속성 추출

            policy_id = ""
            if "goView" in onclick:
                policy_id = onclick.replace("goView('", "").replace("');", "").strip()  # 정책 ID 추출

            description = item.select_one("em.txt-over1").get_text(separator=" ", strip=True) # 설명 텍스트

            policy_data.append({
                "category": category,
                "title": title,
                "policy_id": policy_id,
                "a_class": class_attr,
                "description": description
            })
        except Exception as e:
            print("파싱 오류:", e)
            continue    # 에러 발생 시 해당 항목 건너뜀
    return policy_data # 수집된 정책 목록 반환

# ✅ 정책 ID 기준 중복 체크
def load_saved_policy_ids_from_files(*file_paths):
    saved_ids = set()   # 중복 체크를 위한 집합
    id_pattern = re.compile(r"plcyBizId=([^&\s]+)") # 정책 ID 추출 정규식
    for file_path in file_paths:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    match = id_pattern.search(line) # 한 줄에서 ID 검색
                    if match:
                        saved_ids.add(match.group(1).strip())   # ID저장
        except FileNotFoundError:
            pass # 파일이 없으면 무시하고 계속 진행

    return saved_ids #저장된 ID 목록 반환

# ✅ 특수문자 제거
def remove_special_chars_with_space(text):
    cleaned = re.sub(r"[^가-힣a-zA-Z0-9\s]", " ", text) # 특수문자 -> 공백
    cleaned = " ".join(cleaned.split()) # 연속 공백 제거

    return cleaned # 정리된 텍스트 반환

# ✅ file3 저장
#def save_policy_result_to_file(file_path, title, questions, data_store):
def save_policy_result_to_file(file_path, title, questions, data_store, detail_url):
    with open(file_path, "a", encoding="utf-8") as f:
        f.write('"""' + title + "\n") # 제목 저장
        f.write(detail_url + "\n")  # ✅ URL 추가

        for i, q in enumerate(questions):
            result = (
                generate_answer(q, data_store) # 질문에 대한 답변 생성
                .replace("\n", " ")
                .replace("\xa0", " ")
                .replace("□", "-")
                .replace("ㅇ", "-")
                .replace("·", "-")
                .strip()
            )
            result = remove_special_chars_with_space(result) # 특수문자 제거
            f.write(result + "\n") # 결과 저장

        f.write('"""' + "\n") # 블록 끝 표시

# ✅ 전체 정책 페이지 순회
def crawl_all_policy_pages():
    all_policies = [] # 누적 정책 저장 리스트
    page = 1 # 시작 페이지 번호
    while True:
        list_url = f"https://youth.seoul.go.kr/infoData/plcyInfo/ctList.do?sprtInfoId=&plcyBizId=&key=2309150002&sc_detailAt=&pageIndex={page}&orderBy=regYmd+desc&blueWorksYn=N&tabKind=002&sw=&sc_rcritCurentSitu=001&sc_rcritCurentSitu=002"
        page_policies = crawl_policy_list(list_url) # 해당 페이지 정책 수집
        if not page_policies: # 더이상 정책 없으면 종료
            print("❌ 더 이상 데이터가 없습니다. 종료.")
            break
        all_policies.extend(page_policies) # 정책 누적 저장
        page += 1 # 다음 페이지로 이동
    print(f"\n✅ 총 수집된 정책 수: {len(all_policies)}개")

    return all_policies # 전체 수집 결과 반환

# ✅ 실행
if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent / "policy_directory/"
    base_file3_name = os.path.join(base_dir, "your_data_file")

    # file3 경로 탐색
    file3_paths = [
        p for p in glob.glob(os.path.join(base_dir, "your_data_file*.txt"))
    ]

    print("📂 탐색된 file 경로들:", file3_paths)

    # file3 인덱스 계산
    existing_indexes = []
    for path in file3_paths:
        match = re.search(r"your_data_file(\d+)\.txt", path)
        if match:
            existing_indexes.append(int(match.group(1)))

    file3_index = max(existing_indexes, default=0) + 1
    file3_path = f"{base_file3_name}{file3_index}.txt"
    print(f"📁 최초 저장 파일: {file3_path}")
    save_count = 0

    # 중복 정책 ID 로딩
    saved_policy_ids = load_saved_policy_ids_from_files(*file3_paths)

    all_policies = crawl_all_policy_pages()

    # 질문 리스트
    test_questions = [
        "사업개요에 대해 알려줘",
        "신청자격은 어떻게 되나요?",
        "신청방법이 궁금해요",
        "기타 정보가 있나요?",
        "지원 내용이 뭔가요?"
    ]

    dsn = cx_Oracle.makedsn("192.168.0.231", 1521, service_name="helperpdb")
    conn = cx_Oracle.connect(user="helper", password="1111", dsn=dsn)
    cursor = conn.cursor()

    inserted_count = 0

    for i, policy in enumerate(all_policies):
        policy_id = policy["policy_id"]
        if not policy_id:
            continue
        if policy_id in saved_policy_ids:
            print(f"[중복 - ID 기준] '{policy_id}' 이미 저장되어 건너뜀")
            continue

        detail_url = f"https://youth.seoul.go.kr/infoData/plcyInfo/view.do?plcyBizId={policy_id}&tab=001&key=2309150002"

        try:
            res = requests.get(detail_url)
            res.encoding = 'utf-8'
            soup = BeautifulSoup(res.text, "html.parser")
            policy_title = soup.find("strong", class_="title").get_text(strip=True)
            data_store = crawl_all_sections(detail_url)

            # DB INSERT
            try:
                cursor.execute("INSERT INTO policies (title, url) VALUES (:1, :2)", (policy_title, detail_url))
               # cursor.execute("INSERT INTO policies (title, url) VALUES (:1, :2)", (policy_title, detail_url))
                inserted_count += 1
                print(f"[INSERT 완료] {policy_title}")
            except cx_Oracle.IntegrityError:
                print(f"[중복 - DB 기준] {policy_title} 이미 존재하여 건너뜀")
            except Exception as e:
                print(f"[DB ERROR] 제목 : {policy_title} | 오류 : {e}")

            # file3 분할 저장
            if save_count >= 20:
                file3_index += 1
                file3_path = f"{base_file3_name}{file3_index}.txt"
                save_count = 0

            save_policy_result_to_file(file3_path, policy_title, test_questions, data_store, detail_url)
            print(f"📌 save_count: {save_count} | 현재 파일: {file3_path}")

            save_count += 1
            saved_policy_ids.add(policy_id)

        except Exception as e:
            print(f"[{i+1}] 정책 처리 중 오류 - ID: {policy_id} / 오류: {e}")
            continue

    # conn.commit()
    cursor.close()
    conn.close()

    print(f"\n✅ 수집된 전체 정책 수: {len(all_policies)}개")
    print(f"🟢 DB에 실제 INSERT 된 정책 수: {inserted_count}개")
    print("\n----------------------- 데이터 저장 완료 -----------------------------")

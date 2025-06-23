package com.helper.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helper.answer.vo.AnswerVO;
import com.helper.notice.service.NoticeService;
import com.helper.notice.vo.NoticeVO;
import com.helper.qna.service.QnaService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/admin")
public class AdminRestController {

	@Autowired
	private NoticeService noticeService;
	
	@Autowired
	private QnaService qnaService;
	
	@PostMapping("/notice/write.do")
	public ResponseEntity<String> noticeWrite(@RequestBody NoticeVO vo) {
		log.info("noticeWrite mapping");
		int result = noticeService.write(vo);
		
		if(result == 0)
			return new ResponseEntity<>("공지사항 글 등록 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("공지사항 글 등록 성공", HttpStatus.OK);
	}
	
	@PostMapping("/notice/update.do")
	public ResponseEntity<String> noticeUpdate(@RequestBody NoticeVO vo) {
		log.info("noticeUpdate mapping");
		int result = noticeService.update(vo);
		
		if(result == 0)
			return new ResponseEntity<>("공지사항 글 수정 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("공지사항 글 수정 성공", HttpStatus.OK);
	}
	
	@PostMapping("/notice/delete.do")
	public ResponseEntity<String> noticeDelete(@RequestBody NoticeVO vo) {
		log.info("noticeDelete mapping");
		int result = noticeService.delete(vo);
		
		if(result == 0)
			return new ResponseEntity<>("공지사항 글 삭제 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("공지사항 글 삭제 성공", HttpStatus.OK);
	}
	
	@PostMapping("/qna/write.do")
	public ResponseEntity<String> answerWrite(@RequestBody AnswerVO answerVO) {
		log.info("질문글 답변 작성");
		
		int result = qnaService.answerWrite(answerVO);
		if(result == 0)
			return new ResponseEntity<>("질문글 답변등록 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("질문글 답변등록 성공", HttpStatus.OK);
	}
	
	@PostMapping("/qna/update.do")
	public ResponseEntity<String> answerUpdate(@RequestBody AnswerVO answerVO) {
		log.info("질문 답변글 수정");
		int result = qnaService.answerUpdate(answerVO);
		
		if(result == 0)
			return new ResponseEntity<>("질문글 답변 수정 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("질문글 답변 수정 성공", HttpStatus.OK);
	}
	
	@PostMapping("/qna/delete.do")
	public ResponseEntity<String> answerDelete(@RequestBody AnswerVO answerVO) {
		log.info("질문 답변글 삭제");
		int result = qnaService.answerDelete(answerVO);
		
		if(result == 0)
			return new ResponseEntity<>("질문글 답변 삭제 실패", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		return new ResponseEntity<>("질문글 답변 삭제 성공", HttpStatus.OK);
	}
}

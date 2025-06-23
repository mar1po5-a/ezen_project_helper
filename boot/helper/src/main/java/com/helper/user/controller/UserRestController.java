package com.helper.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helper.notice.service.NoticeService;
import com.helper.notice.vo.NoticeVO;
import com.helper.page.util.PageObject;
import com.helper.qna.service.QnaService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping("/user")
public class UserRestController {

	@Autowired
	private NoticeService noticeService;
	
	@Autowired
	private QnaService qnaService;
	
	@GetMapping("/notice/list.do")
	public ResponseEntity<Map<String, Object>> noticeList(PageObject pageObject) {
		
		log.info("공지사항 리스트 매핑");
		Map<String, Object> map = new HashMap<>();
		
		map.put("list", noticeService.list(pageObject));
		map.put("pageObject", pageObject);
		
		log.info("list map= " + map);
		
		return new ResponseEntity<>(map, HttpStatus.OK);
	}

	@GetMapping("/notice/view.do")
	public ResponseEntity<NoticeVO> noticeView(@RequestParam("notice_no") Long notice_no) {

		log.info("notice_no=" + notice_no);
		NoticeVO vo = noticeService.view(notice_no);
		log.info("NoticeVO=" + vo);
		
		return new ResponseEntity<>(vo, HttpStatus.OK);
	}
	
	
	@GetMapping("/qna/list.do")
	public ResponseEntity<Map<String, Object>> qnaList(PageObject pageObject) {

		log.info("----- UserRestController qnaList() -----");
		Map<String, Object> map = new HashMap<>();

		map.put("list", qnaService.list(pageObject));
		map.put("pageObject", pageObject);

		return new ResponseEntity<>(map, HttpStatus.OK);

	}

	@GetMapping("/qna/view.do")
	public ResponseEntity<Map<String, Object>> qnaView(@RequestParam("question_no") Long question_no) {

		log.info("----- UserRestController qnaView() -----");

		Map<String, Object> map = new HashMap<>();
		map.put("questionVO", qnaService.questionView(question_no));
		map.put("answerVO", qnaService.answerView(question_no));

		return new ResponseEntity<>(map, HttpStatus.OK);
	}
}

package com.helper.qna.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helper.answer.vo.AnswerVO;
import com.helper.page.util.PageObject;
import com.helper.qna.mapper.QnaMapper;
import com.helper.question.vo.QuestionVO;

@Service
public class QnaService {
	
	@Autowired
	private QnaMapper mapper;
	
	public List<QuestionVO> list(PageObject pageObject) {
		pageObject.setTotalRow(mapper.getTotalRow(pageObject));
		return mapper.list(pageObject);
	}
	
	public QuestionVO questionView(Long question_no) {
		return mapper.questionView(question_no);
	}
	
	public int questionWrite(QuestionVO questionVO) {
		return mapper.questionWrite(questionVO);
	}
	
	public int questionUpdate(QuestionVO questionVO) {
		return mapper.questionUpdate(questionVO);
	}
	
	public int questionDelete(QuestionVO questionVO) {
		if(questionVO.getMember_id().equals("admin"))
			return mapper.questionDelete2(questionVO);
		return mapper.questionDelete(questionVO);
	}
	
	public AnswerVO answerView(Long question_no) {
		return mapper.answerView(question_no);
	}
	
	public int answerWrite(AnswerVO answerVO) {
		return mapper.answerWrite(answerVO);
	}
	
	public int answerUpdate(AnswerVO answerVO) {
		return mapper.answerUpdate(answerVO);
	}
	
	public int answerDelete(AnswerVO answerVO) {
		return mapper.answerDelete(answerVO);
	}
}

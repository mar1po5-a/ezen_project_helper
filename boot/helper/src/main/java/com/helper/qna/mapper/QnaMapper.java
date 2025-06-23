package com.helper.qna.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.helper.answer.vo.AnswerVO;
import com.helper.page.util.PageObject;
import com.helper.question.vo.QuestionVO;

@Mapper
public interface QnaMapper {
	public Long getTotalRow(PageObject pageObject);
	public List<QuestionVO> list(PageObject pageObject);
	public QuestionVO questionView(Long question_no);
	public int questionWrite(QuestionVO questionVO);
	public int questionUpdate(QuestionVO questionVO);
	public int questionDelete(QuestionVO questionVO);
	public int questionDelete2(QuestionVO questionVO);
	public AnswerVO answerView(Long question_no);
	public int answerWrite(AnswerVO answerVO);
	public int answerUpdate(AnswerVO answerVO);
	public int answerDelete(AnswerVO answerVO);	
}

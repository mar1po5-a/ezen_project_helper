package com.helper.answer.vo;

import java.util.Date;

import lombok.Data;

@Data
public class AnswerVO {
	private Long question_no;
	private String content;
	private Date created_at;
}

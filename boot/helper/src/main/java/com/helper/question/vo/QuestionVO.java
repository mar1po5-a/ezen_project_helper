package com.helper.question.vo;

import java.util.Date;

import lombok.Data;

@Data
public class QuestionVO {
	private Long question_no;
	private String title;
	private String content;
	private String member_id;
	private Date created_at;
}

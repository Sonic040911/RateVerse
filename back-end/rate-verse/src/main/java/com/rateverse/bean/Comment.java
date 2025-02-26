package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评论的实体类
 */
@Data
public class Comment {
    private Integer id;
    private Integer user_id;
    private Integer item_id;
    private Integer parentCommentId;
    private String content;
    private Integer likes;
    private Date createdAt;
    private Date updatedAt;
}

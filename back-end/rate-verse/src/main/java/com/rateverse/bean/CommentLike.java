package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 记录用户的点赞和倒赞行为
 */
@Data
public class CommentLike {
    private Integer id;
    private Integer userId;
    private Integer commentId;
    private String actionType; // "LIKE" 或 "DISLIKE"
    private Date createdAt;
}

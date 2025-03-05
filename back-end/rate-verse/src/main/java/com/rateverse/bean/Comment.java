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
    private Integer userId;
    private Integer itemId;
    private Integer parentCommentId;
    private String content;
    private Integer likes;    // 点赞数
    private Integer dislikes; // 倒赞数
    private Date createdAt;
    private Date updatedAt;

    /* 为了这页面上显示用户对Item的评分，我们去和rating表进行连接，来补充这个值 */
    private Integer userRating;

    /* 添加 User 对象以存储用户信息 */
    private User user; // 关联 User 对象
}
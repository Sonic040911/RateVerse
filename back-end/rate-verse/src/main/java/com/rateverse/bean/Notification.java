package com.rateverse.bean;

import lombok.Data;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 通知类
 */

@Data
public class Notification {
    private Integer id;
    private Integer userId; // 接收通知的用户
    private Integer senderId; // 触发通知的用户
    private String type; // LIKE, COMMENT, REPLY
    private Integer commentId; // 相关评论ID
    private Integer itemId; // 相关Item ID
    private String message; // 通知消息
    private String createdAt; // 创建时间
    private Boolean isRead; // 是否已读
}

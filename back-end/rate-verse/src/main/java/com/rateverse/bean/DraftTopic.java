package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 主题的草稿实体类
 */
@Data
public class DraftTopic {
    private Integer draftId;     // 草稿ID
    private Integer userId;      // 用户ID
    private String title;        // 草稿标题
    private String description;  // 草稿描述
    private Date createdAt;      // 创建时间
}

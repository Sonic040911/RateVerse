package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评分项的草稿实体类
 */
@Data
public class DraftItem {
    private Integer draftItemId;     // 草稿评分项ID
    private Integer draftTopicId;    // 关联的草稿主题ID (唯一)
    private String name;             // 评分项名称
    private String description;      // 描述
    private String imageUrl;         // 图片URL
    private Date createdAt;          // 创建时间
}

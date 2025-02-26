package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 物品的实体类
 */
@Data
public class Item {
    private Integer id;
    private String name;
    private String description;
    private String imageUrl;

    // 动态计算
    private Double averageRating;  // 平均评分
    private Integer totalRatings;   // 总评分数
    private Integer totalComments;  // 总评论人数

    private Date createdAt;
    private Date updatedAt;

    /*
    * 一个主题可以有多个Item   1:N
    * 如果你想知道这个Item属于哪个topic，要多表映射，增加Topic对象
    * */
    private Integer topicId;
}

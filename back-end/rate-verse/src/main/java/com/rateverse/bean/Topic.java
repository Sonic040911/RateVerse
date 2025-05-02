package com.rateverse.bean;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 主题实体类
 */
@Data
public class Topic {
    private Integer id;
    private String title;
    private String description;
    private Date createdAt;
    private Date updatedAt;

    /* 新增属性 */
    private Integer totalComments;
    private Integer totalRatings;  // 总评分数

    /*
    * 一个用户可以有多个主题，但是一个主题只能有一个用户   1:N
    * 如果要多表映射，在这里添加User对象
    * */
    private Integer userId;
    private User user;

    /*
    * 一个topic可以有多个item，1:N
    * 如果你想知道这个topic有哪些item，在下面添加 List<Item> 用于接收
    * */
    private List<Item> items;


    private Item topItem; // 新增：最热门Item
}

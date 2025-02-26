package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评分项的评分实体类
 */
@Data
public class Rating {
    private Integer id;
    private Integer userId;
    private Integer itemId;
    private Integer score;          // 只能是1-5
    private Date created_at;

    /*
    *   注意事项:
    *       1. 同一个用户只能对同一个评分项评一次    userId - itemId  1:1
    *       2. 如果对这个表有看不懂的地方，看一下例子
    *           id   |   userId   |   itemId   |   score
    *           1          2            5           4
    *           2          3            5           3
    *           3          7            5           1
    *           4          8            2           5
    *           5          11           1           2
    *           6          20           2           3
    *
    *       3. 这里留下一个问题，未来我们需要根据这个表，去动态计算item表的average_rating字段
    * */
}

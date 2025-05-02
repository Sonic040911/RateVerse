package com.rateverse.service;

import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对评分事件标题的业务处理
 */
public interface TopicService {
    // 在主页按照时间顺序 (最近创建) 返回所有Topic (包含三个Items)
    Result getTopicsByTimePage(int pageSize, int currentPage);

    // 在主页按照热度顺序 返回所有Topic (包含三个Items)
    Result getTopicsByHeatPage(int pageSize, int currentPage);

    // 用户点开一个Topic时, 返回Topic的所有信息
    Result getTopicById(int topicId);

    // 搜索所有Topic, 根据关键词返回所有相关Topic (热度优先)
    Result searchTopicsByHeat(String keyword, int pageSize, int currentPage);

    // 搜索所有Topic, 根据关键词返回所有相关Topic (最近创建优先)
    Result searchTopicsByTime(String keyword, int pageSize, int currentPage);

    int getTopicCountByUserId(Integer id);

    int getTopicLikesCountByUserId(Integer id);

    int getTopicCommentsCountByUserId(Integer id);

    int getTopicRatingsCountByUserId(Integer id);

    Result getUserTopicsByHeat(Integer userId);
}

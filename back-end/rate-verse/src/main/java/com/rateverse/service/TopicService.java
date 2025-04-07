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

    //
    Result getTopicById(int topicId);

    Result searchTopics(String keyword);
}

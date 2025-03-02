package com.rateverse.service;

import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对评分事件标题的业务处理
 */
public interface TopicService {
    // 根据分页数据获得Topics (根据最近的创建时间排序)
    Result getTopicsByTimePage(int pageSize, int currentPage);

    Result getTopicById(int topicId);
}

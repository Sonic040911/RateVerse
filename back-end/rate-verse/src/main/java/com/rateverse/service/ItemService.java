package com.rateverse.service;

import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对评分事件的评分对象进行业务处理
 */
public interface ItemService {
    // 根据topicId获取它对应的items
    Result getItemsByTopicId(int topicId, int pageSize, int currentPage);

    Result getItemById(int itemId);

    Result getItemByIdWithStats(Integer itemId);
}

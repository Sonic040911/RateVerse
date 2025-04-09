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
    Result getItemsByTopicId(int topicId, int pageSize, int currentPage, String sortType);

    // 获取指定Item的信息 (包含评分分布表)
    Result getItemByIdWithStats(Integer itemId);
}

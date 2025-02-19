package com.rateverse.mapper;

import com.rateverse.bean.DraftTopic;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface DraftTopicMapper {
    // 插入草稿主题
    int insertDraftTopic(DraftTopic draftTopic);

    // 更新草稿主题
    int updateDraftTopic(DraftTopic draftTopic);

    // 根据ID查询草稿主题
    DraftTopic selectDraftTopicById(Integer draftId);

    // 删除草稿主题
    int deleteDraftTopic(Integer draftId);
}

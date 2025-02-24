package com.rateverse.mapper;

import com.rateverse.bean.DraftItem;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface DraftItemMapper {
    // 插入草稿评分项
    int insertDraftItem(DraftItem draftItem);

    // 根据草稿主题ID查询评分项
    List<DraftItem> selectDraftItemsByTopicId(Integer draftTopicId);

    // 删除草稿评分项
    int deleteDraftItem(Integer draftItemId);

    // 根据草稿主题ID删除所有评分项
    int deleteDraftItemsByTopicId(Integer draftTopicId);
}

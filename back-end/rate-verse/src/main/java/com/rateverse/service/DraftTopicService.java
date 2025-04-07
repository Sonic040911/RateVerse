package com.rateverse.service;

import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface DraftTopicService {
    // 根据userId临时创建一个DraftTopic
    Result createDraft(Integer userId);

    // 实时更新用户的草稿
    Result updateDraftInfo(Integer draftId, String title, String description, Integer userId);

    // 显示用户之前保存的草稿，如果没有则显示空
    Result getDraftWithCheck(Integer draftId, Integer userId);

    // 删除用户所有相关的草稿
    Result deleteAllDrafts(Integer draftId, Integer userId);

    // 把草稿保存的Topic中
    Result publishDraft(Integer draftId, Integer userId);

}

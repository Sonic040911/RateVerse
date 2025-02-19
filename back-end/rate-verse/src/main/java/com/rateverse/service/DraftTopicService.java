package com.rateverse.service;

import com.rateverse.bean.DraftTopic;
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

    Result updateDraftInfo(Integer draftId, String title, String description);

    Result publishDraft(Integer draftId, Integer userId);
}

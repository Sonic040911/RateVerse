package com.rateverse.service;

import com.rateverse.bean.DraftItem;
import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface DraftItemService {
    Result addDraftItem(Integer draftId, DraftItem item, Integer userId);

    Result deleteDraftItem(Integer draftItemId, Integer userId);

    Result page(int draftId, int pageSize, int currentPage, Integer userId);

}

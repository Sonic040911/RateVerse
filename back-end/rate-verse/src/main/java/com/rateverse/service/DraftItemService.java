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
    Result addDraftItem(Integer draftId, DraftItem item);

    Result deleteDraftItem(Integer draftItemId);

    Result page(int draftId, int pageSize, int currentPage);

}

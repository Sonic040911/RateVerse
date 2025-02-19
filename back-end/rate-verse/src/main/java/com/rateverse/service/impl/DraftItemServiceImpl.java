package com.rateverse.service.impl;

import com.rateverse.bean.DraftItem;
import com.rateverse.bean.Item;
import com.rateverse.mapper.DraftItemMapper;
import com.rateverse.service.DraftItemService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
public class DraftItemServiceImpl implements DraftItemService {
    @Autowired
    private DraftItemMapper draftItemMapper;

    @Override
    public Result addDraftItem(Integer draftId, DraftItem item) {
        // 设置它的draft_topic_id
        item.setDraftTopicId(draftId);
        int row = draftItemMapper.insertDraftItem(item);
        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(item, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result deleteDraftItem(Integer draftItemId) {
        int row = draftItemMapper.deleteDraftItem(draftItemId);

        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }
}

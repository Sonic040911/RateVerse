package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.DraftItem;
import com.rateverse.bean.DraftTopic;
import com.rateverse.bean.Item;
import com.rateverse.mapper.DraftItemMapper;
import com.rateverse.mapper.DraftTopicMapper;
import com.rateverse.service.DraftItemService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
@Transactional
public class DraftItemServiceImpl implements DraftItemService {
    @Autowired
    private DraftTopicMapper draftTopicMapper;

    @Autowired
    private DraftItemMapper draftItemMapper;

    @Override
    public Result addDraftItem(Integer draftId, DraftItem item, Integer userId) {
        // 添加前判断这个draft是否存在
        DraftTopic draftTopic = draftTopicMapper.selectDraftTopicById(draftId);
        if (draftTopic == null) {
            return Result.fail(null, ResultCodeEnum.NULL_DRAFT);
        }

        // 验证草稿归属权
        if (!draftTopic.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.DRAFT_PERMISSION_ERROR);
        }

        // 设置它的draft_topic_id
        item.setDraftTopicId(draftId);
        int row = draftItemMapper.insertDraftItem(item);

        // 获取自增长的主键，并给这个item设置这个主键
        item.setDraftItemId(item.getDraftItemId());

        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(item, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result deleteDraftItem(Integer draftItemId, Integer userId) {
        // 先获取这个draftItem所属的DraftTopic
        DraftTopic draftTopic = draftItemMapper.selectDraftTopicByDraftItemId(draftItemId);

        // 验证这个草稿是否存在
        if (draftTopic == null) {
            return Result.fail(null, ResultCodeEnum.NULL_DRAFT);
        }

        // 验证草稿归属权
        if (!draftTopic.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.DRAFT_PERMISSION_ERROR);
        }

        // 一切正常，开始删除
        draftItemMapper.deleteDraftItem(draftItemId);

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }

    // 分页显示所有DraftItem
    @Override
    public Result page(int draftId, int pageSize, int currentPage, Integer userId) {
        // 检查草稿Topic存在与否
        DraftTopic draftTopic = draftTopicMapper.selectDraftTopicById(draftId);
        if (draftTopic == null) {
            return Result.fail(null, ResultCodeEnum.NULL_DRAFT);
        }

        // 验证草稿归属权
        if (!draftTopic.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.DRAFT_PERMISSION_ERROR);
        }

        // 分页
        PageHelper.startPage(currentPage, pageSize);

        // 查询 (如果没有对应的draftId没有Items，会返回空列表)
        List<DraftItem> draftItems = draftItemMapper.selectDraftItemsByTopicId(draftId);

        // 分页查询数据
        PageInfo<DraftItem> info = new PageInfo<>(draftItems);

        // 装配到PageBean
        PageBean<DraftItem> pageBean = new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }
}

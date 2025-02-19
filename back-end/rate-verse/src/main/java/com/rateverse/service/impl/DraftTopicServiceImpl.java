package com.rateverse.service.impl;

import com.rateverse.bean.DraftItem;
import com.rateverse.bean.DraftTopic;
import com.rateverse.bean.Item;
import com.rateverse.bean.Topic;
import com.rateverse.mapper.DraftItemMapper;
import com.rateverse.mapper.DraftTopicMapper;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.service.DraftTopicService;
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
public class DraftTopicServiceImpl implements DraftTopicService {
    @Autowired
    private DraftTopicMapper draftTopicMapper;

    @Autowired
    private TopicMapper topicMapper;

    @Autowired
    private DraftItemMapper draftItemMapper;

    @Autowired
    private ItemMapper itemMapper;


    // 根据user_id临时创建一个DraftTopic在数据库
    @Override
    public Result createDraft(Integer userId) {
        // 创建对象并设置它的userId，userId很重要，对Topic有唯一性
        DraftTopic draftTopic = new DraftTopic();
        draftTopic.setUserId(userId);

        // 在数据库中插入数据
        int row = draftTopicMapper.insertDraftTopic(draftTopic);

        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(draftTopic, ResultCodeEnum.SUCCESS);
    }

    // 实时更新该draftId的信息
    @Override
    public Result updateDraftInfo(Integer draftId, String title, String description) {
        DraftTopic oldDraftTopic = draftTopicMapper.selectDraftTopicById(draftId);
        oldDraftTopic.setTitle(title);
        oldDraftTopic.setDescription(description);

        return Result.ok(oldDraftTopic, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result publishDraft(Integer draftId, Integer userId) {
        // 获取该草稿
        DraftTopic draft = draftTopicMapper.selectDraftTopicById(draftId);

        // 校验草稿的存在与否
        if (draft == null){
            return Result.fail(null, ResultCodeEnum.NULL_DRAFT);
        }

        // 校验该草稿的归属权
        if(!draft.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.DRAFT_PERMISSION_ERROR);
        }

        // 数据转换 DraftTopic -> Topic
        Topic topic = new Topic();
        List<DraftItem> draftItemList = draftItemMapper.selectDraftItemsByTopicId(draftId);

        // 转换前校验有没有至少一个item
        if (draftItemList.isEmpty()) {
            return Result.fail(null, ResultCodeEnum.NO_ANY_ITEM);
        }

        topic.setTitle(draft.getTitle());
        topic.setDescription(draft.getDescription());
        topic.setUserId(draft.getUserId());

        int row = topicMapper.insertTopic(topic);
        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        // 数据转换 List<DraftItem> -> Items
        for (DraftItem draftItem : draftItemList) {
            Item item = new Item();
            item.setName(draftItem.getName());
            item.setDescription(draftItem.getDescription());
            item.setImageUrl(draftItem.getImageUrl());
            item.setTopicId(draftItem.getDraftTopicId());
            itemMapper.insertItem(item);
        }

        // 清楚草稿数据
        draftTopicMapper.deleteDraftTopic(draftId);
        draftItemMapper.deleteDraftItemsByTopicId(draftId);

        return Result.ok(topic, ResultCodeEnum.SUCCESS);
    }
}

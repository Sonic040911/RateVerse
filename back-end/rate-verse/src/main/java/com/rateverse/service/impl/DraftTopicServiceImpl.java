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
        // 如果该用户已经有一个draft，就不能再创建一个了，返回这个draft (疑问, 未来解决)
        DraftTopic oldDraftTopic = draftTopicMapper.selectDraftTopicIdByUserId(userId);
        if (oldDraftTopic != null) {
            return Result.ok(oldDraftTopic, ResultCodeEnum.HAD_DRAFT);
        }

        // 创建对象并设置它的userId，userId很重要，对Topic有唯一性
        DraftTopic draftTopic = new DraftTopic();
        draftTopic.setUserId(userId);

        // 在数据库中插入数据
        int row = draftTopicMapper.insertDraftTopic(draftTopic);

        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        // 得到新创建的草稿的id，很重要！
        draftTopic.setDraftId(draftTopic.getDraftId());

        return Result.ok(draftTopic, ResultCodeEnum.SUCCESS);
    }

    // 显示用户之前创建的草稿信息
    @Override
    public Result getDraftWithCheck(Integer draftId, Integer userId) {
        DraftTopic draft = draftTopicMapper.selectDraftTopicById(draftId);

        if (draft == null || !draft.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.DRAFT_PERMISSION_ERROR);
        }

        return Result.ok(draft, ResultCodeEnum.SUCCESS);
    }


    // 实时更新该draftId的信息
    @Override
    public Result updateDraftInfo(Integer draftId, String title, String description) {
        DraftTopic oldDraftTopic = draftTopicMapper.selectDraftTopicById(draftId);
        oldDraftTopic.setTitle(title);
        oldDraftTopic.setDescription(description);

        // 进行update
        int row = draftTopicMapper.updateDraftTopic(oldDraftTopic);
        if (row == 0) {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(oldDraftTopic, ResultCodeEnum.SUCCESS);
    }


    @Override
    public Result deleteAllDrafts(Integer draftId, Integer userId) {
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

        // 清楚草稿数据 搞好顺序！ 先删除DraftItem再删除DraftTopic
        draftItemMapper.deleteDraftItemsByTopicId(draftId);
        draftTopicMapper.deleteDraftTopic(draftId);

        // 返回删除的草稿
        return Result.ok(draft, ResultCodeEnum.SUCCESS);
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
            // 这里添加的时候很重要，要添加新添加的topicid
            item.setTopicId(topic.getId());

            item.setName(draftItem.getName());
            item.setDescription(draftItem.getDescription());
            item.setImageUrl(draftItem.getImageUrl());
            itemMapper.insertItem(item);
        }

        // 清楚草稿数据 搞好顺序！ 先删除DraftItem再删除DraftTopic
        draftItemMapper.deleteDraftItemsByTopicId(draftId);
        draftTopicMapper.deleteDraftTopic(draftId);

        return Result.ok(topic, ResultCodeEnum.SUCCESS);
    }
}

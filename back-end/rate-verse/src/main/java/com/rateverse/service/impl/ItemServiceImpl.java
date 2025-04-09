package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Item;
import com.rateverse.bean.ScoreDistribution;
import com.rateverse.bean.Topic;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.mapper.RatingMapper;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.service.ItemService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
@Transactional
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;

    /* 用于获取评分项的评分分布 */
    @Autowired
    private RatingMapper ratingMapper;

    @Autowired
    private TopicMapper topicMapper;


    // 根据topicId获取它对应的items
    @Override
    public Result getItemsByTopicId(int topicId, int pageSize, int currentPage, String sortType) {
        // 查询topic是否存在
        Topic topic = topicMapper.selectTopicByIdWithUser(topicId);
        if (topic == null) {
            return Result.fail(null, ResultCodeEnum.TOPIC_DOES_NOT_EXISTS);
        }

        // 分页
        PageHelper.startPage(currentPage, pageSize);

        // 根据 sortType 查询 Items
        List<Item> items = itemMapper.selectItemsByTopicIdWithSort(topicId, sortType);

        PageInfo<Item> info = new PageInfo<>(items);

        PageBean<Item> pageBean = new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }


    // 获取指定Item的信息 (包含评分分布表)
    @Override
    public Result getItemByIdWithStats(Integer itemId) {
        // 1. 获取 Item 基本信息
        Item item = itemMapper.selectItemById(itemId);
        if (item == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        // 2. 获取评分分布数据
        List<ScoreDistribution> distributions = ratingMapper.selectScoreDistributionByItem(itemId);

        // 3. 组装数据
        Map<String, Object> data = new HashMap<>();
        data.put("item", item);
        data.put("scoreDistribution", distributions);

        return Result.ok(data, ResultCodeEnum.SUCCESS);
    }
}

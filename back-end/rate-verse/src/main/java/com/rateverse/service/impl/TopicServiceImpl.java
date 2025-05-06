package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Topic;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.service.TopicService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
@Transactional
@Slf4j
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicMapper topicMapper;

    // 在主页按照时间顺序 (最近创建) 返回所有Topic (包含三个Items)
    @Override
    public Result getTopicsByTimePage(int pageSize, int currentPage) {
        PageHelper.startPage(currentPage, pageSize);

        List<Topic> topics = topicMapper.selectAllByTime();

        PageInfo<Topic> info = new PageInfo<>(topics);

        PageBean<Topic> pageBean =new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    // 在主页按照热度顺序 返回所有Topic (包含三个Items)
    @Override
    public Result getTopicsByHeatPage(int pageSize, int currentPage) {
        // 计算 OFFSET
        int offset = (currentPage - 1) * pageSize;

        // 获取分页 Topics
        List<Topic> topics = topicMapper.selectAllByHeat(pageSize, offset);

        // 获取总 Topic 数量
        long total = topicMapper.countTopics();

        // 构建响应
        Map<String, Object> data = new HashMap<>();
        data.put("currentPage", currentPage);
        data.put("pageSize", pageSize);
        data.put("total", total);
        data.put("data", topics);

        return Result.ok(data, ResultCodeEnum.SUCCESS);
    }

    // 用户点开一个Topic时, 返回Topic的所有信息
    @Override
    public Result getTopicById(int topicId) {
        Topic topic = topicMapper.selectTopicByIdWithUser(topicId);

        if (topic == null) {
            return Result.fail(null, ResultCodeEnum.TOPIC_DOES_NOT_EXISTS);
        }

        return Result.ok(topic, ResultCodeEnum.SUCCESS);
    }


    // 搜索Topics, 根据热度返回
    @Override
    public Result searchTopicsByHeat(String keyword, int pageSize, int currentPage) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Result.fail(null, ResultCodeEnum.SEARCH_KEYWORD_EMPTY);
        }

        PageHelper.startPage(currentPage, pageSize);

        List<Topic> topics = topicMapper.selectByKeywordHeat(keyword.trim());

        PageInfo<Topic> info = new PageInfo<>(topics);

        PageBean<Topic> pageBean =new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }


    // 搜索Topics, 根据最近创建返回
    @Override
    public Result searchTopicsByTime(String keyword, int pageSize, int currentPage, String order) {
        // 空关键词处理（可选：返回空列表或全部数据）
        if (keyword == null || keyword.trim().isEmpty()) {
            return Result.fail(null, ResultCodeEnum.SEARCH_KEYWORD_EMPTY);
        }

        PageHelper.startPage(currentPage, pageSize);

        List<Topic> topics = topicMapper.selectByKeywordTime(keyword.trim(), order);

        PageInfo<Topic> info = new PageInfo<>(topics);

        PageBean<Topic> pageBean =new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    @Override
    public int getTopicCountByUserId(Integer userId) {
        return topicMapper.countTopicsByUserId(userId);
    }

    @Override
    public int getTopicLikesCountByUserId(Integer userId) {
        return topicMapper.countTopicLikesByUserId(userId);
    }

    @Override
    public int getTopicCommentsCountByUserId(Integer userId) {
        return topicMapper.countTopicCommentsByUserId(userId);
    }
    @Override
    public int getTopicRatingsCountByUserId(Integer userId) {
        return topicMapper.countTopicRatingsByUserId(userId);
    }


    @Override
    public Result getUserTopicsByTime(Integer userId) {
        List<Topic> topics = topicMapper.selectUserTopicsByTime(userId);
        return Result.ok(topics, ResultCodeEnum.SUCCESS);
    }
}

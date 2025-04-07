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

import java.util.Collections;
import java.util.List;

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
        PageHelper.startPage(currentPage, pageSize);

        List<Topic> topics = topicMapper.selectAllByHeat();

        PageInfo<Topic> info = new PageInfo<>(topics);

        PageBean<Topic> pageBean =new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result getTopicById(int topicId) {
        Topic topic = topicMapper.selectTopicByIdWithUser(topicId);

        if (topic == null) {
            return Result.fail(null, ResultCodeEnum.TOPIC_DOES_NOT_EXISTS);
        }

        return Result.ok(topic, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result searchTopics(String keyword) {
        try {
            // 空关键词处理（可选：返回空列表或全部数据）
            if (keyword == null || keyword.trim().isEmpty()) {
                return Result.ok(null, ResultCodeEnum.SEARCH_KEYWORD_EMPTY);
            }

            List<Topic> topics = topicMapper.selectByKeyword(keyword.trim());
            return Result.ok(topics, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            log.error("搜索失败", e);
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }
    }
}

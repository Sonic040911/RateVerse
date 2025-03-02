package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Topic;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.service.TopicService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicMapper topicMapper;

    @Override
    public Result getTopicsByTimePage(int pageSize, int currentPage) {
        PageHelper.startPage(currentPage, pageSize);

        List<Topic> topics = topicMapper.selectAllByTime();

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
}

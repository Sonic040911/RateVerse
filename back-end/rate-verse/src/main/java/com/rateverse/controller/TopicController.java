package com.rateverse.controller;

import com.rateverse.service.TopicService;
import com.rateverse.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 主题的控制类
 */
@RestController
@RequestMapping("api/topic")
@Slf4j
public class TopicController {
    @Autowired
    private TopicService topicService;

    // 在主页中按照时间排序返回所有Topic (Topic中包含List<Item>)
    @GetMapping("/getAllByTime/{pageSize}/{currentPage}")
    public Result getAllTopicsByTime(@PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.getTopicsByTimePage(pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的Topics有: {}", result);

        return result;
    }

    // 用户点开了一个Topic，返回Topic的所有信息给前端 (包括用户信息, 因为需要知道谁创建的)
    @GetMapping("/{topicId}")
    public Result getTopicById(@PathVariable int topicId) {
        Result result = topicService.getTopicById(topicId);

        System.out.println("===========log.info============");
        log.info("用户打开的Topic为: {}", result);

        return result;
    }
}

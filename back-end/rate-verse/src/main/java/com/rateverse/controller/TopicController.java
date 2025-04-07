package com.rateverse.controller;

import com.rateverse.service.TopicService;
import com.rateverse.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /***
     * 在主页中按照时间 (最近创建) 返回所有Topic
     *
     * @param pageSize     一页中显示多少个Topic
     * @param currentPage  当前页数
     *
     * @return 按照分页正常返回 List<Topic> 每一个Topic中包含List<Item> 为了显示前3个Item
     */
    @GetMapping("/getAllByTime/{pageSize}/{currentPage}")
    public Result getAllTopicsByTime(@PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.getTopicsByTimePage(pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的Topics有: {}", result);

        return result;
    }

    // 按热度排序在主页中显示所有Topic
    @GetMapping("/getAllByHeat/{pageSize}/{currentPage}")
    public Result getAllTopicsByHeat(@PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.getTopicsByHeatPage(pageSize, currentPage);

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


    // 搜索 (按照时间排序)
    @GetMapping("/search")
    public Result searchTopics(@RequestParam String keyword) {
        Result result = topicService.searchTopics(keyword);

        log.info("搜索关键词: {} | 结果数量: {}", keyword,
                result.isFlag() ? ((List<?>) result.getData()).size() : 0);

        return result;
    }


    // 搜索 (按照热度排序)
}

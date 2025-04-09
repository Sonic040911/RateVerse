package com.rateverse.controller;

import com.rateverse.service.TopicService;
import com.rateverse.utils.PageBean;
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

    /***
     * (后续前端需要连接)
     *
     * 按热度排序在主页中显示所有Topic
     *
     * @param pageSize     一页中显示多少个Topic
     * @param currentPage  当前页数
     *
     * @return  按照分页正常返回 List<Topic> 每一个Topic中包含List<Item> 为了显示前3个Item
     */
    @GetMapping("/getAllByHeat/{pageSize}/{currentPage}")
    public Result getAllTopicsByHeat(@PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.getTopicsByHeatPage(pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的Topics有: {}", result);

        return result;
    }


    /***
     * 用户点开了一个Topic，返回Topic的所有信息给前端 (包括用户信息, 因为需要知道谁创建的)
     *
     * @param topicId 评分主题的id
     *
     * @return 成功:
     *              * 返回 Topic, 里面包含 User 对象, 也就是这个Topic的创建者
     *         失败:
     *              * TOPIC_DOES_NOT_EXISTS(701): 没找到相关Topic
     */
    @GetMapping("/{topicId}")
    public Result getTopicById(@PathVariable int topicId) {
        Result result = topicService.getTopicById(topicId);

        System.out.println("===========log.info============");
        log.info("用户打开的Topic为: {}", result);

        return result;
    }


    /***
     * (后续前端需要连接)
     *
     * @param keyword     搜索关键词
     * @param pageSize    一页中显示多少个Topic
     * @param currentPage 当前页数
     *
     * @return 成功:
     *              * 返回所有相关的Topic
     *         失败:
     *              * SEARCH_KEYWORD_EMPTY(703): 搜索词为空, 不给任何数据, 前端不让搜索
     */
    @GetMapping("/searchByHeat/{pageSize}/{currentPage}")
    public Result searchTopicsByHeat(@RequestParam String keyword,
                                     @PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.searchTopicsByHeat(keyword, pageSize, currentPage);

        log.info("搜索关键词: {} | 结果数量: {}", keyword,
                result.isFlag() ? ((PageBean<?>) result.getData()).getData().size() : 0);

        return result;
    }

    /***
     * (后续前端需要连接)
     *
     * 搜索Topic (根据时间, 最近创建的优先)
     *
     * @param keyword    搜索关键词
     * @param pageSize    一页中显示多少个Topic
     * @param currentPage 当前页数
     *
     * @return 成功:
     *              * 返回所有相关的Topic
     *         失败:
     *              * SEARCH_KEYWORD_EMPTY(703): 搜索词为空, 不给任何数据, 前端不让搜索
     */
    @GetMapping("/searchByTime/{pageSize}/{currentPage}")
    public Result searchTopicsByTime(@RequestParam String keyword,
                                     @PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = topicService.searchTopicsByTime(keyword, pageSize, currentPage);

        log.info("搜索关键词: {} | 结果数量: {}", keyword,
                result.isFlag() ? ((PageBean<?>) result.getData()).getData().size() : 0);

        return result;
    }
}

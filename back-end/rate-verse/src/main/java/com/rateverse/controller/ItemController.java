package com.rateverse.controller;

import com.rateverse.service.ItemService;
import com.rateverse.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 物品的控制类
 */
@RestController
@RequestMapping("/api/item")
@Slf4j
public class ItemController {
    @Autowired
    private ItemService itemService;

    /***
     * 打开指定Topic后, 跟着把所有Items给前端
     *
     * @param topicId     评分主题的Id
     * @param pageSize    一页显示多少个Items
     * @param currentPage 当前页数
     * @param sortType    排序方式
     *
     * @return 成功:
     *              * 正常返回
     *         失败:
     *              * TOPIC_DOES_NOT_EXISTS(701): 没找到指定的Topic
     */
    @GetMapping("/getItemsByTopicId/{topicId}/{pageSize}/{currentPage}")
    public Result getItemsByTopicId(@PathVariable int topicId,
                                    @PathVariable int pageSize,
                                    @PathVariable int currentPage,
                                    @RequestParam(defaultValue = "popular") String sortType) {
        Result result = itemService.getItemsByTopicId(topicId, pageSize, currentPage, sortType);

        System.out.println("===========log.info============");
        log.info("查询到的items有: {}", result);

        return result;
    }


    /***
     * 获取Item详细 (包含评分分布)
     *
     * @param itemId 评分项id
     *
     * @return 成功:
     *              * 返回Item的所有信息, 包含评分分布
     *         失败:
     *              * ITEM_DOES_NOT_EXISTS(702): 没找到指定的Item
     */
    @GetMapping("/status/{itemId}")
    public Result getItemByIdWithStats(@PathVariable Integer itemId) {
        Result result = itemService.getItemByIdWithStats(itemId);

        System.out.println("===========log.info============");
        log.info("用户打开的Item为: {}", result);

        return result;
    }
}

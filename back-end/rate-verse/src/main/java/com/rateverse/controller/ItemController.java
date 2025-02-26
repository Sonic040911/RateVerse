package com.rateverse.controller;

import com.rateverse.service.ItemService;
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
 * @description: 物品的控制类
 */
@RestController
@RequestMapping("/api/item")
@Slf4j
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping("/getItemsByTopicId/{topicId}/{pageSize}/{currentPage}")
    public Result getItemsByTopicId(@PathVariable int topicId,
                                    @PathVariable int pageSize,
                                    @PathVariable int currentPage) {
        Result result = itemService.getItemsByTopicId(topicId, pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的items有: {}", result);

        return result;
    }


    @GetMapping("{itemId}")
    public Result getItemById(@PathVariable int itemId) {
        Result result = itemService.getItemById(itemId);

        System.out.println("===========log.info============");
        log.info("用户打开的Item为: {}", result);

        return result;
    }
}

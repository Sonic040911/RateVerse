package com.rateverse.controller;

import com.rateverse.bean.Rating;
import com.rateverse.bean.User;
import com.rateverse.service.RatingService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评分的控制层
 */

@RestController
@RequestMapping("/api/rating")
@Slf4j
public class RatingController {
    @Autowired
    private RatingService ratingService;

    // 评论一个评分项
    @PostMapping()
    public Result submitRating(@RequestBody Rating rating, HttpSession session) {
        // 获取当前userId, 确认这个Rating是谁创建的
        User user = (User) session.getAttribute("user");

        rating.setUserId(user.getId());

        Result result = ratingService.submitRating(rating);

        System.out.println("===========log.info============");
        log.info("添加的评分项为: {}", result);

        return result;
    }

    // 获取用户对指定 Item 的评分
    @GetMapping("/{itemId}/user")
    public Result getUserRating(@PathVariable Integer itemId, HttpSession session) {
        User user = (User) session.getAttribute("user");

        Rating rating = ratingService.getUserRating(user.getId(), itemId);
        if (rating != null) {
            return Result.ok(rating, ResultCodeEnum.SUCCESS);
        } else {
            return Result.ok(null, ResultCodeEnum.SUCCESS); // 返回 null 表示用户未评分
        }
    }
}

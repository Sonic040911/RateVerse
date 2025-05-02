package com.rateverse.service;

import com.rateverse.bean.Rating;
import com.rateverse.utils.Result;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface RatingService {
    // 提交一个用户的评分
    Result submitRating(Rating rating);

    Rating getUserRating(Integer userId, Integer itemId);
}

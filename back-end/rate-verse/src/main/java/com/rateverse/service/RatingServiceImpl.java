package com.rateverse.service;

import com.rateverse.bean.Item;
import com.rateverse.bean.Rating;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.mapper.RatingMapper;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
@Transactional
public class RatingServiceImpl implements RatingService {
    @Autowired
    private RatingMapper ratingMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private TopicMapper topicMapper;

    @Override
    public Result submitRating(Rating rating) {
        // 查询Item存在与否
        if (rating.getItemId() == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        // 保证分数的合规性
        if (rating.getScore() < 1 || rating.getScore() > 5) {
            return Result.fail(null, ResultCodeEnum.RATING_SCORE_ERROR);
        }

        // 查询是否已存在评分
        Rating isExists = ratingMapper.getUserRating(rating.getUserId(), rating.getItemId());

        // 如果评分已存在，那就更新用户的评分
        if (isExists != null) {
            ratingMapper.updateRating(rating);
        }
        // 如果不存在，则添加评分
        else {
            ratingMapper.insertRating(rating);
        }

        // 更新Item和Topic的统计
        updateItemStats(rating.getItemId());
        updateTopicStats(rating.getItemId());

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }

    // 实时更新Item里面的总评分人数和这个Item的平均评分
    private void updateItemStats(Integer itemId) {
        Double itemRatingAvg = ratingMapper.getAverageScoreByItemId(itemId);
        Integer itemRatingCount = ratingMapper.getRatingCountByItemId(itemId);

        // 更新
        itemMapper.updateRatingStats(itemId, itemRatingAvg, itemRatingCount);
    }

    // 实时更新Topic里面的总评分人数
    private void updateTopicStats(Integer itemId) {
        // 获取 Item 对应的 Topic ID
        Item item = itemMapper.selectItemById(itemId);
        Integer topicId = item.getTopicId();

        // 统计该Topic下，去重的评分用户人数
        Integer totalUsers = ratingMapper.countDistinctUsersByTopicId(topicId);

        // 更新Topic表的total_ratings字段
        topicMapper.updateTotalRatings(topicId, totalUsers);
    }
}

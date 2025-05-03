package com.rateverse.service.impl;

import com.rateverse.bean.*;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.mapper.RatingMapper;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.mapper.UserMapper;
import com.rateverse.service.NotificationService;
import com.rateverse.service.RatingService;
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

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private NotificationService notificationService;

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
        Rating existingRating = ratingMapper.getUserRating(rating.getUserId(), rating.getItemId());

        // 如果评分已存在，那就更新用户的评分
        if (existingRating != null) {
            ratingMapper.updateRating(rating);
        }
        // 如果不存在，则添加评分
        else {
            ratingMapper.insertRating(rating);
        }

        // 生成通知
        Item item = itemMapper.selectItemById(rating.getItemId());
        if (item != null) {
            Integer topicId = item.getTopicId();
            Topic topic = topicMapper.selectTopicByIdWithUser(topicId);
            if (topic != null && topic.getUserId() != null && !topic.getUserId().equals(rating.getUserId())) {
                User sender = userMapper.selectUserById(rating.getUserId());
                String senderName = sender != null ? sender.getUsername() : "Anonymous";
                String itemName = item.getName() != null ? item.getName() : "Unknown Item";
                String message = String.format("%s rated your item '%s' with a score of %d.", senderName, itemName, rating.getScore());
                Notification notification = new Notification();
                notification.setUserId(topic.getUserId());
                notification.setSenderId(rating.getUserId());
                notification.setType("RATING");
                notification.setItemId(rating.getItemId());
                notification.setCommentId(null); // 评分无评论
                notification.setMessage(message);
                notificationService.createNotification(notification);
            }
        }

        // 更新Item和Topic的统计
        updateItemStats(rating.getItemId());
        updateTopicStats(rating.getItemId());

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Rating getUserRating(Integer userId, Integer itemId) {
        return ratingMapper.getUserRating(userId, itemId);
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

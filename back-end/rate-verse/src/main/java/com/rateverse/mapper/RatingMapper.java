package com.rateverse.mapper;

import com.rateverse.bean.Rating;
import com.rateverse.bean.ScoreDistribution;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对Rating表的数据库操作
 */
public interface RatingMapper {
    // ==================== CRUD 操作 ====================
    // 插入评分
    int insertRating(Rating rating);


    // 更新评分 (用户可以更改之前的评分)
    int updateRating(Rating rating);


    // 删除评分 (用户撤销评分)
    int deleteRating(@Param("userId") int userId, @Param("itemId") int itemId);


    // ==================== 查询操作 ====================
    // 查询某个评分项的平均分
    Double getAverageScoreByItemId(int itemId);


    // 查询某个用户对某个评分项的评分
    Rating getUserRating(@Param("userId") int userId, @Param("itemId") int itemId);


    // 查询某个物品的总评分人数
    Integer getRatingCountByItemId(int itemId);


    // 查询某个评分项的所有评分
    List<Rating> getRatingsByItemId(int itemId);


    // 查询某个用户的所有评分
    List<Rating> getRatingsByUserId(int userId);


    // 统计某个 Topic 下去重的评分用户数 (一共有多少个人评价了这个Topic，而不是Topic里面的Items)
    Integer countDistinctUsersByTopicId(Integer topicId);


    // 获取评分项的评分分布数据
    List<ScoreDistribution> selectScoreDistributionByItem(Integer itemId);
}

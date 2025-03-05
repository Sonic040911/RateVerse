package com.rateverse.bean;

import lombok.Data;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对每一个Item的评分进行分布, 后面会和Map进行组合
 *               0: "item" -> Item
 *               1: "scoreDistribution" -> ScoreDistribution
 */
@Data
public class ScoreDistribution {
    private Integer score;      // 星级（1-5）
    private Integer count;      // 该星级评分人数
    private Double percentage;  // 占比百分比（0.0 - 100.0）
}

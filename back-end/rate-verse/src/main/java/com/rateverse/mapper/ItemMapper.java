package com.rateverse.mapper;

import com.rateverse.bean.Item;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评分对象的数据库操作
 */
public interface ItemMapper {
    // ==================== CRUD 操作 ====================
    // 插入新评分项
    int insertItem(Item item);

    // 更新评分项
    int updateItem(Item item);

    // 删除评分项 (根据item_id)
    int deleteItemById(Integer id);

    // 删除一堆评分项 (根据topic_id)
    int deleteItemsByTopicId(Integer topicId);


    // ==================== 查询操作 ====================
    // 查询评分项 (根据item_id)
    Item selectItemById(Integer id);

    // 查询一堆评分项 (根据topic_id) (分页)
    List<Item> selectItemsByTopicId(Integer topicId);


    // ==================== 统计与更新操作 ====================
    // 更新评分项的统计信息 (平均评分，总评分人数)
    int updateRatingStatus(Integer itemId, Integer newRating);

    // 增加评论数量
    int incrementCommentCount(Integer id);

    // 减少评论数量 (未来写)


    // 统计主题下的评分项总数
    int countItemsByTopicId(Integer topicId);
}

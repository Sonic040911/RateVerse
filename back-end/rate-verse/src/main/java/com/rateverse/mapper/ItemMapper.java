package com.rateverse.mapper;

import com.rateverse.bean.Item;
import org.apache.ibatis.annotations.Param;

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

    Integer getTopicIdByItemId(Integer id);


    // ==================== 统计与更新操作 ====================
    // 更新评分项的评分统计信息 (平均评分，总评分人数)
    int updateRatingStats(@Param("id") Integer id, @Param("avg") Double avg, @Param("count") Integer count);

    // 更新评分项的评论统计信息
    int updateCommentStats(@Param("id") Integer id, @Param("count") Integer count);

    // 统计主题下的评分项总数
    int countItemsByTopicId(Integer topicId);
}

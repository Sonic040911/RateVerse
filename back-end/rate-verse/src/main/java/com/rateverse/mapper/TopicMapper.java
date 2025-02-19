package com.rateverse.mapper;

import com.rateverse.bean.Topic;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对评分事件标题的数据库操作
 */
public interface TopicMapper {
    // ==================== CRUD 操作 ====================
    // 增加topic
    int insertTopic(Topic topic);

    // 删除topic (根据id)
    int deleteTopicById(Integer id);

    // 更新主题信息
    int updateTopic(Topic topic);


    // ==================== 查询操作 ====================
    // 查询主题 (根据主题的id)
    Topic selectTopicById(Integer id);

    // 查询主题 (根据userId) (未来最好改成分页查询)
    List<Topic> selectTopicByUserId(Integer id);

    // 统计用户创建的主题数量
    int countTopicsByUserId(Integer userId);

    // 根据标题关键词搜索主题
    List<Topic> searchTopicsByTitle(String keyword);
}

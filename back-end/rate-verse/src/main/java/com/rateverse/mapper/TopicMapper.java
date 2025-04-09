package com.rateverse.mapper;

import com.rateverse.bean.Topic;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对评分事件标题的数据库操作
 */
public interface TopicMapper {
    // ==================== CRUD 操作 ====================
    // 增加topic (返回自增长id)
    int insertTopic(Topic topic);

    // 删除topic (根据id)
    int deleteTopicById(Integer id);

    // 更新主题信息
    int updateTopic(Topic topic);

    // 更新主题的总评论数
    int updateTotalComments(@Param("topicId") Integer topicId, @Param("totalComments") Integer totalComments);

    // 更新主题的总评分人数
    int updateTotalRatings(@Param("topicId") Integer topicId, @Param("totalRatings") Integer totalRatings);


    // ==================== 查询操作 ====================
    // 查询主题 (根据主题的id)
    Topic selectTopicByIdWithUser(Integer id);

    // 查询所有主题 (按时间排序 最新的先出现) (分页)
    List<Topic> selectAllByTime();

    // 查询所有主题 (按热度排序) (分页)
    List<Topic> selectAllByHeat();

    // 查询主题 (根据userId) (未来最好改成分页查询)
    List<Topic> selectTopicByUserId(Integer id);

    // 统计用户创建的主题数量
    int countTopicsByUserId(Integer userId);

    // 搜索, 根据时间
    List<Topic> selectByKeywordTime(String keyword);

    // 搜索, 根据热度
    List<Topic> selectByKeywordHeat(String keyword);


    int countTopicLikesByUserId(Integer userId);
    int countTopicCommentsByUserId(Integer userId);
    int countTopicRatingsByUserId(Integer userId);
}

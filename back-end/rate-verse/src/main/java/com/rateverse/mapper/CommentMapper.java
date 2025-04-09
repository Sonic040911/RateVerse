package com.rateverse.mapper;

import com.rateverse.bean.Comment;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface CommentMapper {
    // 插入新评论（返回自增ID）
    int insertComment(Comment comment);

    // 根据ID查询评论
    Comment selectById(Integer commentId);

    // 删除评论（级联删除子评论需在数据库配置）
    int deleteComment(Integer commentId);

    // 更新评论内容
    int updateContent(@Param("commentId") Integer commentId, @Param("content") String content);

    // 根据ItemId查询所有评论 (可分类)
    List<Comment> selectByItemIdWithSort(@Param("itemId") int itemId, @Param("sortType") String sortType);

    // 查询某个评论的子评论（回复）
    List<Comment> selectChildrenByParentId(Integer parentCommentId);

    // 统计某个评分项的总评论数
    Integer countByItem(Integer itemId);

    // 统计某个Topic的总评论数
    Integer countByTopic(Integer topicId);


    // 增加点赞数（原子操作）
    int incrementLikes(Integer commentId);

    // 减少点赞数（原子操作，不低于0）
    int decrementLikes(Integer commentId);

    // 增加点踩数（原子操作）
    int incrementDislike(Integer commentId);

    // 减少点踩数（原子操作，不低于0）
    int decrementDislike(Integer commentId);
}

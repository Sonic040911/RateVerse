package com.rateverse.mapper;

import com.rateverse.bean.CommentLike;
import org.apache.ibatis.annotations.Param;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface CommentLikeMapper {
    // 插入或更新操作记录
    int upsert(CommentLike commentLike);

    // 删除用户对某评论的特定操作
    int deleteByUserAndCommentAndType(
            @Param("userId") Integer userId,
            @Param("commentId") Integer commentId,
            @Param("actionType") String actionType
    );

    // 查询用户对某评论的操作类型
    CommentLike selectByUserAndComment(
            @Param("userId") Integer userId,
            @Param("commentId") Integer commentId
    );
}

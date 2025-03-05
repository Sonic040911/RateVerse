package com.rateverse.service;

import com.rateverse.bean.Comment;
import com.rateverse.utils.Result;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface CommentService {
    Result addComment(Comment comment);

    Result getCommentsByTime(int itemId, int pageSize, int currentPage);

    Result getCommentsByLikes(int itemId, int pageSize, int currentPage);

    Result replyComment(Comment childComment);

    Result deleteComment(Integer commentId, Integer userId);

    Result handleVote(Integer commentId, Integer id, String like);

    List<Comment> getRepliesByParentId(Integer parentCommentId);
}

package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Comment;
import com.rateverse.bean.CommentLike;
import com.rateverse.bean.Item;
import com.rateverse.mapper.CommentLikeMapper;
import com.rateverse.mapper.CommentMapper;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.mapper.TopicMapper;
import com.rateverse.service.CommentService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private CommentLikeMapper commentLikeMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private TopicMapper topicMapper;


    // 获取所有评论（根据 sortType 动态排序）
    @Override
    public Result getCommentsByItemId(int itemId, int pageSize, int currentPage, String sortType) {
        // 校验评论项是否存在
        if (itemMapper.selectItemById(itemId) == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        // 分页返回结果给前端（只返回顶级评论）
        PageHelper.startPage(currentPage, pageSize);
        List<Comment> comments = commentMapper.selectByItemIdWithSort(itemId, sortType);
        PageInfo<Comment> info = new PageInfo<>(comments);
        PageBean<Comment> pageBean = new PageBean<>(currentPage, pageSize, info.getTotal(), info.getList());
        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    // 获取所有子评论 (基于父评论的ID)
    @Override
    public List<Comment> getRepliesByParentId(Integer parentCommentId) {
        return commentMapper.selectChildrenByParentId(parentCommentId);
    }

    // 添加一条评论 (对象里面有对应的ItemId)
    @Override
    public Result addComment(Comment comment) {
        // 查询此Item是否存在
        Item item = itemMapper.selectItemById(comment.getItemId());
        if (item == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        // 添加评论
        commentMapper.insertComment(comment);

        // 更新统计字段
        updateItemCommentsCount(comment.getItemId());
        updateTopicCommentsCount(comment.getItemId());

        // 把数据库中的id返回给前端，以后要根据这个id进行回复
        comment.setId(comment.getId());

        return Result.ok(comment, ResultCodeEnum.SUCCESS);
    }

    // 回复一条评论
    @Override
    public Result replyComment(Comment childComment) {
        // 校验父评论的是否存在
        Comment parentComment = commentMapper.selectById(childComment.getParentCommentId());
        if (parentComment == null) {
            return Result.fail(childComment, ResultCodeEnum.PARENT_COMMENT_NOT_FOUND);
        }

        // 校验父评论和子评论是否属于同一个评分项
        if (!parentComment.getItemId().equals(childComment.getItemId())) {
            return Result.fail(childComment, ResultCodeEnum.COMMENT_ITEM_MISMATCH);
        }

        // 插入评论
        commentMapper.insertComment(childComment);

        // 更新统计字段
        updateItemCommentsCount(childComment.getItemId());
        updateTopicCommentsCount(childComment.getItemId());

        // 设置id返回给前端，以后要用
        childComment.setId(childComment.getId());

        return Result.ok(childComment, ResultCodeEnum.SUCCESS);
    }


    // 删除一个评论
    @Override
    public Result deleteComment(Integer commentId, Integer userId) {
        // 查询评论是否存在
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            return Result.fail(null, ResultCodeEnum.COMMENT_NOT_FOUND);
        }

        // 查询评论归属权 (别的用户不能删除别的评论)
        if (!comment.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.PERMISSION_DENIED);
        }

        // 删除所有子评论
        deleteChildComments(commentId);

        // 删除当前评论
        commentMapper.deleteComment(commentId);

        // 更新统计字段
        updateItemCommentsCount(comment.getItemId());
        updateTopicCommentsCount(comment.getItemId());

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }

    /*
    * 同时处理点赞和倒赞
    *    * 第一次点赞/倒赞: 添加记录到comment_like 并 增加评论的对应统计
    *
    *    * 第二次点赞/倒赞: 意味着是取消点赞, 删除comment_like中的记录 并 删除评论的对应统计
    *
    *    * 切换点赞/倒赞:   删除旧的comment_like，添加新的comment_like 并 删除再增加对应的评论统计
    */
    @Override
    public Result handleVote(Integer commentId, Integer userId, String actionType) {
        // 1. 查询历史操作
        CommentLike existing = commentLikeMapper.selectByUserAndComment(userId, commentId);

        // 点赞或倒赞过了
        if (existing != null) {
            // 情况1：重复点击相同操作 → 取消
            if (existing.getActionType().equals(actionType)) {
                commentLikeMapper.deleteByUserAndCommentAndType(userId, commentId, actionType);
                decrementCounter(commentId, actionType); // 减少计数
                return Result.ok(existing, ResultCodeEnum.SUCCESS);
            }

            // 情况2：切换操作类型 → 删除旧记录，添加新记录
            else {
                commentLikeMapper.deleteByUserAndCommentAndType(userId, commentId, existing.getActionType());
                decrementCounter(commentId, existing.getActionType());

                CommentLike newAction = new CommentLike();
                newAction.setUserId(userId);
                newAction.setCommentId(commentId);
                newAction.setActionType(actionType);
                commentLikeMapper.upsert(newAction);

                incrementCounter(commentId, actionType); // 增加新计数
                return Result.ok(existing, ResultCodeEnum.SUCCESS);
            }
        }

        // 情况3：首次操作 → 新增记录
        else {
            CommentLike action = new CommentLike();
            action.setUserId(userId);
            action.setCommentId(commentId);
            action.setActionType(actionType);
            commentLikeMapper.upsert(action);

            incrementCounter(commentId, actionType);
            return Result.ok(action, ResultCodeEnum.SUCCESS);
        }
    }

    // 更新 Item 的 total_comments
    private void updateItemCommentsCount(Integer itemId) {
        // 获取当前评论数
        Integer totalComments = commentMapper.countByItem(itemId);

        // 更新 Item 表
        itemMapper.updateCommentStats(itemId, totalComments);
    }


    // 更新 Topic 的 total_comments
    private void updateTopicCommentsCount(Integer itemId) {
        // 获取 Item 对应的 Topic ID
        Integer topicId = itemMapper.getTopicIdByItemId(itemId);

        // 获取当前评论数
        Integer totalComments = commentMapper.countByTopic(topicId);

        topicMapper.updateTotalComments(topicId, totalComments);
    }

    /*
    * 删除所有子评论
    *
    * 如果它是一个子评论怎么办?
    *        那这个parentCommentId不是它真正的parentId
    *        而是它自己的id，那在查询它的子评论时，是查询不到的，因为子评论肯定没有子评论, 直接返回
    * */
    private void deleteChildComments(Integer parentCommentId) {
        // 查询子评论，如果它是子评论本身，这个children就是空的, 返回即可
        List<Comment> children = commentMapper.selectChildrenByParentId(parentCommentId);
        if (children == null) {
            return;
        }

        for (Comment child : children) {
            commentMapper.deleteComment(child.getId());
        }
    }

    // 增加该评论点赞或倒赞的对应计数
    private void incrementCounter(Integer commentId, String actionType) {
        if ("like".equals(actionType)) {
            commentMapper.incrementLikes(commentId);
        } else {
            commentMapper.incrementDislike(commentId);
        }
    }

    // 减少该评论点赞或倒赞的对应计数
    private void decrementCounter(Integer commentId, String actionType) {
        if ("like".equals(actionType)) {
            commentMapper.decrementLikes(commentId);
        } else {
            commentMapper.decrementDislike(commentId);
        }
    }
}

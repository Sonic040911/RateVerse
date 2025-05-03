package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.*;
import com.rateverse.mapper.*;
import com.rateverse.service.CommentService;
import com.rateverse.service.NotificationService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.List;

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

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private NotificationService notificationService;

    private static final int MAX_RETRY_ATTEMPTS = 3;

    @Override
    public Result getCommentsByItemId(int itemId, int pageSize, int currentPage, String sortType) {
        if (itemMapper.selectItemById(itemId) == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        PageHelper.startPage(currentPage, pageSize);
        List<Comment> comments = commentMapper.selectByItemIdWithSort(itemId, sortType);
        PageInfo<Comment> info = new PageInfo<>(comments);
        PageBean<Comment> pageBean = new PageBean<>(currentPage, pageSize, info.getTotal(), info.getList());
        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    @Override
    public List<Comment> getRepliesByParentId(Integer parentCommentId) {
        return commentMapper.selectChildrenByParentId(parentCommentId);
    }

    @Override
    public Result addComment(Comment comment) {
        Item item = itemMapper.selectItemById(comment.getItemId());
        if (item == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        // 主事务：插入评论和通知
        commentMapper.insertComment(comment);

        // 生成通知
        Integer topicId = itemMapper.getTopicIdByItemId(comment.getItemId());
        Topic topic = topicMapper.selectTopicByIdWithUser(topicId);
        if (topic != null && topic.getUserId() != null && !topic.getUserId().equals(comment.getUserId())) {
            User sender = userMapper.selectUserById(comment.getUserId());
            String senderName = sender != null ? sender.getUsername() : "Anonymous";
            String itemName = item.getName() != null ? item.getName() : "Unknown Item";
            String message = String.format("%s commented on your item '%s'.", senderName, itemName);
            Notification notification = new Notification();
            notification.setUserId(topic.getUserId());
            notification.setSenderId(comment.getUserId());
            notification.setType("COMMENT");
            notification.setItemId(comment.getItemId());
            notification.setCommentId(comment.getId());
            notification.setMessage(message);
            notificationService.createNotification(notification);
        }

        // 异步更新计数（新事务）
        try {
            updateCountsWithRetry(comment.getItemId());
        } catch (Exception e) {
            // 记录错误但不回滚主事务
            System.err.println("Failed to update counts for itemId=" + comment.getItemId() + ": " + e.getMessage());
        }

        comment.setId(comment.getId());
        return Result.ok(comment, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result replyComment(Comment childComment) {
        Comment parentComment = commentMapper.selectById(childComment.getParentCommentId());
        if (parentComment == null) {
            return Result.fail(childComment, ResultCodeEnum.PARENT_COMMENT_NOT_FOUND);
        }

        if (!parentComment.getItemId().equals(childComment.getItemId())) {
            return Result.fail(childComment, ResultCodeEnum.COMMENT_ITEM_MISMATCH);
        }

        // 主事务：插入回复和通知
        commentMapper.insertComment(childComment);

        // 生成通知
        if (parentComment.getUserId() != null && !parentComment.getUserId().equals(childComment.getUserId())) {
            User sender = userMapper.selectUserById(childComment.getUserId());
            String senderName = sender != null ? sender.getUsername() : "Anonymous";
            Item item = itemMapper.selectItemById(childComment.getItemId());
            String itemName = item != null && item.getName() != null ? item.getName() : "Unknown Item";
            String message = String.format("%s replied to your comment on '%s'.", senderName, itemName);
            Notification notification = new Notification();
            notification.setUserId(parentComment.getUserId());
            notification.setSenderId(childComment.getUserId());
            notification.setType("REPLY");
            notification.setCommentId(childComment.getId());
            notification.setItemId(childComment.getItemId());
            notification.setMessage(message);
            notificationService.createNotification(notification);
        }

        // 异步更新计数（新事务）
        try {
            updateCountsWithRetry(childComment.getItemId());
        } catch (Exception e) {
            System.err.println("Failed to update counts for itemId=" + childComment.getItemId() + ": " + e.getMessage());
        }

        childComment.setId(childComment.getId());
        return Result.ok(childComment, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result deleteComment(Integer commentId, Integer userId) {
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            return Result.fail(null, ResultCodeEnum.COMMENT_NOT_FOUND);
        }

        if (!comment.getUserId().equals(userId)) {
            return Result.fail(null, ResultCodeEnum.PERMISSION_DENIED);
        }

        deleteChildComments(commentId);
        commentMapper.deleteComment(commentId);

        // 异步更新计数（新事务）
        try {
            updateCountsWithRetry(comment.getItemId());
        } catch (Exception e) {
            System.err.println("Failed to update counts for itemId=" + comment.getItemId() + ": " + e.getMessage());
        }

        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result handleVote(Integer commentId, Integer userId, String actionType) {
        CommentLike existing = commentLikeMapper.selectByUserAndComment(userId, commentId);

        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            return Result.fail(null, ResultCodeEnum.COMMENT_NOT_FOUND);
        }

        if (existing != null) {
            if (existing.getActionType().equals(actionType)) {
                commentLikeMapper.deleteByUserAndCommentAndType(userId, commentId, actionType);
                decrementCounter(commentId, actionType);
                return Result.ok(existing, ResultCodeEnum.SUCCESS);
            } else {
                commentLikeMapper.deleteByUserAndCommentAndType(userId, commentId, existing.getActionType());
                decrementCounter(commentId, existing.getActionType());

                CommentLike newAction = new CommentLike();
                newAction.setUserId(userId);
                newAction.setCommentId(commentId);
                newAction.setActionType(actionType);
                commentLikeMapper.upsert(newAction);

                incrementCounter(commentId, actionType);

                // 生成通知（仅在新增点赞时）
                if ("like".equalsIgnoreCase(actionType) && comment.getUserId() != null && !comment.getUserId().equals(userId)) {
                    User sender = userMapper.selectUserById(userId);
                    String senderName = sender != null ? sender.getUsername() : "Anonymous";
                    Item item = itemMapper.selectItemById(comment.getItemId());
                    String itemName = item != null && item.getName() != null ? item.getName() : "Unknown Item";
                    String commentContent = comment.getContent() != null ? comment.getContent().length() > 50 ? comment.getContent().substring(0, 50) + "..." : comment.getContent() : "Unknown Comment";
                    String message = String.format("%s liked the comment you left on '%s': \"%s\".", senderName, itemName, commentContent);
                    Notification notification = new Notification();
                    notification.setUserId(comment.getUserId());
                    notification.setSenderId(userId);
                    notification.setType("LIKE");
                    notification.setCommentId(commentId);
                    notification.setItemId(comment.getItemId());
                    notification.setMessage(message);
                    notificationService.createNotification(notification);
                }

                return Result.ok(existing, ResultCodeEnum.SUCCESS);
            }
        } else {
            CommentLike action = new CommentLike();
            action.setUserId(userId);
            action.setCommentId(commentId);
            action.setActionType(actionType);
            commentLikeMapper.upsert(action);

            incrementCounter(commentId, actionType);

            // 生成通知（仅在新增点赞时）
            if ("like".equalsIgnoreCase(actionType) && comment.getUserId() != null && !comment.getUserId().equals(userId)) {
                User sender = userMapper.selectUserById(userId);
                String senderName = sender != null ? sender.getUsername() : "Anonymous";
                Item item = itemMapper.selectItemById(comment.getItemId());
                String itemName = item != null && item.getName() != null ? item.getName() : "Unknown Item";
                String commentContent = comment.getContent() != null ? comment.getContent().length() > 50 ? comment.getContent().substring(0, 50) + "..." : comment.getContent() : "Unknown Comment";
                String message = String.format("%s liked the comment you left on '%s': \"%s\".", senderName, itemName, commentContent);
                Notification notification = new Notification();
                notification.setUserId(comment.getUserId());
                notification.setSenderId(userId);
                notification.setType("LIKE");
                notification.setCommentId(commentId);
                notification.setItemId(comment.getItemId());
                notification.setMessage(message);
                notificationService.createNotification(notification);
            }

            return Result.ok(action, ResultCodeEnum.SUCCESS);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void updateItemCommentsCount(Integer itemId) {
        Integer totalComments = commentMapper.countByItem(itemId);
        itemMapper.updateCommentStats(itemId, totalComments);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void updateTopicCommentsCount(Integer itemId) {
        Integer topicId = itemMapper.getTopicIdByItemId(itemId);
        Integer totalComments = commentMapper.countByTopic(topicId);
        topicMapper.updateTotalComments(topicId, totalComments);
    }

    private void updateCountsWithRetry(Integer itemId) {
        int attempts = 0;
        while (attempts < MAX_RETRY_ATTEMPTS) {
            try {
                updateItemCommentsCount(itemId);
                updateTopicCommentsCount(itemId);
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts == MAX_RETRY_ATTEMPTS || !isDeadlockException(e)) {
                    throw new RuntimeException("Failed to update counts after " + attempts + " attempts", e);
                }
                try {
                    Thread.sleep(100 * attempts); // 指数退避
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted during retry", ie);
                }
            }
        }
    }

    private boolean isDeadlockException(Throwable e) {
        return e.getMessage() != null && e.getMessage().contains("Deadlock found when trying to get lock");
    }

    private void deleteChildComments(Integer parentCommentId) {
        List<Comment> children = commentMapper.selectChildrenByParentId(parentCommentId);
        if (children == null) {
            return;
        }

        for (Comment child : children) {
            commentMapper.deleteComment(child.getId());
        }
    }

    private void incrementCounter(Integer commentId, String actionType) {
        if ("like".equals(actionType)) {
            commentMapper.incrementLikes(commentId);
        } else {
            commentMapper.incrementDislike(commentId);
        }
    }

    private void decrementCounter(Integer commentId, String actionType) {
        if ("like".equals(actionType)) {
            commentMapper.decrementLikes(commentId);
        } else {
            commentMapper.decrementDislike(commentId);
        }
    }
}
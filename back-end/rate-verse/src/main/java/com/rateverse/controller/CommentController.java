package com.rateverse.controller;

import com.rateverse.bean.Comment;
import com.rateverse.bean.User;
import com.rateverse.service.CommentService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 评论的处理类
 */

@RestController
@RequestMapping("/api/comment")
@Slf4j
public class CommentController {
    @Autowired
    private CommentService commentService;

    /***
     * 获取所有评论（根据 sortType 动态排序）只获取父评论, 子评论由另一个handler获取
     *
     * @param itemId       评分项id
     * @param pageSize     一页显示多少个评论
     * @param currentPage  当前页数
     * @param sortType     排序方式
     *
     * @return 成功:
     *              * 返回所有父评论
     *         失败:
     *              * ITEM_DOES_NOT_EXISTS(702): 评分项不存在
     */
    @GetMapping("/getCommentsByItemId/{itemId}/{pageSize}/{currentPage}")
    public Result getCommentsByItemId(
            @PathVariable int itemId,
            @PathVariable int pageSize,
            @PathVariable int currentPage,
            @RequestParam(defaultValue = "time") String sortType) {
        Result result = commentService.getCommentsByItemId(itemId, pageSize, currentPage, sortType);

        log.info("查询到的comments (sortType={}): {}", sortType, result);

        return result;
    }

    /**
     * 获取每个父评论的子评论
     *
     * @param parentCommentId 父评论id
     *
     * @return 直接返回所有子评论
     */
    @GetMapping("/replies/{parentCommentId}")
    public Result getRepliesByParentId(@PathVariable Integer parentCommentId) {
        List<Comment> replies = commentService.getRepliesByParentId(parentCommentId);

        log.info("查询到的子评论: {}", replies);

        return Result.ok(replies, ResultCodeEnum.SUCCESS);
    }

    /***
     * 添加一个评论
     *
     * @param comment 评论信息
     *                前端要传入的内容: 该评论项的内容
     *
     * @param itemId  该评论所属的item
     *
     * @param session 用于获取用户的Id, 设置该评论是由谁创建的
     *
     * @return 成功:
     *              * 评论的所有信息
     *         失败:
     *              * ITEM_DOES_NOT_EXISTS(702): 找不到Item, 添加评论失败
     */
    @PostMapping("{itemId}")
    public Result addComment(@RequestBody Comment comment, @PathVariable Integer itemId,
                             HttpSession session) {
        // 获取当前用户
        User user = (User) session.getAttribute("user");

        System.out.println(user.getId());
        System.out.println(itemId);

        // 设置当前评论的userid和itemId
        comment.setUserId(user.getId());
        comment.setItemId(itemId);

        // 添加评论
        Result result = commentService.addComment(comment);

        System.out.println("===========log.info============");
        log.info("加入的评论为: {}", result);

        return result;
    }

    /***
     * 回复一个评论
     * @param childComment 子评论
     *                     前端应当传入: 父评论的id, 所属的itemId, 评论的内容
     *
     * @param session 获取当前回复的用户id, 设置该评论是由谁创建的
     *
     * @return 成功:
     *              * 回复成功, 返回子评论的所有信息
     *         失败:
     *              * PARENT_COMMENT_NOT_FOUND(901): 找不到对应的父评论, 回复失败
     *              * COMMENT_ITEM_MISMATCH(902):    父评论和子评论所在的Item不一致, 回复失败
     */
    @PostMapping("/reply")
    public Result replyComment(@RequestBody Comment childComment, HttpSession session) {
        // 获取当前用户
        User user = (User) session.getAttribute("user");

        // 设置当前子评论的userId
        childComment.setUserId(user.getId());

        Result result = commentService.replyComment(childComment);

        System.out.println("===========log.info============");
        log.info("回复的子评论为: {}", result);

        return result;
    }


    /***
     * 删除一个评论 (用户只能删除自己的评论)
     *
     * @param commentId 评论的id (前端传过来)
     * @param session 用于该用户的id, 验证别的用户不能删除别人的评论
     *
     * @return 成功: 删除成功
     *         失败:
     *              * COMMENT_NOT_FOUND(903):  评论不存在, 无法删除
     *              * PERMISSION_DENIED(1002): 无权删除别人的评论
     */
    @DeleteMapping("/{commentId}")
    public Result deleteComment(@PathVariable Integer commentId, HttpSession session) {
        // 获取当前用户
        User user = (User) session.getAttribute("user");

        Result result = commentService.deleteComment(commentId, user.getId());

        System.out.println("===========log.info============");
        log.info("删除的评论为: {}", result);

        return result;
    }

    // 点赞
    @PostMapping("/like/{commentId}")
    public Result likeComment(@PathVariable Integer commentId, HttpSession session) {
        User user = (User) session.getAttribute("user");

        Result result = commentService.handleVote(commentId, user.getId(), "like");

        System.out.println("===========log.info============");
        log.info("用户的点赞信息为: {}", result);

        return result;
    }

    // 倒赞
    @PostMapping("/dislike/{commentId}")
    public Result dislikeComment(@PathVariable Integer commentId, HttpSession session) {
        User user = (User) session.getAttribute("user");

        Result result = commentService.handleVote(commentId, user.getId(), "dislike");

        System.out.println("===========log.info============");
        log.info("用户的倒赞信息为: {}", result);

        return result;
    }
}

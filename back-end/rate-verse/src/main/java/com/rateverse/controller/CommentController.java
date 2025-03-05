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
 * @description:
 */

@RestController
@RequestMapping("/api/comment")
@Slf4j
/* 这个Controller对itemId的依赖非常之大，让前端传itemId! */
public class CommentController {
    @Autowired
    private CommentService commentService;


    // 得到所有Comments (根据时间)
    @GetMapping({"/getCommentsByTime/{itemId}/{pageSize}/{currentPage}"})
    public Result getCommentsByTime(@PathVariable int itemId,
                                    @PathVariable int pageSize,
                                    @PathVariable int currentPage) {
        Result result = commentService.getCommentsByTime(itemId, pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的comments: {}", result);

        return result;
    }

    // 是否在这里需要添加一个查询子评论的handler:



    // 得到所有Comments (根据点赞数排序)
    @GetMapping("getCommentsByLikes/{itemId}/{pageSize}/{currentPage}")
    public Result getCommentsByLikes(@PathVariable int itemId,
                                     @PathVariable int pageSize,
                                     @PathVariable int currentPage) {
        Result result = commentService.getCommentsByLikes(itemId, pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到的comments: {}", result);

        return result;
    }

    // 新增：获取某个父评论的子评论
    @GetMapping("/replies/{parentCommentId}")
    public Result getRepliesByParentId(@PathVariable Integer parentCommentId) {
        List<Comment> replies = commentService.getRepliesByParentId(parentCommentId);

        log.info("查询到的子评论: {}", replies);

        return Result.ok(replies, ResultCodeEnum.SUCCESS);
    }

    /***
     * 添加一个评论
     * @param comment 评论信息
     *                前端要传入的内容: 该评论项的内容
     *
     * @param itemId  该评论所属的item
     *
     * @param session 用于获取用户的Id, 设置该评论是由谁创建的
     *
     * @return 评论的所有信息
     */
    @PostMapping("{itemId}")
    public Result addComment(@RequestBody Comment comment, @PathVariable Integer itemId,
                             HttpSession session) {
        // 获取当前用户
        User user = (User) session.getAttribute("user");

        System.out.println("==============调试==================");
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
     * @return 返回子评论的所有信息
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
     * @param commentId 评论的id (前端传过来)
     * @param session 用于该用户的id, 验证别的用户不能删除别人的评论
     * @return
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

package com.rateverse.controller;

import com.rateverse.bean.DraftItem;
import com.rateverse.bean.DraftTopic;
import com.rateverse.bean.User;
import com.rateverse.service.DraftItemService;
import com.rateverse.service.DraftTopicService;
import com.rateverse.utils.Result;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对草稿和评分项草稿的控制器
 *
 * 这个类需要注意草稿的归属权问题
 */
@RestController
@RequestMapping("/api/drafts")
@Slf4j
public class DraftController {
    @Autowired
    private DraftTopicService draftTopicService;

    @Autowired
    private DraftItemService draftItemService;

    /***
     * 给用户创建一个临时的草稿
     *
     * @param session 用于获取当前用户的userId, 给当前用户创建临时的Topic
     *
     * @return  一共有以下两种情况:
     *             1. 用户第一次创建Topic -> Result.ok(draftTopic, ResultCodeEnum.SUCCESS);
     *                把新创建好的Topic给他就好了
     *
     *             2. 用户之前创建过Topic -> Result.ok(oldDraftTopic, ResultCodeEnum.HAD_DRAFT);
     *                给前端报已经有草稿Topic了，是否要延续之前的草稿，还是创建一个新的?
     */
    @PostMapping()
    public Result createDraft(HttpSession session) {
        // 获取当前用户
        User user = (User) session.getAttribute("user");

        // 根据userid创建一个DraftTopic
        Result result = draftTopicService.createDraft(user.getId());

        System.out.println("===========log.info============");
        log.info("创建的主题草稿为: {}", result);

        return result;
    }


    /***
     * 这是跟上一个handler配合使用的, 如果用户选择了延续之前的草稿, 获取之前的草稿信息
     * 
     * @param draftId 之前的草稿TopicId
     * @param session 确认草稿归属权 (不能获取别人的草稿信息)
     *
     * @return 成功:
     *              * 一切顺利: 返回Draft信息，前端把所有信息显示在页面上
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权获取这个Draft
     */
    @GetMapping("/{draftId}")
    public Result getDraftDetail(@PathVariable Integer draftId, HttpSession session) {
        // 获取当前当前用户
        User user = (User) session.getAttribute("user");

        // 调用Service层
        Result result = draftTopicService.getDraftWithCheck(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("草稿的信息为: {}", result);

        return result;
    }

    /***
     * 两个作用:
     *      1. 实时更新当前添加了的Items
     *      2. 获取之前草稿Topic的Items
     *
     * @param draftId     当前草稿TopicId
     * @param pageSize    一页显示几个
     * @param currentPage 当前页数
     * @param session     确认草稿归属权 (不能获取别人的草稿Items信息)
     *
     * @return 成功:
     *              * 一切顺利, 返回
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权获取这个Draft
     */
    @GetMapping("/item/{draftId}/{pageSize}/{currentPage}")
    public Result getDraftItemsByPage(@PathVariable int draftId,
                                      @PathVariable int pageSize,
                                      @PathVariable int currentPage,
                                      HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftItemService.page(draftId, pageSize, currentPage, user.getId());

        System.out.println("===========log.info============");
        log.info("查询到该页的评分项为: {}", result);

        return result;
    }


    /***
     * 根据用户的填写内容，实时更新DraftTopic中的内容
     *
     * @param draftId       当前草稿的ID
     * @param newDraftTopic 新的草稿信息 (主题, 描述)
     * @param session       确认草稿归属权 (不能更改别人的草稿)
     *
     * @return 成功:
     *              * 一切顺利, 数据库方面更新成功
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权操作这个Draft
     */
    @PutMapping({"/{draftId}"})
    public Result updateDraftTopic(@PathVariable Integer draftId,
                                   @RequestBody DraftTopic newDraftTopic,
                                   HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftTopicService.updateDraftInfo(draftId, newDraftTopic.getTitle(), newDraftTopic.getDescription(), user.getId());

        System.out.println("===========log.info============");
        log.info("更改的主题草稿为: {}", result);

        return result;
    }


    /***
     * 给指定的draftId添加一个临时的评分项
     *
     * @param draftId 当前草稿的ID
     * @param item    评分项 (名字, 描述, 图片)
     * @param session 确认草稿归属权 (不能在别人的草稿中添加评分项)
     *
     * @return 成功:
     *              * 添加成功
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权操作这个Draft
     */
    @PostMapping("/item/{draftId}")
    public Result addDraftItem(@PathVariable Integer draftId,
                               @RequestBody DraftItem item,
                               HttpSession session) {
        User user = (User) session.getAttribute("user");

        Result result = draftItemService.addDraftItem(draftId, item, user.getId());

        System.out.println("===========log.info============");
        log.info("添加的评分项为: {}", result);

        return result;
    }


    /***
     * 删除指定的评分项
     *
     * @param draftItemId 评分项的id
     * @param session     确认草稿归属权 (不能删除别人的评分项)
     *
     * @return 成功:
     *              * 删除评分项成功
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权操作这个Draft
     */
    @DeleteMapping("/item/{draftItemId}")
    public Result deleteDraftItem(@PathVariable Integer draftItemId, HttpSession session) {
        User user = (User) session.getAttribute("user");

        Result result = draftItemService.deleteDraftItem(draftItemId, user.getId());

        System.out.println("===========log.info============");
        log.info("被删除的评分项为: {}", result);

        return result;
    }


    /***
     * 根据draftId, 删除草稿
     *
     * @param draftId 草稿ID
     * @param session 确认草稿归属权 (不能删除别人的草稿)
     *
     * @return 成功:
     *              * 删除草稿成功
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权操作这个Draft
     */
    @DeleteMapping("/{draftId}")
    public Result deleteAllDrafts(@PathVariable Integer draftId, HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftTopicService.deleteAllDrafts(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("删除的草稿主题为: {}", result);

        return result;
    }


    /***
     * 用户点击发布后，发布草稿
     *
     * @param draftId 草稿ID
     * @param session 确认草稿归属权 (不能发布别人的草稿)
     *
     * @return 成功:
     *              * 发布成功, 所有关于这个草稿的内容都会被删除
     *         失败:
     *              * NULL_DRAFT(601): 当前草稿主题不存在
     *              * DRAFT_PERMISSION_ERROR(603): 当前用户和当前草稿文件中的用户Id不匹配, 无权操作这个Draft
     *              * NO_ANY_ITEM(604): 没有任何评分项，不予提交
     */
    @PostMapping("/publish/{draftId}")
    public Result publishDraft(@PathVariable Integer draftId, HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftTopicService.publishDraft(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("添加的主题事件为: {}", result);

        return result;
    }

    // 更改Item信息
    @PutMapping("/item/{draftItemId}")
    public Result updateDraftItem(@PathVariable Integer draftItemId, @RequestBody DraftItem item, HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftItemService.updateDraftItem(draftItemId, item, user.getId());

        System.out.println("===========log.info============");
        log.info("更改Item信息成功: {}", result);

        return result;
    }
}

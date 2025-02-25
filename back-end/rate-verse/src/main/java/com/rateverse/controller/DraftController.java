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
 */
@RestController
@RequestMapping("/api/drafts")
@Slf4j
public class DraftController {
    @Autowired
    private DraftTopicService draftTopicService;

    @Autowired
    private DraftItemService draftItemService;

    // 根据userid创建一个临时的DraftTopic，并给前端DraftId (如果用户已经有草稿，则会返回原来的DraftId)
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


    // 获取草稿信息 (如果用户之前创建了，那将会访问原先的draft_id)
    @GetMapping("/{draftId}")
    public Result getDraftDetail(@PathVariable Integer draftId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        Result result = draftTopicService.getDraftWithCheck(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("草稿的信息为: {}", result);

        return result;
    }

    // 显示当前添加的评分项
    // 还可以用于显示用户之前的评分项草稿
    @GetMapping("/item/{draftId}/{pageSize}/{currentPage}")
    public Result getDraftItemsByPage(@PathVariable int draftId,
                                      @PathVariable int pageSize,
                                      @PathVariable int currentPage) {
        Result result = draftItemService.page(draftId, pageSize, currentPage);

        System.out.println("===========log.info============");
        log.info("查询到该页的评分项为: {}", result);

        return result;
    }


    // 根据用户的填写内容，实时更新DraftTopic中的内容
    @PutMapping({"/{draftId}"})
    public Result updateDraftTopic(@PathVariable Integer draftId,
                                   @RequestBody DraftTopic newDraftTopic) {
        Result result = draftTopicService.updateDraftInfo(draftId, newDraftTopic.getTitle(), newDraftTopic.getDescription());

        System.out.println("===========log.info============");
        log.info("更改的主题草稿为: {}", result);

        return result;
    }


    // 给指定的draftId添加一个临时的评分项
    @PostMapping("/item/{draftId}")
    public Result addDraftItem(@PathVariable Integer draftId,
                               @RequestBody DraftItem item) {
        Result result = draftItemService.addDraftItem(draftId, item);

        System.out.println("===========log.info============");
        log.info("添加的评分项为: {}", result);

        return result;
    }


    // 删除指定的item
    @DeleteMapping("/item/{draftItemId}")
    public Result deleteDraftItem(@PathVariable Integer draftItemId) {
        Result result = draftItemService.deleteDraftItem(draftItemId);

        System.out.println("===========log.info============");
        log.info("被删除的评分项为: {}", result);

        return result;
    }


    @DeleteMapping("/{draftId}")
    public Result deleteAllDrafts(@PathVariable Integer draftId, HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftTopicService.deleteAllDrafts(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("删除的草稿主题为: {}", result);

        return result;
    }


    // 用户点击发布后，发布草稿
    @PostMapping("/publish/{draftId}")
    public Result publishDraft(@PathVariable Integer draftId, HttpSession session) {
        // 获取userid
        User user = (User) session.getAttribute("user");

        Result result = draftTopicService.publishDraft(draftId, user.getId());

        System.out.println("===========log.info============");
        log.info("添加的主题事件为: {}", result);

        return result;
    }
}

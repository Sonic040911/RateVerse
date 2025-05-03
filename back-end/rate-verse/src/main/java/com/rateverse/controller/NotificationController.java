package com.rateverse.controller;

import com.rateverse.service.NotificationService;
import com.rateverse.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification")
@Slf4j
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/getByUser/{pageSize}/{page}")
    public Result getNotificationsByUser(@PathVariable int pageSize, @PathVariable int page, @RequestParam Integer userId) {
        Result result = notificationService.getNotificationsByUser(userId, pageSize, page);

        System.out.println("=================log.info==================");
        log.info("用户获取到的通知: {} ", result);

        return result;
    }

    @PostMapping("/markRead/{notificationId}")
    public Result markNotificationRead(@PathVariable Integer notificationId) {
        return notificationService.markNotificationRead(notificationId);
    }
}
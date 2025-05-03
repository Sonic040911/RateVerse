package com.rateverse.service;

import com.rateverse.bean.Notification;
import com.rateverse.utils.Result;
import org.springframework.stereotype.Service;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface NotificationService {
    void createNotification(Notification notification);
    Result getNotificationsByUser(Integer userId, int pageSize, int currentPage);
    Result markNotificationRead(Integer notificationId);
}

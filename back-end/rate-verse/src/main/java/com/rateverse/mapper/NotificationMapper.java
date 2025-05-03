package com.rateverse.mapper;

import com.rateverse.bean.Notification;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface NotificationMapper {
    void insertNotification(Notification notification);
    List<Notification> selectByUserId(@Param("userId") Integer userId);
    int countByUserId(Integer userId);
    void markRead(Integer id);
}

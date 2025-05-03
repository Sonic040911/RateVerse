package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Notification;
import com.rateverse.mapper.NotificationMapper;
import com.rateverse.service.NotificationService;
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
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationMapper notificationMapper;

    @Override
    public void createNotification(Notification notification) {
        notificationMapper.insertNotification(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public Result getNotificationsByUser(Integer userId, int pageSize, int currentPage) {
        PageHelper.startPage(currentPage, pageSize);

        List<Notification> notifications = notificationMapper.selectByUserId(userId);

        PageInfo<Notification> info = new PageInfo<>(notifications);

        PageBean<Notification> pageBean = new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result markNotificationRead(Integer notificationId) {
        notificationMapper.markRead(notificationId);
        return Result.ok(null, ResultCodeEnum.SUCCESS);
    }
}

package com.rateverse.bean;

import lombok.Data;

import java.util.Date;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 用户实体类
 */

@Data
public class User {
    private Integer id;

    private String username;
    private String email;
    private String passwordHash;
    private String avatarUrl;
    private String phone;
    private String address;

    // 前端不用发送这些
    private Date createdAt;
    private Date updatedAt;
}

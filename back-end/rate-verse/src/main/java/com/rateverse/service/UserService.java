package com.rateverse.service;

import com.rateverse.bean.User;
import com.rateverse.utils.Result;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
public interface UserService {
    // 检测用户名是否已占用，如果失败，返回状态码
    Result checkUserName(String username);

    // 检测邮箱是否已占用，如果失败，返回状态码
    Result checkUserEmail(String email);

    // 注册用户
    Result registerUser(User user);

    // 登录用户
    Result login(String usernameOrEmail, String password);

    // 持久化JSESSIONID
    void rememberSessionId(HttpServletResponse response, String sessionId);

    // 搜索用户
    Result searchUsers(String keyword);

    // 更改自己用户的内容
    Result updateUser(User user);
}

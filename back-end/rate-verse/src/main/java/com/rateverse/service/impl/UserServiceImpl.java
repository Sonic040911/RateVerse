package com.rateverse.service.impl;

import com.rateverse.bean.User;
import com.rateverse.mapper.UserMapper;
import com.rateverse.service.UserService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 检测用户名是否已占用
    @Override
    public Result checkUserName(String username) {
        // 是否被占用 如果没有返回0 有返回1
        boolean isExists = userMapper.existsByUsername(username);

        if (isExists) {
            return Result.fail(username, ResultCodeEnum.USERNAME_USED);
        }

        return Result.ok(username, ResultCodeEnum.SUCCESS);
    }

    // 检测邮箱是否符合规范
    @Override
    public Result checkUserEmail(String email) {
        // 是否被占用 如果没有返回0 有返回1
        boolean isExists = userMapper.existsByEmail(email);
        if (isExists) {
            return Result.fail(email, ResultCodeEnum.EMAIL_USED);
        }

        return Result.ok(email, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result registerUser(User user) {
        System.out.println(user.getPasswordHash());
        // 加密
        String encodedPwd = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(encodedPwd);

        // 存入
        int rows = userMapper.insertUser(user);
        // 隐藏密码
        user.setPasswordHash(null);

        // 如果加入失败，返回数据库错误
        if (rows <= 0) {
            return Result.fail(user, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(user, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result checkUserInfo(String userNameOrEmail, String password) {
        // 1. 先查询看一下，这个用户是否存在
        User user = userMapper.selectUserByUsernameOrEmail(userNameOrEmail);

        // 2. 如果不存在，返回错误信息
        if (user == null) {
            System.out.println("用户不存在");
            return Result.fail(null, ResultCodeEnum.NOT_LOGIN);
        }

        // 3. 校验密码
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            System.out.println("密码错误");
            return Result.fail(null, ResultCodeEnum.NOT_LOGIN);
        }

        // 登录成功, 并且把user放进去
        return Result.ok(user, ResultCodeEnum.SUCCESS);
    }

    /*
    * 持久化JSESSIONID
    * */
    @Override
    public void rememberSessionId(HttpServletResponse response, String sessionId) {
        // 创建 JSESSIONID Cookie，并设置有效期 7 天
        Cookie sessionCookie = new Cookie("JSESSIONID", sessionId);
        sessionCookie.setMaxAge(7 * 24 * 60 * 60); // 7 天
        sessionCookie.setPath("/"); // 作用于整个网站
        response.addCookie(sessionCookie);
    }
}

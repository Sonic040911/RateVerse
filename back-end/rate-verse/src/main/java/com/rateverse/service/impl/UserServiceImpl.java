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

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 用户的业务层
 */

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 注册用户
    @Override
    public Result registerUser(User user) {
        // 验证用户名是否被占用
        Result result = checkUserName(user.getUsername());
        if (!result.isFlag()) {
            return result;
        }

        // 验证邮箱是否被占用
        result = checkUserEmail(user.getEmail());
        if (!result.isFlag()) {
            return result;
        }

        // 加密密码
        String encodedPwd = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(encodedPwd);

        // 数据库存入用户
        int rows = userMapper.insertUser(user);

        // 隐藏密码
        user.setPasswordHash(null);

        // 如果加入失败，返回数据库错误
        if (rows <= 0) {
            return Result.fail(user, ResultCodeEnum.DATABASE_ERROR);
        }

        return Result.ok(user, ResultCodeEnum.SUCCESS);
    }

    // 登录
    @Override
    public Result login(String userNameOrEmail, String password) {
        // 1. 先查询看一下，这个用户是否存在
        User user = userMapper.selectUserByUsernameOrEmail(userNameOrEmail);

        // 2. 如果不存在，返回错误信息
        if (user == null) {
            return Result.fail(null, ResultCodeEnum.USER_NOT_FOUND);
        }

        // 3. 校验密码
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return Result.fail(null, ResultCodeEnum.PASSWORD_ERROR);
        }

        // 登录成功, 返回用户
        return Result.ok(user, ResultCodeEnum.SUCCESS);
    }

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

    @Override
    public Result searchUsers(String keyword) {
        List<User> users = userMapper.searchUsers(
                "%" + keyword + "%" // 添加通配符实现模糊搜索
        );

        // 过滤敏感字段
        users.forEach(user -> {
            user.setPasswordHash(null);
            user.setEmail(null); // 根据需求决定是否返回邮箱
        });

        return Result.ok(users, ResultCodeEnum.SUCCESS);
    }

    // 更改用户信息 (名字, 头像, 邮箱等，都可以)
    @Override
    public Result updateUser(User user) {
        int rows = userMapper.updateUser(user);
        if (rows > 0) {
            return Result.ok(null, ResultCodeEnum.SUCCESS);
        } else {
            return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
        }
    }

    // 通过邮箱查找用户
    @Override
    public User findByEmail(String email) {
        return userMapper.selectUserByEmail(email);
    }

    // 插入用户
    @Override
    public int save(User user) {
        if (user == null) {
            return 0;
        }
        if (user.getId() == null) {
            // 新用户，执行插入
            return userMapper.insertUser(user);
        } else {
            // 现有用户，执行更新
            return userMapper.updateUser(user);
        }
    }

    @Override
    public int updateGoogleId(User user) {
        if (user == null || user.getId() == null) {
            return 0;
        }
        return userMapper.updateGoogleId(user);
    }


    public User findByGoogleId(String googleId) {
        return userMapper.selectUserByGoogleId(googleId);
    }
}

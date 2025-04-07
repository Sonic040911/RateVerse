package com.rateverse.controller;

import com.rateverse.bean.User;
import com.rateverse.service.UserService;
import com.rateverse.utils.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 用户的控制层
 */

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;

    /***
     * 注册用户
     *
     * @param user User对象: username, email, passwordHash
     *
     * @return 成功:
     *              * 没有任何问题: 返回用户信息, 让前端跳转到 Login.html 再进行一次登录
     *         失败:
     *              * 用户名已占用: USERNAME_USED(502)   让前端显示对应的错误信息
     *              * 邮箱已占用:   EMAIL_USED(503)      让前端显示对应的错误信息
     *              * 数据库错误:   DATABASE_ERROR(1001) 让前端显示对应的错误信息
     */
    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        // 注册用户
        Result result = userService.registerUser(user);

        System.out.println("===========log.info============");
        log.info("注册的用户信息:{}", result);

        return result;
    }


    /***
     * 登录用户
     *
     * @param user User对象: email, passwordHash
     *
     * @param req  用于获取此次会话(Session), 把用户的信息存入到Cookie
     * @param resp 返回Cookie, 让浏览器记住这些内容
     *
     * @return 成功:
     *              * 一切顺利: 1. 设置JSessionID, 返回Cookie让浏览器记住, 这就是以后用户的唯一标识符
     *                         2. 跳转到Home主页
     *         失败:
     *              * 用户名不存在: USER_NOT_FOUND(506) 让前端显示对应的错误信息
     *              * 密码错误:     PASSWORD_ERROR(504) 让前端显示对应的错误信息
     */
    @PostMapping("/login")
    public Result login(@RequestBody User user,
                      HttpServletRequest req,
                      HttpServletResponse resp) {
        // 传入用户邮箱和密码进行登录
        Result result = userService.login(user.getEmail(), user.getPasswordHash());

        System.out.println("===========log.info============");
        log.info("登录的用户信息: {}", result);

        // 成功则设置用户会话，重定向到首页；失败则返回登录页并提示错误。
        if (result.getCode() == 200) {
            // 1. 把用户信息存入Session
            HttpSession session = req.getSession();
            session.setMaxInactiveInterval(7 * 24 * 60 * 60); // 7 天
            session.setAttribute("user", result.getData());

            // 让 JSESSIONID Cookie 持久化这个id
            userService.rememberSessionId(resp, session.getId());
        }

        return result;
    }


    // 检测用户名是否被占用
    @GetMapping("/checkUserNameUsed/{username}")
    public Result checkUserNameUsed(@PathVariable String username) {
        Result result = userService.checkUserName(username);

        System.out.println("===========log.info============");
        log.info("检测的用户名为: {}", result);

        return result;
    }

    // 检测邮箱是否被占用
    @GetMapping("/checkUserEmailUsed/{email}")
    public Result checkUserEmailUsed(@PathVariable String email) {
        Result result = userService.checkUserEmail(email);

        System.out.println("===========log.info============");
        log.info("检测的用户邮箱为: {}", result);

        return result;
    }

    // 搜索用户
    @GetMapping("/search")
    public Result searchUsers(@RequestParam String keyword) {

        Result result = userService.searchUsers(keyword.trim());

        log.info("用户搜索 - 关键词: {} | 返回数量: {}", keyword,
                result.isFlag() ? ((List<?>) result.getData()).size() : 0);

        return result;
    }
}
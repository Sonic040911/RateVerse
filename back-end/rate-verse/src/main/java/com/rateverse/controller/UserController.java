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

    // 检测用户名的格式正确和是否被占用问题
    @GetMapping("/checkUserName/{username}")
    public Result checkUserName(@PathVariable String username) {
        Result result = userService.checkUserName(username);

        System.out.println("=======================");
        log.info("检测的用户名为: {}", result);

        return result;
    }

    // 检测邮箱的格式正确与否和占用问题
    @GetMapping("/checkUserEmail/{email}")
    public Result checkUserEmail(@PathVariable String email) {
        Result result = userService.checkUserEmail(email);

        System.out.println("=======================");
        log.info("检测的用户邮箱为: {}", result);

        return result;
    }


    // 走register和login之前，必须所有都成功
    @PostMapping("/register")
    public void register(@RequestBody User user, HttpServletResponse resp) {
        // 注册用户
        Result result = userService.registerUser(user);

        System.out.println("=======================");
        log.info("注册的用户信息:{}", result);

        // 成功则重定向到登录页，失败则返回注册页并提示错误。
        if (result.getCode() == 200) {
            System.out.println("成功");
        } else{
            System.out.println("失败");
        }
    }


    @PostMapping("/login/{usernameOrEmail}/{password}")
    public void login(@PathVariable String usernameOrEmail, @PathVariable String password,
                      HttpServletRequest req,
                      HttpServletResponse resp) {
        Result result = userService.login(usernameOrEmail, password);

        System.out.println("=======================");
        log.info("登录的用户信息: {}", result);

        // 成功则设置用户会话，重定向到首页；失败则返回登录页并提示错误。
        if (result.getCode() == 200) {
            // 1. 把用户信息存入Session
            HttpSession session = req.getSession();
            session.setMaxInactiveInterval(7 * 24 * 60 * 60); // 7 天
            System.out.println(result.getData());
            session.setAttribute("user", result.getData());

            // 让 JSESSIONID Cookie 持久化这个id
            userService.rememberSessionId(resp, session.getId());

            // 重定向到主页
            System.out.println("成功");
        } else {
            // 返回主页
            System.out.println("失败");
        }
    }
}
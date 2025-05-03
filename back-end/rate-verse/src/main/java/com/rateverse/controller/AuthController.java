package com.rateverse.controller;

import com.rateverse.bean.User;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/currentUser")
    public Result getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.fail(null, ResultCodeEnum.LOGIN_ERROR);
        }
        return Result.ok(user.getId(), ResultCodeEnum.SUCCESS);
    }
}
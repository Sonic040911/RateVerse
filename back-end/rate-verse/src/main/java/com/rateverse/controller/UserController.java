package com.rateverse.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.rateverse.bean.User;
import com.rateverse.service.UserService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

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

    /**
     * Logout a user
     */
    @PostMapping("/logout")
    public Result logout(HttpServletRequest req, HttpServletResponse resp) {
        HttpSession session = req.getSession(false); // Don't create new session
        if (session != null && session.getAttribute("user") != null) {
            log.info("User logging out, invalidating session: {}", session.getId());
            session.invalidate();

            // Clear JSESSIONID cookie
            Cookie sessionCookie = new Cookie("JSESSIONID", "");
            sessionCookie.setMaxAge(0); // Expire immediately
            sessionCookie.setPath("/");
            resp.addCookie(sessionCookie);
            return Result.ok(null, ResultCodeEnum.SUCCESS);
        } else {
            log.warn("No active session or user not logged in");
            return Result.fail(null, ResultCodeEnum.USER_NOT_FOUND);
        }
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


    // 获取当前用户信息（名字、头像、邮箱、电话、地址等）
    @GetMapping("/api/profile")
    public Result getUserProfile(HttpSession session) {
        User user = (User) session.getAttribute("user");

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("avatarUrl", user.getAvatarUrl());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        profile.put("address", user.getAddress());
        profile.put("isGoogleUser", user.getGoogleId() != null); // 添加 Google 用户标志

        System.out.println("===========log.info============");
        log.info("用户的个人信息为: {}", profile);

        return Result.ok(profile, ResultCodeEnum.SUCCESS);
    }

    // 更改自己的用户名
    @PostMapping("/api/update-username")
    public Result updateUsername(@RequestParam String newUsername, HttpSession session) {
        User user = (User) session.getAttribute("user");
        String oldName = user.getUsername();

        // 检查用户名是否为空
        if (newUsername == null || newUsername.trim().isEmpty()) {
            return Result.fail(null, ResultCodeEnum.USERNAME_EMPTY);
        }

        newUsername = newUsername.trim();

        // 检查用户名是否被占用
        Result checkResult = userService.checkUserName(newUsername);
        if (!checkResult.isFlag()) {
            return checkResult; // Returns USERNAME_USED(502)
        }

        user.setUsername(newUsername.trim());
        Result result = userService.updateUser(user);
        if (result.isFlag()) {
            // 更新 session 中的用户信息
            session.setAttribute("user", user);
        }

        System.out.println("===========log.info============");
        log.info("用户的名字成功从: {} 更改为: {}", oldName, newUsername);

        return result;
    }

    // 更改用户头像
    @PostMapping("/api/update-avatar")
    public Result updateAvatar(@RequestParam String avatarUrl, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (avatarUrl == null || avatarUrl.trim().isEmpty()) {
            return Result.fail(null, ResultCodeEnum.AVATAR_URL_EMPTY);
        }

        user.setAvatarUrl(avatarUrl.trim());
        Result result = userService.updateUser(user);
        if (result.isFlag()) {
            session.setAttribute("user", user);
        }

        System.out.println("===========log.info============");
        log.info("用户的头像更改成功: {}", avatarUrl);

        return result;
    }

    // 更新用户信息（邮箱、电话、地址）
    @PostMapping("/api/update-profile")
    public Result updateProfile(
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            HttpSession session) {
        User user = (User) session.getAttribute("user");

        email = email.trim();

        // 阻止 Google 用户修改邮箱
        if (user.getGoogleId() != null && !email.equals(user.getEmail())) {
            return Result.fail(null, ResultCodeEnum.GOOGLE_EMAIL_CHANGE_NOT_ALLOWED);
        }

        // Check if email is already used
        if (!email.equals(user.getEmail())) { // Only check if email is changed
            Result checkResult = userService.checkUserEmail(email);
            if (!checkResult.isFlag()) {
                return checkResult; // Returns EMAIL_USED(503)
            }
        }

        user.setEmail(email.trim());
        user.setPhone(phone.trim());
        user.setAddress(address.trim());

        Result result = userService.updateUser(user);
        if (result.isFlag()) {
            // 更新 session 中的用户信息
            session.setAttribute("user", user);
        }

        System.out.println("===========log.info============");
        log.info("用户的信息更改成功: {}", result);

        return result;
    }

//    // 绑定 Google 账户
//    @PostMapping("/api/link-google")
//    public Result linkGoogle(@RequestBody Map<String, String> request, HttpSession session) {
//        try {
//            User user = (User) session.getAttribute("user");
//            if (user == null) {
//                log.warn("Link Google failed: No user in session");
//                return Result.fail(null, ResultCodeEnum.USER_NOT_FOUND);
//            }
//
//            String idToken = request.get("idToken");
//            if (idToken == null || idToken.isEmpty()) {
//                log.warn("Link Google failed: Missing idToken");
//                return Result.fail(null, ResultCodeEnum.INVALID_TOKEN);
//            }
//
//            // 验证 Google ID Token
//            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
//                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
//                    .build();
//
//            GoogleIdToken googleIdToken = verifier.verify(idToken);
//            if (googleIdToken == null) {
//                log.warn("Invalid Google ID token");
//                return Result.fail(null, ResultCodeEnum.INVALID_TOKEN);
//            }
//
//            GoogleIdToken.Payload payload = googleIdToken.getPayload();
//            String googleId = payload.getSubject();
//            String googleEmail = payload.getEmail();
//
//            // 检查是否已绑定 Google 账户
//            if (user.getGoogleId() != null) {
//                log.info("User {} already linked to Google account {}", user.getId(), user.getGoogleId());
//                return Result.fail(null, ResultCodeEnum.GOOGLE_ID_CONFLICT);
//            }
//
//            // 检查 Google 邮箱是否被其他用户占用
//            User existingUser = userService.findByEmail(googleEmail);
//            if (existingUser != null && existingUser.getId() != user.getId()) {
//                log.warn("Google email {} is already used by another user {}", googleEmail, existingUser.getId());
//                return Result.fail(null, ResultCodeEnum.EMAIL_USED);
//            }
//
//            // 检查 Google ID 是否被其他用户绑定
//            User googleUser = userService.findByGoogleId(googleId);
//            if (googleUser != null && googleUser.getId() != user.getId()) {
//                log.warn("Google ID {} is already linked to another user {}", googleId, googleUser.getId());
//                return Result.fail(null, ResultCodeEnum.GOOGLE_ID_CONFLICT);
//            }
//
//            // 更新用户的 google_id 和 email
//            user.setGoogleId(googleId);
//            user.setEmail(googleEmail);
//            Result updateResult = userService.updateUser(user);
//            if (!updateResult.isFlag()) {
//                log.error("Failed to update user {} with Google ID {} and email {}", user.getId(), googleId, googleEmail);
//                return Result.fail(null, ResultCodeEnum.DATABASE_ERROR);
//            }
//
//            // 更新 session
//            session.setAttribute("user", user);
//            log.info("User {} linked Google account {} with email {}", user.getId(), googleId, googleEmail);
//
//            return Result.ok(null, ResultCodeEnum.SUCCESS);
//        } catch (Exception e) {
//            log.error("Error linking Google account: {}", e.getMessage(), e);
//            return Result.fail(null, ResultCodeEnum.SERVER_ERROR);
//        }
//    }
}
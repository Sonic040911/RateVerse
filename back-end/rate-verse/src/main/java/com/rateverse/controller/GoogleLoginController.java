package com.rateverse.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.rateverse.bean.User;
import com.rateverse.service.UserService;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.Map;

@RestController
@Slf4j
public class GoogleLoginController {

    private static final String CLIENT_ID = "343104139057-ve41fnjl41i90ckbvjfsfmh61guvqk05.apps.googleusercontent.com"; // 替换为你的 Google Client ID

    @Autowired
    private UserService userService;

    @PostMapping("/user/google-login")
    public ResponseEntity<Result> googleLogin(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            String idToken = request.get("idToken");
            log.info("Received Google login request with idToken: {}", idToken != null ? "present" : "null");

            // 验证 Google ID Token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                log.warn("Invalid Google ID token");
                return ResponseEntity.badRequest().body(Result.fail(null, ResultCodeEnum.INVALID_TOKEN));
            }

            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            String email = payload.getEmail();
            String googleId = payload.getSubject();
            String name = (String) payload.get("name");
            log.info("Google ID token verified. Email: {}, Google ID: {}, Name: {}", email, googleId, name);

            // 检查用户是否存在
            User user = userService.findByEmail(email);
            if (user == null) {
                // 创建新用户
                user = new User();
                user.setEmail(email);
                user.setUsername(name != null ? name : "GoogleUser_" + googleId.substring(0, 8));
                user.setGoogleId(googleId);
                int result = userService.save(user);
                if (result == 0) {
                    log.error("Failed to create new user with email: {}", email);
                    return ResponseEntity.status(500).body(Result.fail(null, ResultCodeEnum.DATABASE_ERROR));
                }
                log.info("Created new user with email: {}", email);
            } else {
                // 用户存在，检查是否已关联 Google 账户
                if (user.getGoogleId() == null) {
                    // 邮箱已注册但未关联 Google，更新 google_id
                    user.setGoogleId(googleId);
                    int result = userService.updateGoogleId(user);
                    if (result == 0) {
                        log.error("Failed to update google_id for existing user with email: {}", email);
                        return ResponseEntity.status(500).body(Result.fail(null, ResultCodeEnum.DATABASE_ERROR));
                    }
                    log.info("Linked Google ID {} to existing user with email: {}", googleId, email);
                } else if (!user.getGoogleId().equals(googleId)) {
                    // 邮箱已关联其他 Google 账户，返回错误
                    log.warn("Email {} is already linked to another Google account", email);
                    return ResponseEntity.badRequest().body(Result.fail(null, ResultCodeEnum.GOOGLE_ID_CONFLICT));
                }
                // 如果 google_id 已匹配，无需更新
            }

            // 存储用户到 session
            session.setAttribute("user", user);
            session.setMaxInactiveInterval(7 * 24 * 60 * 60); // 7 天
            log.info("User {} logged in via Google, session ID: {}", email, session.getId());

            return ResponseEntity.ok(Result.ok(null, ResultCodeEnum.SUCCESS));

        } catch (Exception e) {
            log.error("Google login failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Result.fail(null, ResultCodeEnum.SERVER_ERROR));
        }
    }
}
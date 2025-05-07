package com.rateverse.filter;

import com.rateverse.bean.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对核心模块的拦截器
 */
public class ApiInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(ApiInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null) {
            log.info("====================未登录!!!=======================");
            String requestUri = request.getRequestURI();

            if (requestUri.contains("/api/")) {
                // API 请求，返回 JSON 错误
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write("{\"code\":401,\"message\":\"Please login first\"}");
            } else {
                // 页面请求，重定向到 Login.html
                response.sendRedirect(request.getContextPath() + "/Login.html");
            }
            return false;
        }

        return true;
    }
}
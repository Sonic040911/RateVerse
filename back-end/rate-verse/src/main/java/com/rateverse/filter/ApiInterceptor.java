package com.rateverse.filter;

import com.rateverse.bean.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;


/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对核心模块的拦截器
 */
public class ApiInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                              Object handler) throws Exception {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 未授权
            System.out.println("====================未登录!!!=======================");
            response.getWriter().write("please login first");
            return false;
        }

        return true;
    }
}

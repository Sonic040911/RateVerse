package com.rateverse.config;

import com.rateverse.filter.ApiInterceptor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 控制层的配置类
 * 可以添加以下配置：
 *      1. 所有controller
 *      2. 全局异常处理
 *      3. handlerMapping handlerAdapter
 *      4. json 转换器
 *      5. 拦截器
 *      6. 静态资源处理
 *      7. 如果有jsp，视图解析器的前后缀
 */

@Configuration
@ComponentScan({"com.rateverse.controller"})
@EnableWebMvc
public class WebMvcJavaConfig implements WebMvcConfigurer {
    //开启静态资源
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    // 拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ApiInterceptor()).addPathPatterns("/api/**");
    }
}

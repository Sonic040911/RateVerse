package com.rateverse.config;

import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: SpringMvc的配置类
 */
public class SpringMvcInit extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[] {DataSourceConfig.class,
                ServiceJavaConfig.class,
                MapperJavaConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] {WebMvcJavaConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/"};
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        // 配置文件上传支持
        MultipartConfigElement multipartConfig = new MultipartConfigElement(
                null, // 临时文件存储路径（null 表示使用默认路径）
                10485760, // 最大文件大小：10MB
                10485760, // 最大请求大小：10MB
                0 // 文件大小阈值，超过此大小会写入临时文件（0 表示立即写入）
        );
        registration.setMultipartConfig(multipartConfig);
    }
}

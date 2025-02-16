package com.rateverse.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 连接池的配置
 */

@Configuration
public class DataSourceConfig {
    // 配置数据库连接池
    @Bean
    public DataSource dataSource() {
        String url = "jdbc:mysql://localhost:3306/rateverse";
        String testUrl = "jdbc:mysql://localhost:3306/rateverse_test";

        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("1989");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        dataSource.setUrl(testUrl);

        return dataSource;
    }
}

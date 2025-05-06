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
        String localUrl = "jdbc:mysql://localhost:3306/rateverse";
        String localName = "root";
        String localPassword = "1989";

        String url = "jdbc:mysql://localhost:3306/rate_verse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String name = "sonic";
        String password = "maozedong1989";

        DruidDataSource dataSource = new DruidDataSource();

        dataSource.setUsername(name);
        dataSource.setPassword(password);
        dataSource.setUrl(url);

        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        return dataSource;
    }
}

package com.rateverse.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 连接池的配置
 */

@Configuration
public class DataSourceConfig {
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    // 配置数据库连接池
    @Bean
    public DataSource dataSource() {
        logger.info("Initializing DruidDataSource");
        String url = "jdbc:mysql://localhost:3306/rate_verse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";

        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("sonic");
        dataSource.setPassword("maozedong1989");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl(url);

        return dataSource;
    }
}

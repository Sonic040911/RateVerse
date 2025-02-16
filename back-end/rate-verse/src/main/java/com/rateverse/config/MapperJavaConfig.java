package com.rateverse.config;

import com.github.pagehelper.PageInterceptor;
import org.apache.ibatis.logging.slf4j.Slf4jImpl;
import org.apache.ibatis.session.AutoMappingBehavior;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Properties;


/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 数据库配置类
 */

@Configuration(proxyBeanMethods = false)
public class MapperJavaConfig {
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();

        // 指定数据库连接池对象
        sqlSessionFactoryBean.setDataSource(dataSource);

        // 指定mybatis配置文件的功能，使用代码的形式
        org.apache.ibatis.session.Configuration configuration =
                new org.apache.ibatis.session.Configuration();

        // 配置settings
        configuration.setMapUnderscoreToCamelCase(true);
        configuration.setLogImpl(Slf4jImpl.class);
        configuration.setAutoMappingBehavior(AutoMappingBehavior.FULL);
        sqlSessionFactoryBean.setConfiguration(configuration);

        // 配置别名
        sqlSessionFactoryBean.setTypeAliasesPackage("com.rateverse.bean");

        //分页插件配置
        PageInterceptor pageInterceptor = new PageInterceptor();

        Properties properties = new Properties();
        properties.setProperty("helperDialect","mysql");
        pageInterceptor.setProperties(properties);
        sqlSessionFactoryBean.addPlugins(pageInterceptor);

        return sqlSessionFactoryBean;
    }


    /*
     * mapper代理对象加入到ioc
     *   自动扫描 Mapper 接口并将其注册到 Spring 容器中，这样就不需要手动为每个 Mapper 创建 @Bean
     *   而且未来可以直接从IoC容器里面取
     * */
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer() {
        // 配置mapper扫描器
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();

        // 扫描这个包里所有的Mapper，mapper接口和mapper.xml所在的包
        mapperScannerConfigurer.setBasePackage("com.rateverse.mapper");
        return mapperScannerConfigurer;
    }
}

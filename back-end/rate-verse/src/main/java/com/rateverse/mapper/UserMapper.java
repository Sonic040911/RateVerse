package com.rateverse.mapper;

import com.rateverse.bean.User;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 用户类sql语句
 */
public interface UserMapper {
    // 插入一个用户 (密码必须是存加密的！！！)
    int insertUser(User user);

    // 根据id查询用户
    User selectUserById(int id);

    // 根据用户名搜索一个用户
    User selectUserByUsername(String username);

    // 根据邮箱查询用户
    User selectUserByEmail(String email);

    // 根据用户名或者邮箱查询用户 (用于登录验证)
    User selectUserByUsernameOrEmail(String usernameOrEmail);

    // 更新用户信息 (通用，非常牛逼，想更新哪个字段，都可以) (让前端请求的时候传一个用户对象)
    int updateUser(User user);

    // 根据id删除用户
    int deleteUserById(int id);

    // 检查用户名是否存在 (select语句)
    boolean existsByUsername(String name);

    // 检查邮箱是否存在
    boolean existsByEmail(String email);

    // 分页查询 (参考老师写的分页查询)
    List<User> selectUsersByPage();

    // 更新用户头像
    int updateUserAvatar(int id, String avatarUrl);
}

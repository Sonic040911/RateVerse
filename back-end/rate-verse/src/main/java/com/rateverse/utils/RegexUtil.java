package com.rateverse.utils;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对正则表达式进行校验
 */
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 正则表达式工具类
 */
public class RegexUtil {

    /**
     * 通用正则校验方法
     *
     * @param input 待校验的字符串
     * @param regex 正则表达式
     * @return 是否匹配
     */
    private static boolean match(String input, String regex) {
        if (input == null || regex == null) {
            return false;
        }
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);
        return matcher.matches();
    }

    /**
     * 校验用户名格式
     * 规则：4-16 位字母、数字、下划线，不能以下划线开头或结尾
     */
    public static boolean isUsernameValid(String username) {
        String regex = "^(?!_)(?!.*_$)[a-zA-Z0-9_]{4,16}$";
        return match(username, regex);
    }

    /**
     * 校验邮箱格式
     * 规则：符合 RFC 5322 标准的邮箱格式
     */
    public static boolean isEmailValid(String email) {
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return match(email, regex);
    }

    /**
     * 校验密码格式
     * 规则：8-20 位，至少包含字母和数字
     */
    public static boolean isPasswordValid(String password) {
        String regex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,20}$";
        return match(password, regex);
    }
}

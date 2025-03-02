package com.rateverse.utils;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对结果类的状态码和失败信息的封装
 */
public enum ResultCodeEnum {
    // 注意这里的code不是响应状态码，而是业务状态码，这个码是前后端约定好的
    SUCCESS(200, "success"),
    USERNAME_FORMAT_ERROR(501, "username format is invalid"),
    USERNAME_USED(502, "username used"),
    EMAIL_USED(503, "email used"),
    EMAIL_FORMAT_ERROR(504, "email format is invalid"),
    PASSWORD_ERROR(504, "password error"),
    NOT_LOGIN(505, "not login"),

    NULL_DRAFT(601, "Draft does not exist"),
    HAD_DRAFT(602, "User already had a draft"),
    DRAFT_PERMISSION_ERROR(603, "no permission to publish others' drafts"),
    NO_ANY_ITEM(604, "at least one rating item is required"),

    TOPIC_DOES_NOT_EXISTS(701, "rating topic does not exist"),
    ITEM_DOES_NOT_EXISTS(702, "rating item does not exist"),


    RATING_EXISTS(801, "user had already rated this item"),
    RATING_SCORE_ERROR(802, "please rate your score to 1 - 5 star"),

    DATABASE_ERROR(1001, "database change failed")
    ;

    private final Integer code;
    private final String message;

    // 默认private
    ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

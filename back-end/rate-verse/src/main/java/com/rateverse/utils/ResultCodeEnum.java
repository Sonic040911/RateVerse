package com.rateverse.utils;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description: 对结果类的状态码和失败信息的封装
 */
public enum ResultCodeEnum {
    // 成功
    SUCCESS(200, "success"),

    // 用户相关状态码
    USERNAME_FORMAT_ERROR(501, "username format is invalid"),
    USERNAME_USED(502, "username used"),
    EMAIL_USED(503, "email used"),
    PASSWORD_ERROR(504, "password error"),
    LOGIN_ERROR(505, "login error"),
    USER_NOT_FOUND(506, "user does not exist"),


    // 创建Rating Event状态码
    NULL_DRAFT(601, "draft does not exist"),
    HAD_DRAFT(602, "user already had a draft"),
    DRAFT_PERMISSION_ERROR(603, "no permission to operate others' drafts"),
    NO_ANY_ITEM(604, "at least one rating item is required"),
    INVALID_INPUT_TOPIC_TITLE(605, "Topic title exceeds 50 characters"),
    INVALID_INPUT_TOPIC_DES(606, "Topic description exceeds 200 characters"),
    INVALID_INPUT_ITEM_TITLE(607, "Object title exceeds 50 characters"),
    INVALID_INPUT_ITEM_DES(608, "Object description exceeds 200 characters"),


    // Rating Event状态码
    TOPIC_DOES_NOT_EXISTS(701, "rating topic does not exist"),
    ITEM_DOES_NOT_EXISTS(702, "rating item does not exist"),
    SEARCH_KEYWORD_EMPTY(703, "search keyword cannot be empty"),


    // 评分状态码
    RATING_SCORE_ERROR(802, "please rate your score to 1 - 5 star"),


    // 评论状态码
    PARENT_COMMENT_NOT_FOUND(901, "parent comment not exists"),
    COMMENT_ITEM_MISMATCH(902, "the two comments belong to different items"),
    COMMENT_NOT_FOUND(903, "comment not exists"),


    // 超级状态码
    DATABASE_ERROR(1001, "database change failed"),
    PERMISSION_DENIED(1002, "permission denied"),
    FILE_EMPTY(1003, "file empty"),
    UPLOAD_ERROR(1004, "upload error"),
    USERNAME_EMPTY(1005, "username is empty!"),

    AVATAR_URL_EMPTY(1006, "avatar url is empty"),
    GOOGLE_EMAIL_CHANGE_NOT_ALLOWED(1007, "google email change not allowed"),
    SERVER_ERROR(1008, "server error"),
    GOOGLE_ID_CONFLICT(1009, "google id conflict"),
    INVALID_TOKEN(1010, "invalid token")
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

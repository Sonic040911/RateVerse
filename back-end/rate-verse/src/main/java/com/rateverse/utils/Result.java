package com.rateverse.utils;

import lombok.Getter;
import lombok.Setter;

/**
 * Project Name: ssm-integration
 *
 * @author: Sonic
 * @description: 返回结果类
 */
@Getter
@Setter
public class Result {
    private int code; //200成功状态码
    private boolean flag = true; //返回状态
    private String message; // 返回信息
    private Object data;  // 返回json

    public static Result ok(Object data, ResultCodeEnum resultCodeEnum){
        Result result = new Result();
        result.setCode(resultCodeEnum.getCode());
        result.setMessage(resultCodeEnum.getMessage());
        result.setData(data);

        return result;
    }

    public static Result fail(Object data, ResultCodeEnum resultCodeEnum){
        Result result = new Result();
        result.setCode(resultCodeEnum.getCode());
        result.setMessage(resultCodeEnum.getMessage());
        result.setFlag(false);
        result.setData(data);

        return result;
    }

    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", flag=" + flag +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}

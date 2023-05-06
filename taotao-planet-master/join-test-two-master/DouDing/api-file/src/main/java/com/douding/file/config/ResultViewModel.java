package com.douding.file.config;


import com.douding.server.dto.FileDto;

/**
 * @ClassName ResultViewModel
 * @Description: TODO
 * @Author:
 */

public class ResultViewModel {
    private FileDto fileDto;
    private String msg;
    private int code;
    private String url;

    public static ResultViewModel success() {
        ResultViewModel result = new ResultViewModel();
        return result;
    }
    public static ResultViewModel success(int code, String msg) {
        ResultViewModel result = new ResultViewModel();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}

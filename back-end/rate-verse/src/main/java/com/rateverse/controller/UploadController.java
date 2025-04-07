package com.rateverse.controller;

import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private ServletContext servletContext; // 注入 ServletContext

    @PostMapping("/image")
    public Result uploadImage(@RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.fail(null, ResultCodeEnum.FILE_EMPTY);
        }

        try {
            // 生成唯一文件名
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            // 获取 Web 应用的根路径（例如 src/main/webapp/static/images/）
            String realPath = servletContext.getRealPath("/static/images/");
            // 确保目录存在
            Files.createDirectories(Paths.get(realPath));
            // 完整保存路径
            String filePath = realPath + fileName;
            // 保存图片
            Files.copy(file.getInputStream(), Paths.get(filePath));
            // 返回图片 URL
            String imageUrl = "/images/" + fileName;
            return Result.ok(imageUrl, ResultCodeEnum.SUCCESS);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.fail(null, ResultCodeEnum.UPLOAD_ERROR);
        }
    }
}
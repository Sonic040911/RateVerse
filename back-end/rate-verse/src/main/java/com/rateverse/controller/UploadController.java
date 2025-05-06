package com.rateverse.controller;

import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
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

    private String uploadDir = "/var/www/uploads";

    @PostMapping("/image")
    public Result uploadImage(@RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.fail(null, ResultCodeEnum.FILE_EMPTY);
        }

        try {
            // 生成唯一文件名
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            // 确保上传目录存在
            Files.createDirectories(Paths.get(uploadDir));
            // 完整保存路径
            String filePath = uploadDir + "/" + fileName;
            // 保存图片
            Files.copy(file.getInputStream(), Paths.get(filePath));
            // 返回图片 URL
            String imageUrl = "/uploads/" + fileName;  // 前端通过 /uploads/ 访问
            return Result.ok(imageUrl, ResultCodeEnum.SUCCESS);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.fail(null, ResultCodeEnum.UPLOAD_ERROR);
        }
    }
}
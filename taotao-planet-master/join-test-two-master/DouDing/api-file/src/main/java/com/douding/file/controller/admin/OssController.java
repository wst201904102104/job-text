package com.douding.file.controller.admin;


import com.douding.file.config.QiniuCloudUtil;
import com.douding.server.dto.FileDto;
import com.douding.server.dto.ResponseDto;

import com.douding.server.dto.TeacherDto;
import com.douding.server.service.FileService;

import com.douding.server.util.Base64ToMultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;


@RestController
@RequestMapping("/admin")
public class OssController {

    private static final Logger LOG = LoggerFactory.getLogger(FileController.class);


    public static final String BUSINESS_NAME = "文件上传";

    @Resource
    private FileService fileService;

    @PostMapping("/oss-append")
    public ResponseDto fileUpload(@RequestBody FileDto fileDto) throws Exception {
        ResponseDto<TeacherDto> teacherDtoResponseDto = new ResponseDto<>();
        String key = fileDto.getKey();
        String shardBase64 = fileDto.getShard();
        MultipartFile shard = Base64ToMultipartFile.base64ToMultipart(shardBase64);
        QiniuCloudUtil qiniuUtil = new QiniuCloudUtil();
        byte[] bytes = shard.getBytes();
        //使用base64方式上传到七牛云
        String fileUrl = qiniuUtil.put64image(bytes, key);
        teacherDtoResponseDto.setMessage(fileUrl);
        return teacherDtoResponseDto;
    }




    @PostMapping("/oss-simple")
    public ResponseDto fileUpload(@RequestParam MultipartFile file, String use) throws Exception {

        return null;
    }

    /*
        http://127.0.0.1:9000/file/admin/oss-check/267GleNQaeI6uaYKs22YW
        文件指纹加密值 267GleNQaeI6uaYKs22YW 验证数据库中是否已经保存过该文件
        查找文件分片位置
        无论断点传,还是全新传,都需要调用该方法进行验证
     */
    @GetMapping("/oss-check/{key}")
    public ResponseDto check(@PathVariable String key) throws Exception {
       return null;
    }


}

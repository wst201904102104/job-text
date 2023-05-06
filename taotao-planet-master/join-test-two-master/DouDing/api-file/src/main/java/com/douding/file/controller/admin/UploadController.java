package com.douding.file.controller.admin;

import com.douding.file.config.QiniuCloudUtil;
import com.douding.file.config.ResultViewModel;
import com.douding.server.domain.Test;
import com.douding.server.dto.FileDto;
import com.douding.server.dto.ResponseDto;
import com.douding.server.dto.TeacherDto;
import com.douding.server.enums.FileUseEnum;
import com.douding.server.service.FileService;
import com.douding.server.service.TeacherService;
import com.douding.server.service.TestService;
import com.douding.server.util.Base64ToMultipartFile;
import com.douding.server.util.UuidUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.*;
import java.util.List;

/*
    返回json 应用@RestController
    返回页面  用用@Controller
 */
@RequestMapping("/admin/file")
@RestController
public class UploadController {

    private static final Logger LOG = LoggerFactory.getLogger(UploadController.class);
    public  static final String BUSINESS_NAME ="文件上传";
    @Resource
    private TestService testService;

    @Value("${file.path}")
    private String FILE_PATH;

    @Value("${file.domain}")
    private String FILE_DOMAIN;

    private String fileUrl;
    @Resource
    private FileService fileService;

    @Resource
    private TeacherService teacherService;

    @RequestMapping("/upload")
    public ResponseDto upload(@RequestBody FileDto fileDto) throws Exception {
        ResponseDto<FileDto> fileDtoResponseDto = new ResponseDto<>();
        TeacherDto teacherDto = new TeacherDto();
        String use = fileDto.getUse();
        String key = fileDto.getKey();
        String suffix = fileDto.getSuffix();
        String shardBase64 = fileDto.getShard();
        MultipartFile shard = Base64ToMultipartFile.base64ToMultipart(shardBase64);
        // 保存文件到本地
        FileUseEnum useEnum = FileUseEnum.getByCode(use);
        // 如果目录不存在则创建
        String dir = useEnum.name().toLowerCase();
        File fullDir = new File(FILE_PATH + dir);
        if (!fullDir.exists()) {
            fullDir.mkdirs();
        }


        // course\6sfSqfOwzmik4A4icMYuUe.mp4
        String path = new StringBuffer(dir)
                .append(File.separator)
                .append(key)
                .append(".")
                .append(suffix)
                .toString();
        // course\6sfSqfOwzmik4A4icMYuUe.mp4.1
        String localPath = new StringBuffer(path)
                .append(".")
                .append(fileDto.getShardIndex())
                .toString();
        String fullPath = FILE_PATH + localPath;
        File dest = new File(fullPath);
        try {
            QiniuCloudUtil qiniuUtil = new QiniuCloudUtil();
            byte[] bytes = shard.getBytes();
            //使用base64方式上传到七牛云
            fileUrl = qiniuUtil.put64image(bytes, key);
//            teacherDto.setImage(fileUrl);
//            teacherService.save(teacherDto);
            fileDto.setPath(path);
            fileService.save(fileDto);
            // 保存文件
            shard.transferTo(dest);

        } catch (IOException e) {
            LOG.error(e.getMessage());
            return ResponseDto.error("上传失败-" + e.getMessage(), null);
        }
        if (fileDto.getShardIndex().equals(fileDto.getShardTotal())) {
            this.merge(fileDto);
        }
        fileDtoResponseDto.setContent(fileDto);
        return fileDtoResponseDto;
    }

    @PostMapping("/save")
    public ResponseDto save(@RequestBody TeacherDto teacherDto){
        ResponseDto<TeacherDto> responseDto = new ResponseDto<>();
        teacherDto.setImage(fileUrl);
        teacherService.save(teacherDto);
        responseDto.setContent(teacherDto);
        return responseDto;
    }

    //合并分片
    public void merge(FileDto fileDto) throws Exception {
        LOG.info("合并分片开始");
        String path = fileDto.getPath();
        Integer shardTotal = fileDto.getShardTotal();
        File newFile = new File(FILE_PATH, path);
        // 文件追加写入
        FileOutputStream outputStream = null;
        try {
            outputStream = new FileOutputStream(newFile, true);
        } catch (FileNotFoundException e) {
            LOG.error(e.getMessage());
        }
        // 分片文件
        FileInputStream fileInputStream = null;
        byte[] bytes = new byte[10 * 1024 * 1024];
        int len;

        try {
            for (Integer i = 0; i < shardTotal; i++) {
                // 读取第 i 个分片
                fileInputStream = new FileInputStream(new File(FILE_PATH + path + "." + (i + 1)));
                while ((len = fileInputStream.read(bytes)) != -1) {
                    outputStream.write(bytes, 0, len);
                }
            }

        } catch (IOException e) {
            LOG.error("合并分片异常-" + e.getMessage());
        } finally {
            try {
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
                outputStream.close();
                LOG.info("IO流关闭");
            } catch (IOException e) {
                LOG.error("IO流关闭失败-", e.getMessage());
            }
        }
        LOG.info("合并分片结束");
        // 释放虚拟机对文件的占用
        System.gc();
        Thread.sleep(100);

        LOG.info("删除分片开始");
        for (Integer i = 0; i < shardTotal; i++) {
            String filePath = FILE_PATH + path + "." + (i + 1);
            File file = new File(filePath);
            boolean result = file.delete();
            LOG.info("删除{},{}", filePath, result ? "成功" : "失败");
        }
        LOG.info("删除分片结束");
    }

    @GetMapping("/check/{key}")
    public ResponseDto check(@PathVariable String key) throws Exception {
        LOG.info("检查上传分片开始：{}", key);
        ResponseDto<FileDto> fileDtoResponseDto = new ResponseDto<>();
        FileDto fileDto = this.fileService.findByKey(key);
        fileDtoResponseDto.setContent(fileDto);
        return fileDtoResponseDto;
    }

}//end class

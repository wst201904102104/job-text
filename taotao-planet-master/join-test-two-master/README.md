环境说明:

* JDK11
* mysql 5.7/(8.x)+
* Redis 6.x +
* Maven 3.6 +
* 数据库脚本在项目 project-doc 文件中

本地host增加

```
127.0.0.1 domain-eureka
127.0.0.1 domain-config
```

启动顺序

* douding-eureka
* douding-config
* api-system
* api-business
* api-file
* douding-gateway
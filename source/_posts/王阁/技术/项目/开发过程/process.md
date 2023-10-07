## 1过程文档

记录开发过程中的遇到的一些问题与处理方案



Q：springboot preferred-networks参数不生效

参数配置异常

原配置信息为

```
servlet:
    multipart:
      enabled: true
      max-file-size: 4GB
      max-request-size: 4GB
    inetutils:
      preferred-networks:
        - 10.10.0.2
```

修改为

```
cloud:
    inetutils:
      preferred-networks: 10.10.0.2
```



### 登陆优化 

**开始时间 2023年 7月18日 星期二 15时19分51秒**

#### 功能现状：

现在的登陆是明文登陆，token的生成也未遵守jwt的规则。现在想在现有的基础上进行优化

#### 待办项

1. 密码加密
2. jwt改造

---

**密码加密的实现思路**

1. 前端对密码进行加密，非对称加密，使密码不可解密
2. 后端拿到前端的加密码后，再进行加密规则
   1. 存储再加密后的密码（注册）
   2. 再加密并与数据库中的密码进行比对（登陆）

----

**注册功能**

```
1. 开发注册页面
2. 登陆校验，用户名重复校验
3. 前端加密登陆
4. 后端加密登陆

```



### token校验

1. jwt校验

```
1. 了解什么是jwt
2. 后端jwt加密实现
```

2. 构思接下来功能的实现
   1. 后端管理系统
   
   2. 视频实现播放页面
      1. 如何串流
      
      qusb支持共享
   
   ---
   
   
   
3. 有一个文件系统的需求。现在我有很多的文件信息，如文本、视频、图片等信息。用qnap自带的文件检索工具查询太慢了。用起来也太卡了。尝试结合自己的开发能力，处理相关需求。 

---

1. 基于public、和pc大脑进行重新构建

   1. 视频信息
   2. 图片信息
   3. 文件信息

2. ```
   1. 图片地址
   /share/CACHEDEV1_DATA/PC大脑
   
   我需要通过python2 对一个路径进行遍历，路径下面所有的文件信息  并写入到一个文本中
   
   ```

3. 

---

我现在想要实现一个搜索框，通过搜索框来搜索文件信息。接下来我们围绕这个需求来进行实现

我的要求有

1. 搜索框内右侧有一个搜索放大镜按钮

2. 基于javascript+jquery+bootstrap等组件进行实现

   ---

   TODO
   
   1. 构思文件检索服务的UI
   2. web端的开发
   3. 后端的开发
   4. 平台的开发
   
   
   
   ----
   
   
   
   ![image-20230801140955743](http://img.wqkenqing.ren/typora_img/image-20230801140955743.png)





![image-20230801141324191](http://img.wqkenqing.ren/typora_img/image-20230801141324191.png)



1. 现在业面已经可以查询了，但文件预览与下载，还不行，主要原因，还是nas对资源的安全策略问题





```
docker run -d --name file-nginx \
    -p 9299:9299 \
    -v /roog/nginx_conf:/opt/bitnami/nginx/conf/bitnami \
    -v /share/CACHEDEV1_DATA/:/data \
    nginx:latest
```





```
我现在的服务器是centos7，我现在需要实现一些防火墙策略，需要你的协助
```

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    # '$status $body_bytes_sent "$http_referer" '
    # '"$http_user_agent" "$http_x_forwarded_for"';
    #access_log  logs/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;

    ## 新服务(静态网站)
    server {
        location / {
            root /data/Public;
        }
    }
}
```





```
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    # 其他事件配置项...
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout 65;

    #gzip on;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen 9299;
        server_name 192.168.3.8;

        root /data/Public;

        location / {
            try_files $uri $uri/ =404;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}

```

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    # '$status $body_bytes_sent "$http_referer" '
    # '"$http_user_agent" "$http_x_forwarded_for"';
    #access_log  logs/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;

    ## 新服务(静态网站)
    server {
 		 		listen 9299;
        server_name 192.168.3.8;
        location /data {
            root /data/Public;
        }
        location /images/ {
            root /data;
        }
    }
}
```



```
user  root;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    # '$status $body_bytes_sent "$http_referer" '
    # '"$http_user_agent" "$http_x_forwarded_for"';
    #access_log  logs/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;
    ## 新服务(静态网站)
    server {
        listen 9299;
        server_name 192.168.3.8;

        location /data {
            root /data/Public;
            autoindex on;  # 启用目录内容自动索引
        }
    }
}

```





```
curl -XPUT -H "Content-Type: application/json" http://data1:9200/*/_settings -d '{"index.blocks.read_only_allow_delete": false}'
  
```


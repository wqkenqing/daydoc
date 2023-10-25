title:  azkaban的部署与使用
date:  2021年 7月 6日
tags: [数据中心]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

## Azkaban的组成
三个主要的组件
* 关系型数据库
* WebServer
* executor


## Azkaban三种部署模式

 ### solo-server

 DB使用的是一个内嵌的H2，Web Server和Executor Server运行在同一个进程里。这种模式包含Azkaban的所有特性，但一般用来学习和测试。

### two-server模式

DB使用的是MySQL，MySQL支持master-slave架构，Web Server和Executor Server运行在不同的进程中。


### multiple-executor

采用master-slave架构，db用的是mysql, 一个web server ，多个Executor Server


## 部署准备

### 环境

安装git

```
yum install git 

```

安装gcc-c++

```

yum install gcc-c++
```
### 下载源码包
azkaban3.90.0.tar.gz

## 安装
```
./gradlew build installDist -x test 

```

### 建表

```
CREATE DATABASE azkaban_two_server; #创建数据库
use azkaban_two_server;
CREATE USER 'azkaban'@'%' IDENTIFIED BY 'azkaban';#创建用户
GRANT SELECT,INSERT,UPDATE,DELETE ON azkaban_two_server.* to 'azkaban'@'%' WITH GRANT OPTION;#给用户授权
source create-all-sql-0.1.0-SNAPSHOT.sql;#创建表
```
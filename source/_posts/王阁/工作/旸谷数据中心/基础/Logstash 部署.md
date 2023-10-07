title:  logstash 安装
date:  2021年 5月21日
tags: []
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

## 安装 logstash7.9.0
因为我们的 elasticsearch是 7.9.0 的所以这里我们 logstash也打算下载 7.9.0

## conf 配置

k8s logs to kafka

```
input {
    tcp{
        port=>7777
    }
 }
output {
     kafka {
        codec => json
        topic_id => "k8s-logs"
        bootstrap_servers => "kafka01:9092,kafka02:9092,kafka03:9092"
     }
 }

```
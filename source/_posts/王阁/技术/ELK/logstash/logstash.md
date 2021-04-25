title:  logstash使用
date: 2020-7-9
tags: [logstash,log]
---
 <!--more-->

 # logstash使用
logstash使用管道方式进行日志的收集处理与输出

一般包括三个阶段

输入input->处理filter->输出output

---

横线之上的内容是在logstash引入codec概念之前的主要流程,但引入codec之后则有所不同.

这里需要纠正之前的一个概念。Logstash 不只是一个input | filter | output 的数据流，
而是一个input | decode | filter | encode | output 的数据流！codec 就是用来 decode、encode 事件的。

`即在接收到数据后,可以对数据进行再编码和解码后输出`

即配置文件组成部份一般如下:

```
input {
   
}
filter {
    
}
output {
    
}

```

执行指令
```
logstash -f demo.conf
```

`所以这里针对logstash主要的内容还是针对不同组件模块进行配置`

## elasticsearch

```
output {
#stdout {  codec => rubydebug }
elasticsearch {
hosts => ["127.0.0.1:9200"]
template_overwrite => true
index => "rediscluster-%{+YYYY.MM.dd}"
workers => 5
}
}

```
## syslog

syslog.conf,rsyslog.conf



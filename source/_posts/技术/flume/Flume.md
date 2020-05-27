---

title: flume记录
date: 2019-06-19
tags:

---
flume几种source and sink实际操作
<!--more-->

## soruce

flume自身就支持多种source.
chanel这里暂用mem
sink to hdfs

简单测试几种source



```properties

# 配置Agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 配置Source
a1.sources.r1.type = exec
a1.sources.r1.channels = c1
a1.sources.r1.deserializer.outputCharset = UTF-8

# 配置需要监控的日志输出目录
a1.sources.r1.command = tail

# 配置Sink
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.useLocalTimeStamp = true
a1.sinks.k1.hdfs.path = hdfs://namenode:9000/flume/events/%Y-%m
a1.sinks.k1.hdfs.filePrefix = %Y-%m-%d-%H
a1.sinks.k1.hdfs.fileSuffix = .log
a1.sinks.k1.hdfs.minBlockReplicas = 1
a1.sinks.k1.hdfs.fileType = DataStream
a1.sinks.k1.hdfs.writeFormat = Text
#a1.sinks.k1.hdfs.rollInterval = 86400
a1.sinks.k1.hdfs.rollSize =0
a1.sinks.k1.hdfs.rollCount =0
#a1.sinks.k1.hdfs.idleTimeout = 0

# 配置Channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# 将三者连接
a1.sources.r1.channel = c1
a1.sinks.k1.channel = c1

```

## 命令

flume-ng agent -c /etc/flume-ng/conf/ -f kafka.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f demo2.conf -n a1 -Dflume.root.logger=INFO,console
16228


## 解决Flume采集数据时在HDFS上产生大量小文件的问题

以上conf为例

a1为agent的名称
demo.conf为flume配置文件的名称
-c指向log4j.properties文件和flume_env.sh文件所在目录。
--Dflume.root.logger=INFO,console 在终端输出运行日志

查阅flume配置参数，如下：

rollSize
默认值：1024，当临时文件达到该大小（单位：bytes）时，滚动成目标文件。如果设置成0，则表示不根据临时文件大小来滚动文件。

rollCount
默认值：10，当events数据达到该数量时候，将临时文件滚动成目标文件，如果设置成0，则表示不根据events数据来滚动文件。

round
默认值：false，是否启用时间上的”舍弃”，类似于”四舍五入”，如果启用，则会影响除了%t的其他所有时间表达式；

roundValue
默认值：1，时间上进行“舍弃”的值；

roundUnit

默认值：seconds，时间上进行”舍弃”的单位，包含：second,minute,hour

当设置了round、roundValue、roundUnit参数收，需要在sink指定的HDFS路径上指定按照时间生成的目录的格式，例如有需求，每采集1小时就在HDFS目录上生成一个目录，里面存放这1小时内采集到的数据。

## flume file to avro

```properties
#########a1 agent#####
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 配置Source
a1.sources.r1.type = exec
a1.sources.r1.channels = c1
a1.sources.r1.deserializer.outputCharset = UTF-8
a1.sources.r1.command = cat  /data/upload/theme_item_pool.csv

# 配置需要监控的日志输出目录
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

a1.sinks.k1.type = avro
a1.sinks.k1.hostname = namenode
a1.sinks.k1.port = 4444
a1.sinks.k1.requiredAcks = 1
a1.sinks.k1.channel = c1

```

## flume avro to kafka

```properties
#########a1 agent#####
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# 配置Source
a1.sources.r1.type = exec
a1.sources.r1.channels = c1
a1.sources.r1.deserializer.outputCharset = UTF-8
a1.sources.r1.command = cat  /data/upload/theme_item_pool.csv

# 配置需要监控的日志输出目录
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

a1.sinks.k1.type = avro
a1.sinks.k1.hostname = namenode
a1.sinks.k1.port = 4444
a1.sinks.k1.requiredAcks = 1
a1.sinks.k1.channel = c1
```


## avro source

```properties
#test avro sources
a1.sources=r1
a1.channels=c1
a1.sinks=k1

a1.sources.r1.type = avro
a1.sources.r1.channels=c1
a1.sources.r1.bind=localhost
a1.sources.r1.port=55555

#Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity = 100

#sink配置
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.useLocalTimeStamp = true
a1.sinks.k1.hdfs.path = hdfs://namenode:8020/flume/events/%Y-%m
a1.sinks.k1.hdfs.filePrefix = %Y-%m-%d-%H
a1.sinks.k1.hdfs.fileSuffix = .log
a1.sinks.k1.hdfs.minBlockReplicas = 1
a1.sinks.k1.hdfs.fileType = DataStream
a1.sinks.k1.hdfs.writeFormat = Text
#a1.sinks.k1.hdfs.rollInterval = 86400
a1.sinks.k1.hdfs.rollSize =0
a1.sinks.k1.hdfs.rollCount =0
#a1.sinks.k1.hdfs.idleTimeout = 0
a1.sinks.k1.channel = c1

```
## avro to file

```properties
#test avro sources
a1.sources=r1
a1.channels=c1
a1.sinks=k1

a1.sources.r1.type = exec
a1.sources.r1.channels = c1
a1.sources.r1.deserializer.outputCharset = UTF-8
a1.sources.r1.command =curl http://192.168.10.104:8088/ws/v1/cluster/apps

#Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity = 100

#sink配置

a1.sinks.k1.type=file_roll

a1.sinks.k1.channel=c1

a1.sinks.k1.sink.directory=/data/hadoop/flume-ng/config/log

```


```properties
### 多个sink

#test avro sources
a1.sources=r1
a1.channels=c1 c2
a1.sinks=k1 k2


a1.sources.r1.type = netcat
a1.sources.r1.bind=192.168.10.101
a1.sources.r1.port=55555
a1.sources.r1.channels = c1 c2

#Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity = 100

###channel2
a1.channels.c2.type = memory
a1.channels.c2.capacity=1000
a1.channels.c2.transactionCapacity = 100


#sink配置

#a1.sinks.k1.type=logger
a1.sinks.k1.type=file_roll
a1.sinks.k1.channel=c1
a1.sinks.k1.sink.directory=/data/hadoop/flume-ng/config/log

###sink2
a1.sinks.k2.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k2.brokerList = namenode:9092
a1.sinks.k2.topic = carstream
a1.sinks.k2.batchSize = 100
a1.sinks.k2.requiredAcks = 1
a1.sinks.k2.channel=c2

```

## 目录变化

```properties

a1.sources=r1
a1.channels=c1
a1.sinks=k1

a1.sources.r1.type = spooldir
a1.sources.r1.spoolDir = /data/hadoop/flume-ng/config/log
a1.sources.r1.fileHeader = true
a1.sources.r1.channels = c1

#Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity = 100

a1.sinks.k1.type=logger
a1.sinks.k1.channel=c1


```

## tailDir
```properties

# in this case called 'a1'

a1.sources = s1
a1.channels = c1
a1.sinks = k1

# For each one of the sources, the type is defined
a1.sources.s1.type = org.apache.flume.source.taildir.TaildirSource
a1.sources.s1.positionFile = /opt/cdhmoduels/apache-flume-1.5.0-cdh5.3.6-bin/taidir/dirsource/taildir_position.json
a1.sources.s1.filegroups = f1
a1.sources.s1.filegroups.f1 = /data/hadoop/flume-ng/log/

# The channel can be defined as follows.
a1.sources.s1.channels = c1
a1.sinks.k1.channel = c1

# Each sink's type must be defined
a1.sinks.k1.type = hdfs
a1.sinks.k1.hdfs.path = /flume/event/taildir
a1.sinks.k1.hdfs.filePrefix = hive-log
#Specify the channel the sink should use

# Each channel's type is defined.
a1.channels.c1.type = memory

# Other config values specific to each type of channel(sink or source)
# can be defined as well
# In this case, it specifies the capacity of the memory channel
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 1000


```





## 操作记录

flume-ng avro-client -c conf -H localhost -p 55555  -F /data/upload/trip_coord.csv

/data/upload/trip_coord.csv

flume-ng agent -c /etc/flume-ng/conf/ -f avro.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f avro2.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f curl.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f self2.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f kafka.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f tcp_logger.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f avro3.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f tcp_hdfs.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f avro.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f avro2.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f tcp.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f tcp4.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f syslog.conf -n a1 -Dflume.root.logger=INFO,console

flume-ng agent -c /etc/flume-ng/conf/ -f http_logger.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f api_logger.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f api_logger_twosink.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f kafka.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f demo4.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f tcp.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f tcp_two_sink.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f spool.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f taildir.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f udp.conf -n a1 -Dflume.root.logger=INFO,console
flume-ng agent -c /etc/flume-ng/conf/ -f udp_two_sink.conf -n a1 -Dflume.root.logger=INFO,console
---

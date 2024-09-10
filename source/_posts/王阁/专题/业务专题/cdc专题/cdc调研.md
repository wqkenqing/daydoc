

title: cdc调研
date: 2024-03-25 15:56:48
tags: []
categories: [专题]
password: 7FKBKZrTTTPG2LnC

---

<!--more-->

1. 什么是cdc？
2. 常用的cdc有哪些？
3. 主流cdc的应用案例

---

### 1. 什么是cdc?

cdc全称是change data capture，变化数据捕获。是指识别和捕获对[数据库](https://link.csdn.net/?target=https%3A%2F%2Fauth.huaweicloud.com%2Fauthui%2Fsaml%2Flogin%3FxAccountType%3Dcsdndev_IDP%26isFirstLogin%3Dfalse%26service%3Dhttps%3A%2F%2Factivity.huaweicloud.com%2Fdbs_Promotion%2Findex.html%3Futm_source%3Dhwc-csdn%26utm_medium%3Dshare-op%26utm_campaign%3D%26utm_content%3D%26utm_term%3D%26utm_adplace%3DAdPlace070851)中的数据所做的更改（包括数据或数据表的插入、更新、删除等），然后将这些更改按发生的顺序完整记录下来，并实时通过消息中间件传送到下游流程或系统的过程。通过这种方式，CDC能够向数据仓库提供高效、低延迟的数据传输，以便信息被及时转换并交付给专供分析的应用程序。

简而言之就是通过读取数据库日志，进行数据同步的工具。

### 2. cdc 应用场景

- 变化数据捕获
- 数据仓库ETL
- 业务读写分离
- 应用系统多对一合并
- 一对多数据分发
- 数据跨平台容灾复制
- 数据平台滚动升级。

![CleanShot 2024-03-25 at 16.48.54@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202024-03-25%20at%2016.48.54@2x.png)

---

### 2、常用的cdc工具有哪些？

**Debezium**

Debezium是一个开源的捕获数据更改(CDC)平台，并且利用Kafka和Kafka Connect实现了自己的持久性、可靠性和容错性。

![暂无图片](http://img.wqkenqing.ren/typora_img/modb_20230524_ca68c2ea-f9d6-11ed-9d34-fa163eb4f6be.png)

**TapData**

Tapdata 开源项目的定位是一个实时数据服务平台，目前已上线的 1.0 版本核心覆盖实时数据同步、实时数据开发、Fluent ETL 等场景，具备全量和增量复制、异构数据库间的同步与转换，表级同步以及任务监控等能力。其工作机制主要包含以下四个环节的功能特性

- 基于 CDC 的无侵入数据源实时采集；
- 异构数据模型自动推断与转换；
- 数据处理，流式计算，缓存存储一体架构；
- 一键将模型发布为数据服务的闭环能力。

![img](http://img.wqkenqing.ren/typora_img/modb_20230524_ca849790-f9d6-11ed-9d34-fa163eb4f6be.png)

**Canal**

Canal 是阿里巴巴旗下的一款开源项目，纯 Java 开发。基于数据库增量日志解析，提供增量数据实时订阅和消费，目前主要支持了 MySQL，也支持 mariaDB。

![img](http://img.wqkenqing.ren/typora_img/modb_20230524_ca9212f8-f9d6-11ed-9d34-fa163eb4f6be.png)

**MySQL主备复制原理**

![img](http://img.wqkenqing.ren/typora_img/modb_20230524_cb51b086-f9d6-11ed-9d34-fa163eb4f6be.png)

- MySQL master 将数据变更写入二进制日志( binary log，其中记录叫做二进制日志事件binary log events，可以通过 show binlog events 进行查看)；
- MySQL slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)；
- MySQL slave 重放 relay log 中事件，将数据变更反映它自己的数据。

**canal 工作原理**

- canal 模拟 MySQL slave 的交互协议，伪装自己为 MySQL slave ，向 MySQL master 发送dump 协议；
- MySQL master 收到 dump 请求，开始推送 binary log 给 slave (即 canal )；
- canal 解析 binary log 对象(原始为 byte 流)。

**Maxwell**

Maxwell 是一个能实时读取 MySQL 二进制日志 binlog，并生成 JSON 格式的消息，作为生产者发送给 Kafka，Kinesis、RabbitMQ、Redis、Google Cloud Pub/Sub、文件或其它平台的应用程序。

![img](http://img.wqkenqing.ren/typora_img/modb_20230524_cb5e6286-f9d6-11ed-9d34-fa163eb4f6be.png)

应用场景：ETL、维护缓存、收集表级别的 dml 指标、增量到搜索引擎、数据分区迁移、切库 binlog 回滚方案等。

**Flink CDC**

Flink CDC Connectors 是 Flink 的一组 Source 连接器，是 Flink CDC 的核心组件，这些连接器负责从 MySQL、PostgreSQL、Oracle、MongoDB 等数据库读取存量历史数据和增量变更数据。Flink CDC Connectors 是一个独立的开源项目。

![img](http://img.wqkenqing.ren/typora_img/modb_20230524_cb82beba-f9d6-11ed-9d34-fa163eb4f6be.png)

**Integrate.io**

Integrate.io被广泛认为是市场上最好的ETL工具之一。它是一个基于云的ETL数据集成平台，可以轻松地将多个数据源联合起来。该平台有一个简单、直观的界面，能够在大量的来源和目的地之间建立数据管道。

该平台还具有高度的可扩展性，任何数据量或使用情况都可以，它使你能够将数据无缝地汇总到仓库、数据库、运营系统和数据存储中。有100多个流行的数据存储和SaaS应用程序包与Integrate.io，包括MongoDB、MySQL、亚马逊Redshift、谷歌云平台和Facebook。





---

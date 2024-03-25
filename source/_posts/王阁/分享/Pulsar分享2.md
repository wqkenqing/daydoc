## Pulsar分享

大家好，我今天想给大家分享的是 Pulsar。一款云原生分布式消息流平台，集消息、存储、轻量化函数式计算为一体，采用计算与存储分离架构设计，支持多租户、持久化存储、多机房跨区域数据复制，具有强一致性、高吞吐、低延时及高可扩展性等流数据存储特性。

它有以下关键特性：

- 是下一代云原生分布式消息流平台。
- Pulsar 的单个实例原生支持多个集群，可跨机房在集群间无缝地完成消息复制。
- 极低的发布延迟和端到端延迟。
- 可无缝扩展到超过一百万个 topic。
- 简单的客户端 API，支持 Java、Go、Python 和 C++。
- 主题的多种订阅模式（独占、共享和故障转移）。
- 通过 Apache BookKeeper 提供的持久化消息存储机制保证消息传递 。
- 由轻量级的 serverless 计算框架 Pulsar Functions 实现流原生的数据处理。
- 基于 Pulsar Functions 的 serverless connector 框架 Pulsar IO 使得数据更易移入、移出 Apache Pulsar。
- 分层式存储可在数据陈旧时，将数据从热存储卸载到冷/长期存储（如 S3、GCS）中。

---

今天主要是想对Pulsar这款组件进行一个介绍，为了让大家更直观的了解到Pulsar的一些特性，我的分享将会更直接的将它与kafka对比来开展。

---

### kafka VS pulsar 架构图对比

![在这里插入图片描述](http://img.wqkenqing.ren/typora_img/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAT29aenp5,size_20,color_FFFFFF,t_70,g_se,x_16.png)

![img](http://img.wqkenqing.ren/typora_img/f188a12f1fd078c0b1405e60dc6f2006.png)

由上图可知

#### Pulsar的组成

1. bookie（bookkeeper底层数据存储，在kafka中是由broker节点承担）
   1. BookKeeper 节点（bookie）存储消息和游标，ZooKeeper 则只用于为 broker 和 bookie 存储元数据。另外，BookKeeper 使用 RocksDB 作为内嵌数据库，用于存储内部索引，但不能独立于 BookKeeper 单独管理 RocksDB。
   2.  采用了 BookKeeper，因此伸缩性更灵活，速度更快，性能更一致，运维开销更小
2. broker（这里的broker更像hbase-client、hive-thrift-server等节点与kafka的broker有所区别）
   1. Broker 是无状态服务，客户端需要连接到 broker 进行核心消息传递。而 BookKeeper 和 ZooKeeper 是有状态服务。
3. zookeeper（元数据存储，这倒是跟kafka中的zookeeper雷同）

---

kafka VS Pulsar的一些关键名词

| Pulsar                   | Kafka                 |
| ------------------------ | --------------------- |
| Topic                    | Topic                 |
| Partition                | Partition             |
| Ledger(Segment)/Fragment | Fragment/Segment      |
| Bookie                   | Broker                |
| Broker                   | Client SDK            |
| Ensemble Size            | metadata.broker.list  |
| Write Quorum Size (Qw)   | Replica Number        |
| Ack Quorum Size (Qa)     | request.required.acks |

---

上面我们看到了，接下来我们按正常层级进行分析

#### 存储层 (bookie vs kafka broker)

![图片](http://img.wqkenqing.ren/typora_img/640-20240123095436487.jpeg)

Pulsar 的多层架构影响了存储数据的方式，即Pulsar也是分层存储

![图片](http://img.wqkenqing.ren/typora_img/640.png)

#### 第一层是Topic、Subscription、Cursors

Topic下面是ledger层，保存了分片(Segment)，分片里面保存更小粒度的ertries，entries存储一条条的Message。

```
消息存储在Topic中。逻辑上一个Topic是日志结构，每个消息都在这个日志结构中有一个偏移量。Apache Pulsar使用游标来跟踪偏移量。生产者将消息发送到一个指定的Topic，Apache Pulsar保证消息一旦被确认就不会丢失(正确的配置和非整个集群故障的情况下)。
```

消费者通过订阅来消费Topic中的消息。订阅是游标(跟踪偏移量)的逻辑实体，并且还根据不同的订阅类型提供一些额外的保证

​	1. Exclusive(独享) - 一个订阅只能有一个消息者消费消息

​	2. Shared(共享) - 一个订阅中同时可以有多个消费者，多个消费者共享Topic中的消息

	3. Fail-Over(灾备) - 一个订阅同时只有一个消费者，可以有多个备份消费者。一旦主消费者故障则备份消费者接管。不会出现同时有两个活跃的消费者。

一个Topic可以添加多个订阅。订阅不包含消息的数据，只包含元数据和游标。

Apache Pulsar通过允许消费者将Topic看做在消费者消费确认后删除消息的队列，或者消费者可以根据游标的回放来提供队列和日志的语义。在底层都使用日志作为存储模型。

---



1. Pulsar的简介
2. Pulsar 组件架构
3. Pulsar 的一条数据的读写之旅
4. Pulsar的运维特点
5. Pulsar与kafka的区别




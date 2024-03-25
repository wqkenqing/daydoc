## Pulsar介绍



#### pulsar与kafka的对比

![img](http://img.wqkenqing.ren/typora_img/pulsar_vs_kafka.webp)

**名词对比**

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

```
Pulsar 和 Kafka 都是以 Topic 描述一个基本的数据集合，Topic 数据又分为若干 Partition，即对数据进行逻辑上的 sharding 后存储为若干子集合。但 Kafka 以 partition 作为物理存储单位，每个 partition 必须作为一个整体（一个目录）存储在某一个 broker 上。 而 Pulsar 的每个 partition 是以 segment（对应到 Bookkeeper 的 Ledger） 作为物理存储的单位，所以 Pulsar 中的一个逻辑上有序的 partition 数据集合在物理上会均匀分散到多个 bookie 节点中。
Pulsar 的数据存储节点 Bookkeeper 被称为 Bookie，相当于一个 Kafka Broker。Ledger 是 Topic 的若干日志的集合，是 Pulsar 数据删除的最小单元，即 Pulsar 每次淘汰以 Ledger 为单位进行删除。Fragment 是 Bookkeeper 的概念，对应一个日志文件，每个 Ledger 由若干 Fragment 组成。

Pulsar 进行数据同步时采用相关共识算法保证数据一致性。Ensemble Size 表示 Topic 要用到的物理存储节点 Bookie 个数，类似于 Kafka 的 Replica Number，其副本数目 Ensemble Size 不能超过 Bookie 个数，因为一个 Bookie 上不可能存储超过一个以上的数据副本。每次写数据时最低写入的 Bookie 个数 Qw 的上限当然是 Ensemble Size。
Qa 是每次写请求发送完毕后需要回复确认的 Bookie 的个数，类似于 Kafka 的 request.required.acks，其数值越大则需要确认写成功的时间越长，其值上限当然是 Qw。参考文档1 提到 为了一致性，Qa应该是：(Qw + 1) / 2 或者更大，即为了确保数据安全性，Qa 下限是 (Qw + 1) / 2。

Pulsar 还有一个模块称为 Pulsar Broker，其详细作用机制下文有详述，用于处理 Client 的读写请求，不要与 Kafka Broker 相混淆，暂时可以认为其作用等同于 Kafka Client SDK。
```

###  为什么选择Pulsar

1. Kafka本身的不足

```
给出了 Kafka 的一些不足：

- 1 Kafka 每个 Partition replica 都完整的存储在kafka节点上，Partition 以及 Partition replica 由一系列的 Segment 和索引文件组成，整个架构简单快捷，但是单个节点必须有足够的磁盘空间来处理副本；
- 2 在集群扩展时必须做 Rebalance，需要 Broker 有良好的执行流程保证没有任何故障的情况下分散节点的存储压力。
- 3 kafka多租户支持不好
```

---

### Pulsar组件

Pulsar的组成有

1. bookie节点(Bookkeeper)
2. broker节点(与kafka broker有所区别)
3. zookeeper（存储元数据）

---

### bookie


```
kafka细粒度学习与总结
```

### 

[相对干货](Kafka史上最详细原理总结)

[Kafka学习笔记——Kafka原理与使用详解](https://blog.csdn.net/fuyuwei2015/article/details/72943207)

记录点

1. kafka组成部分
2. 数据流转过程
3. 备份
4. 安全性
5. 持久性
6. 性能
7. api储备
8. 消息传输机制(相关语义)
9. zookeer的作用



着重点

1. 备份同步(ISR)
2. 消费请求处理(处理能力,出现总是的恢复)
3. **Consumer Rebalance** 触发条件
   1. consumer的增加或删除
   2. broker的增加或删除
4. 分区策略
   1. Rangeassignor
   2. RoundRobinAssignor
   3. StickyAssignor
   4. 自定义
5. 再均衡
   1. 均衡器
      1. GroupCoordinator
      2. ConsumerCoordinator
   2. 原因
      1. 新的消费者入组
      2. 消息者宕机失联
      3. 消息者主动退组(leaveGroupRequest),fg 调用unsubscribe()取消订阅
      4. 消费组对应分区数量发生变化

6. 分区管理
   1. 优先副本(分区broker)
      1. leader副本承担读写服务,分区leader被怼坏意味着该分区不可用.即broker节点中对应的leader副本多少,决定了该节点的负载高低.
      2. 







High Level Consumer将从某个Partition读取的最后一条消息的offset存于Zookeeper中（从**0.8.2**开始同时支持将Offset存于Zookeeper中和专用的Kafka Topic中）。





Q: 为什么kafka吞吐量高



A: 同一个topic同个CG下的consumer只有一个消费它.





Q:为什么要支持存储于专用的Kafka Topic中？





KafkaConsumer 多线程思路:

应该不单是只开启多个consumer线程






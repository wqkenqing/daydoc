[TOC]



## 正常kafka服务运行的组件组成

* kafka
* zookeeper

 kafka运行主要的逻辑角色组成

 * producer
 * consumer
 * broker

 kafka 组成拓扑结构

* broker
    * topic
      * partition
    * AR
      * ISR
      * OSR
* consumer
  * consumer_group
    * offset
* producer

## Producer
### Q: server.properies(服务端参数配置)

相关参数

| 参数名               | 默认设置 | 建议设置 | 说明 |      |
| -------------------- | -------- | -------- | ---- | ---- |
| zookeeper.connect    |          |          |      |      |
| listeners            |          |          |      |      |
| advertised.listeners |          |          |      |      |
| broker.id |          |          |      |      |
|log.dir,log.dirs |          |          |      |      |
|message.max.bytes |          |          |      |      |


#### Q:listeners 与 advertised.listeners 是否有区别



#### message.max.bytes修改对conusmer端的级联影响


### Q: HW & LEO是什么,HW如何指定,有什么作用?

HW: hight watermark 高水位
LEO: log end offset 日志末尾偏移量

<font color=red>`HW决定了能该topic能被消费的最大offset`</font>

### Q: HW如何决定topic最大可被消息offset?

需要知道:
<font size=1>**HW 是由ISR中最小被同步partition的offset决定**</font>

HW是最小被同offset+1;

LEO也是落地日志offset+1;

这也很好理解,因为ISR是作为数据备份队列.那么限制用户只能消费ISR队列中每个节点都已经同步的数据.这有利于保证如果消费不成功,并遇到broker发生异常,在重新选举broker后
新选举的broker能尽可能有完整的数据备份(考虑到OSR也可能被设定参与选举).这样尽可能保证消息服务的稳定性.

<font color=yellow size=2> 但这里也抛出一个问题,就是若真发生了异常,HW后的数据能否保证不丢失!</font>


Q: kafka为什么没有完全采用同步复制或异步复制,而采用ISR模式



### Q: 生产者必要参数

| 参数名             | 设置内容 | 说明                                                         |
| ------------------ | -------- | ------------------------------------------------------------ |
| bootstrap.servers  |          | host:port,指定broker地址.可以不用完全按照完整的broker列表来设置 |
| key. serializer    |          |                                                              |
| value . serializer |          |                                                              |





### Q:producer发送消费涉及到的异常



### Q: producer发送消息的三种方法

* fire-and- forget
* sync
* async

### Q:producer 一条信息到broker主要经历的流程

1. Interceptor
2. Serializer
3. Partitioner

分区器不一定是必须的,但后两者则是必需的.



### Q: 拦截器的主要用法与实际用途





### Q: kafka发送吞吐量受影响参数与可能原因





### T:kafka producer原理分析



## Consumer

### Q:消费者与消费组,topic中分区与消费组与消费者的关系





### Q:消费者消费的内部逻辑



### Q: 如何获得每个分区最大offset

### Q:consumer订阅的几种方式,与区别

主要分为subscribe 与assign

前者能够自动再均衡,后者不行.

### Q:三种不同的订阅状态分别是什么



### Q:常见的反序列化协议





### Q:consumer poll(Duration timeout ),这个timeout起到什么作用.

#### 另timeout设置成0或Long.MAX_VALUE有什么区别

### Q:consumer 消费后提交的主要方式有几种,各有什么区别



### consumer poll()背后涉及到的逻辑简示

1. 消费位移
2. 消费者协调
3. 组协调
4. 消费者选举
5. 分区分配的分发
6. 再均衡逻辑
7. heartbroker

---







### Q:消费者位移信息存放位置

之前老版本存放在zookeeper中,但因为这样kafka的消费性能会受到zookeeper,controller节点负载能力的影响.而zookeeper ,常常不止被一个组件使用.所以,在新版本中,kafka客户端将consumer offset的维护信息放在内部主题

__consumer_offsets中.这个主题中存放着各consumer group 与consumer对订阅topic的消费位移信息





### Q:消费者多线程实现方式(大致三种)





### T: consumer异常提交与处理





## 日志存储

` kafka在服务器硬盘上的具体存储形式` 

### 日志格式的演变

1. v0
2. v1
3. v2

### Q: 各版本间主要的区别



### Q:swap对kafka的影响





## 服务端一些核心设计












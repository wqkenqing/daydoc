```

kafka bin 目录下sh脚本用法总结

```

并非所有,主要攫取一些相对常用的sh命令


大致有

+ kafka-console-consumer.sh
+ kafka-console-producer.sh
+ kafka-consumer-groups.sh
+ kafka-delete-records.sh
+ kafka-topics.sh


## kafka-console-consumer.sh

eg1

kafka-console-consumer.sh --bootstrap-server node1:9092,node2:9092,node3:9092 --from-beginning --group test1 --max-messages numbers --offset pos --partition num --property print.key=true

上面是一个相对常用consumer运行命令

### 参数分析

--bootstrap-server 指定 server集群地址

--from-begining 从头开始消费.

--group 指定消费组

--max-messages 指定消费最大消息数

--offset 指定消费位置

--partition 指定分区



## kafka-console-producer.sh


eg1


kafka-console-producer.sh  --batch-size 200 --broker-list node1:9092,node2:9092,node3:9092  --sync --topic


Kafka之sync、async以及oneway

https://blog.csdn.net/u013256816/article/details/54896952


参数解析后面补充

##



kafka-run-class.sh kafka.tools.GetOffsetShell  --broker-list localhost:9092 --partitions 0 --topic jzw_toll_island_state --time -1



jzw_toll_island_info


jzw_toll_island_state

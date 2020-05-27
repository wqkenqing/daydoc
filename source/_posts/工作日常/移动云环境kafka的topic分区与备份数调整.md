## Tip one 动态更改分区数

修改topic
kafka-topics --alter --zookeeper data1:2181 --topic  topicName --partitions num

查看topic

kafka-topics --describe --zookeeper data1:2181 --topic flume-ng
kafka-topics --describe --zookeeper data1:2181 --topic flume-ng


kafka-topics --list --zookeeper data1:2181
kafka-topics --delete --zookeeper data1:2181  --topic flume-ng
kafka-topics --delete-config topics --zookeeper data1:2181  





/data/colony/kafka_dir

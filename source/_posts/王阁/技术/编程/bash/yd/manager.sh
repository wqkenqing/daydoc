#!/bin/bash

topics=$(cat topics)

for topic in $topics
do
echo  delete the topic that name is $topic
#kafka-topics --delete --zookeeper data1:2181  --topic $topic
done

kafka-topics --list --zookeeper data2:2181,data1:2181,data3:2181  |grep topic

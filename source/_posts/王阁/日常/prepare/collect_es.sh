#!/bin/bash
echo "请输入要迁移的indics文本集地址"
read path
echo "请输入要进行的操作"
read operate
indices=$(cat $path)
for index in $indices
do
elasticdump --input=http://namenode2:9200/$index --output=http://jd:9200/$index
--type=$operate
done

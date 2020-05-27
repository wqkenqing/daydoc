
---

## 2019年 12月 04日 星期二

sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306/jzwsd_early_warning --username yg_reader --password yg987654321 --hive-database   jzwsd_action_record --create-hive-table  --hive-import --hive-overwrite -m 10

sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306/jzwsd_real_time_forecast --username yg_reader --password yg987654321 --hive-database  jzwsd_real_time_forecast --create-hive-table  --hive-import --hive-overwrite -m 10


jzwsd_action_record
jzwsd_early_warning
jzwsd_file_operation
jzwsd_login
jzwsd_permission
jzwsd_real_time_forecast
jzwsd_report_form
jzwsd_tunnel



sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306 jzwsd_tunnel --username yg_reader --password yg987654321 --hive-database   jzwsd_tunnel --create-hive-table  --hive-import --hive-overwrite -m 1

---

---

## 2019年 12月 04日 星期三

kafka-console-consumer.sh --bootstrap-server data1:9092,data2:9092,data3:9092 --from-beginning --group test1 --max-messages numbers --offset pos --partition num --property print.key=true

kafka-console-consumer.sh --bootstrap-server data1:9092 print.key=true --topic jzw_toll_island_state --partition=0  --offset 4000

---

## 2019年12月10日 星期二

registry.lisong.pub:5000/sjksh_yd

## 2019年12月11日 星期三


rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz ucloud2:~
rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz tengxun1:~
rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz tengxun2:~

rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ucloud2:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ucloud1:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc tengxun1:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc tengxun2:~ &&

prsync -H "ucloud1 ucloud2 tengxun1 tengxun2" /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc /root/


pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "source ~/.bashrc"

pssh -H "ucloud2 tengxun1 tengxun2" "tar -zxvf ~/jdk-8u181-linux-x64.tar.gz"
pssh -H "ucloud2 tengxun1 tengxun2" "mv ~/jdk1.8.0_181 ~/jdk1.8"
pssh -H "ucloud2 tengxun1 tengxun2" "mv ~/jdk1.8.0_181 ~/jdk1.8"

pscp  -H "ucloud2 tengxun1 tengxun2" /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ~

pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hadoop-2.7.7.tar.gz" &&
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hbase-1.0.0-bin.tar.gz"&&
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/zookeeper-3.4.5.tar.gz"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hbase-2.0.3-bin.tar.gz"

pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/hadoop-2.7.7 hadoop2.7.7"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/hbase-2.0.3 hbase2.0.3"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/zookeeper-3.4.5 zookeeper3.4.5"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/{data,name} "
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/yarn/logs"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/hbase/tmp"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/zookeeper"
pssh -H "ucloud1 ucloud2 tengxun1 " "touch /root/hadoop/zookeeper/myid" &&
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"

pssh -H "ucloud1  " "echo 1 > /root/hadoop/zookeeper/myid"
pssh -H "ucloud2 " " echo 2 > /root/hadoop/zookeeper/myid"
pssh -H "tengxun1 " "echo 3 > /root/hadoop/zookeeper/myid"

pssh -H "ucloud1  " "zkServer.sh start" &&
pssh -H "ucloud2 " " zkServer.sh start" &&
pssh -H "tengxun1 " "zkServer.sh start"

pssh -P -H "ucloud1 ucloud2  tengxun1 " "zkServer.sh start"
pssh -P -H "ucloud1 ucloud2  tengxun1 " "zkServer.sh status"


pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop namenode -format"
pssh -H "ucloud1  " "start-all.sh"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop-daemon.sh start journalnode "
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop-daemon.sh start journalnode "











rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  ucloud2:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  ucloud1:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  tengxun1:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  tengxun2:/root/hadoop2.7.7/etc/hadoop




rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  ucloud2:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  ucloud1:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  tengxun1:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  tengxun2:/root/hbase2.0.3/conf

rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  ucloud2:/root/zookeeper3.4.5/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  ucloud1://root/zookeeper3.4.5/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  tengxun1:/root/zookeeper3.4.5/conf



## 2019年12月12日 星期四 16时36分53秒

spark2-submit --class net.cdsunrise.hy.spark.LogOperateStream --master yarn --deploy-mode cluster  --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &
spark2-submit --class net.cdsunrise.hy.spark.GatherMintorStream --master yarn   --deploy-mode cluster --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &



![](http://img.wqkenqing.ren/d842dc89ec00efbe87b00485084b5c58.png)


## 2019年12月16日 星期一

## 2019年12月17日 星期一

docker run --restart=unless-stopped -d --net host registry.lisong.pub:28500/solve_upload_new2 job.TopicUpload

## 2019年12月18日 星期三


docker run --restart=unless-stopped -d --net host registry.lisong.pub:28500/kafka_test job.KafkaProducerJob

docker run --restart=unless-stopped --name solve -d -c 4 --net host registry.lisong.pub:28500/kafka_test job.TopicTest
docker run --restart=unless-stopped --name solve -d -c 4 --net host registry.lisong.pub:28500/solve_upload_new2 job.TopicUpload

## 2019年12月20日 星期五 11时57分25秒



## 2019年12月23日 星期一

 docker run --restart=unless-stopped -d --net host -v /home/liuyin/hy/gather-baidu/data/flume_conf/baidu_status.conf:/opt/flume-config/flume.conf  -v /home/liuyin/hy/gather-baidu/data/log:/log -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh

## 2019年12月23日 星期三


 docker run --restart=unless-stopped -d --net host -v /root/flume_config/kafka_test.conf:/opt/flume-config/flume.conf  -v /root/test_log/test.log:/logs/test.log  -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh


 docker run --restart=unless-stopped -d --net host -v /root/flume_config/kafka_spool.conf:/opt/flume-config/flume.conf  -v /root/test_log:/logs  -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh


## 2020年 1月 8日 星期三 14时02分44秒



## 2020年 1月 9日 星期四 10时59分06秒

sh es.sh setting


/Users/wqkenqing/Desktop/indics

curl -XGET http://data1:9200/_cat/indices\?v |awk '{print $3}' > new_indics



## 2020年 1月10日 星期五 10时00分37秒

kafka-console-producer.sh --broker-list datanode1:9092 --topic sharestream

spark2-submit --class net.cdsunrise.hy.spark.ShareOperateStream --master yarn --deploy-mode cluster  --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &



## 2020年 01月 11日 星期六 15:46:38

nginx -p . -c h-hui.conf -s reload


## 2020年 01月 13日 星期一 16:39:12

部署
yarn-session.sh -n 2 -tm 4096 -jm  4096


## 2020年 1月14日 星期二 10时46分43秒

kafka-run-class kafka.tools.MirrorMaker



kafka-run-class.sh kafka.tools.MirrorMaker --abort.on.send.failure true --whitelist ws_hy_mock_data --new.consumer --num.streams 1 --offset.commit.interval.ms 60000 --consumer.config con.config --producer.config pro.config &  \
exit

show.kuiq.wang:32796
show.kuiq.wang:32797
show.kuiq.wang:32798


---

## 2019年 12月 04日 星期二

sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306/jzwsd_early_warning --username yg_reader --password yg987654321 --hive-database   jzwsd_action_record --create-hive-table  --hive-import --hive-overwrite -m 10

sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306/jzwsd_real_time_forecast --username yg_reader --password yg987654321 --hive-database  jzwsd_real_time_forecast --create-hive-table  --hive-import --hive-overwrite -m 10


jzwsd_action_record
jzwsd_early_warning
jzwsd_file_operation
jzwsd_login
jzwsd_permission
jzwsd_real_time_forecast
jzwsd_report_form
jzwsd_tunnel



sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306 jzwsd_tunnel --username yg_reader --password yg987654321 --hive-database   jzwsd_tunnel --create-hive-table  --hive-import --hive-overwrite -m 1

---

---

## 2019年 12月 04日 星期三

kafka-console-consumer.sh --bootstrap-server data1:9092,data2:9092,data3:9092 --from-beginning --group test1 --max-messages numbers --offset pos --partition num --property print.key=true

kafka-console-consumer.sh --bootstrap-server data1:9092 print.key=true --topic jzw_toll_island_state --partition=0  --offset 4000

---

## 2019年12月10日 星期二

registry.lisong.pub:5000/sjksh_yd

## 2019年12月11日 星期三


rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz ucloud2:~
rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz tengxun1:~
rsync /Users/wqkenqing/Desktop/hadoop_ubuntu/jdk-8u181-linux-x64.tar.gz tengxun2:~

rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ucloud2:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ucloud1:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc tengxun1:~ &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc tengxun2:~ &&

prsync -H "ucloud1 ucloud2 tengxun1 tengxun2" /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc /root/


pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "source ~/.bashrc"

pssh -H "ucloud2 tengxun1 tengxun2" "tar -zxvf ~/jdk-8u181-linux-x64.tar.gz"
pssh -H "ucloud2 tengxun1 tengxun2" "mv ~/jdk1.8.0_181 ~/jdk1.8"
pssh -H "ucloud2 tengxun1 tengxun2" "mv ~/jdk1.8.0_181 ~/jdk1.8"

pscp  -H "ucloud2 tengxun1 tengxun2" /Users/wqkenqing/Desktop/dayliy_doc/集群/.bashrc ~

pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hadoop-2.7.7.tar.gz" &&
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hbase-1.0.0-bin.tar.gz"&&
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/zookeeper-3.4.5.tar.gz"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "tar -zxvf /root/upload/hbase-2.0.3-bin.tar.gz"

pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/hadoop-2.7.7 hadoop2.7.7"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/hbase-2.0.3 hbase2.0.3"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mv ~/zookeeper-3.4.5 zookeeper3.4.5"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/{data,name} "
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/yarn/logs"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/hbase/tmp"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2" "mkdir -p /root/hadoop/zookeeper"
pssh -H "ucloud1 ucloud2 tengxun1 " "touch /root/hadoop/zookeeper/myid" &&
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"

pssh -H "ucloud1  " "echo 1 > /root/hadoop/zookeeper/myid"
pssh -H "ucloud2 " " echo 2 > /root/hadoop/zookeeper/myid"
pssh -H "tengxun1 " "echo 3 > /root/hadoop/zookeeper/myid"

pssh -H "ucloud1  " "zkServer.sh start" &&
pssh -H "ucloud2 " " zkServer.sh start" &&
pssh -H "tengxun1 " "zkServer.sh start"

pssh -P -H "ucloud1 ucloud2  tengxun1 " "zkServer.sh start"
pssh -P -H "ucloud1 ucloud2  tengxun1 " "zkServer.sh status"


pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 " "chmod +x /root/hadoop/zookeeper/myid"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop namenode -format"
pssh -H "ucloud1  " "start-all.sh"
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop-daemon.sh start journalnode "
pssh -H "ucloud1 ucloud2 tengxun1 tengxun2 " "hadoop-daemon.sh start journalnode "











rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  ucloud2:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  ucloud1:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  tengxun1:/root/hadoop2.7.7/etc/hadoop &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hdfs/*  tengxun2:/root/hadoop2.7.7/etc/hadoop




rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  ucloud2:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  ucloud1:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  tengxun1:/root/hbase2.0.3/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/hbase/*  tengxun2:/root/hbase2.0.3/conf

rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  ucloud2:/root/zookeeper3.4.5/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  ucloud1://root/zookeeper3.4.5/conf &&
rsync /Users/wqkenqing/Desktop/dayliy_doc/集群/zookeeper/*  tengxun1:/root/zookeeper3.4.5/conf



## 2019年12月12日 星期四 16时36分53秒

spark2-submit --class net.cdsunrise.hy.spark.LogOperateStream --master yarn --deploy-mode cluster  --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &
spark2-submit --class net.cdsunrise.hy.spark.GatherMintorStream --master yarn   --deploy-mode cluster --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &



![](http://img.wqkenqing.ren/d842dc89ec00efbe87b00485084b5c58.png)


## 2019年12月16日 星期一

## 2019年12月17日 星期一

docker run --restart=unless-stopped -d --net host registry.lisong.pub:28500/solve_upload_new2 job.TopicUpload

## 2019年12月18日 星期三


docker run --restart=unless-stopped -d --net host registry.lisong.pub:28500/kafka_test job.KafkaProducerJob

docker run --restart=unless-stopped --name solve -d -c 4 --net host registry.lisong.pub:28500/kafka_test job.TopicTest
docker run --restart=unless-stopped --name solve -d -c 4 --net host registry.lisong.pub:28500/solve_upload_new2 job.TopicUpload

## 2019年12月20日 星期五 11时57分25秒



## 2019年12月23日 星期一

 docker run --restart=unless-stopped -d --net host -v /home/liuyin/hy/gather-baidu/data/flume_conf/baidu_status.conf:/opt/flume-config/flume.conf  -v /home/liuyin/hy/gather-baidu/data/log:/log -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh

## 2019年12月23日 星期三


 docker run --restart=unless-stopped -d --net host -v /root/flume_config/kafka_test.conf:/opt/flume-config/flume.conf  -v /root/test_log/test.log:/logs/test.log  -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh


 docker run --restart=unless-stopped -d --net host -v /root/flume_config/kafka_spool.conf:/opt/flume-config/flume.conf  -v /root/test_log:/logs  -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh


## 2020年 1月 8日 星期三 14时02分44秒



## 2020年 1月 9日 星期四 10时59分06秒

sh es.sh setting


/Users/wqkenqing/Desktop/indics

curl -XGET http://data1:9200/_cat/indices\?v |awk '{print $3}' > new_indics



## 2020年 1月10日 星期五 10时00分37秒

kafka-console-producer.sh --broker-list datanode1:9092 --topic sharestream

spark2-submit --class net.cdsunrise.hy.spark.ShareOperateStream --master yarn --deploy-mode cluster  --executor-memory 1G --num-executors 1 componet_kafka-jar-with-dependencies.jar 100 &



## 2020年 01月 11日 星期六 15:46:38

nginx -p . -c h-hui.conf -s reload


## 2020年 01月 13日 星期一 16:39:12

部署
yarn-session.sh -n 2 -tm 4096 -jm  4096


## 2020年 1月14日 星期二 10时46分43秒

kafka-run-class kafka.tools.MirrorMaker



kafka-run-class.sh kafka.tools.MirrorMaker --abort.on.send.failure true --whitelist ws_hy_mock_data --new.consumer --num.streams 1 --offset.commit.interval.ms 60000 --consumer.config con.config --producer.config pro.config

kafka-run-class kafka.tools.MirrorMaker --abort.on.send.failure true --whitelist ws_hy_mock_data --new.consumer --num.streams 1 --offset.commit.interval.ms 60000 --consumer.config con.config --producer.config pro.config

exit

show.kuiq.wang:32796
show.kuiq.wang:32797
show.kuiq.wang:32798


docker run -d --name kibana --net host -e "discovery.type=single-node"  -e ELASTICSEARCH_URL=http://data2:9200  kibana:6.7.2  

docker run -d --name kibana2 -p 5602:5602  -e ELASTICSEARCH_URL=http://183.220.144.150:9200  kibana:6.7.2  

docker run -d --name kibana -p 5602:5602 --net host -e ELASTICSEARCH_URL=http://183.220.144.150:9200  kibana:6.7.2  


183.220.144.148  data1
183.220.144.149  data2
183.220.144.150  data3

配置kafka同步

183.220.144.148:9092,183.220.144.150:9092,183.220.144.149:9092


## 2020年 1月18日 星期六 14时27分51秒

kafka-topics --alter --zookeeper data1:2181 --topic  carstream --partitions 3
kafka-topics --describe --zookeeper data1:2181 --topic carstream



## 2020年 1月19日 星期日
## 2020年 1月120日

sh bin/kafka-console-consumer --topic gather_serivce_state  --partition 2  --max-messages 10000 --bootstrap-server namenode:9092


environment_bureau-data




hy_pbu_environment_bureau_data




kafka-console-consumer.sh --bootstrap-server data1:9092  --topic zhsd_real



kafka-run-class.sh kafka.tools.GetOffsetShell  --broker-list localhost:9092 --partitions 0 --topic zhsd_real --time -1




kafka-console-consumer.sh --bootstrap-server data1:9092 --property print.key=true --topic zhsd_real --partition=0  --offset 60070121 >real.log



docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -p 9200:9200 -p 9300:9300 --name="ES01" -e "discovery.type=single-node"  elasticsearch:7.1.0


docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -p 9200:9200 -p 9300:9300 --name="ES01" -e "discovery.type=single-node"  elasticsearch:7.1.0


docker run --restart=unless-stopped -d -p 5601:5601  --net host docker.io/kibana:7.1.0


curl -H "Content-Type: application/json" -XPOST "jd_cloud:9200/bank/_bulk?pretty&refresh" --data-binary "@accounts.json"

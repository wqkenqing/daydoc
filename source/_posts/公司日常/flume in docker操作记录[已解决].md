
镜像地址:

registry.lisong.pub:5000/sunrise/flume:1.8.0-cdh


#test avro sources
a1.sources=r1
a1.channels=c1
a1.sinks=k1

a1.sources.r1.type = netcat
a1.sources.r1.bind=localhost
a1.sources.r1.port=55555
a1.sources.r1.channels = c1

#Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity=1000
a1.channels.c1.transactionCapacity = 100

#sink配置

#a1.sinks.k1.type=logger
a1.sinks.k1.type=file_roll

a1.sinks.k1.channel=c1

a1.sinks.k1.sink.directory=/data/hadoop/flume-ng/config/log

## 执行语句

docker run -d -v flume_conf:/opt/flume-config registry.lisong.pub:5000/sunrise/flume:1.8.0-cdh   tcp.conf



docker run -it -v flume_conf:/opt/flume-config -e FLUME_AGENT_NAME=a1 registry.lisong.pub:5000/sunrise/flume:1.8.0-cdh /bin/bash



docker run -it -v /root/flumeng/test/kafka_test.conf:/opt/flume-config/flume.conf -e FLUME_AGENT_NAME=a1 registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh /bin/bash

flume-ng agent -c /etc/flume-ng/conf/ -f taildir.conf -n a1 -Dflume.root.logger=INFO,console



docker run --restart=unless-stopped -d --net host -v /data/flume_config/config/test:/opt/flume-config -e FLUME_AGENT_NAME=a1  registry.lisong.pub:5000/sunrise/flume:1.8.0-cdh

docker run --restart=unless-stopped -d --net host -v /root/flumeng/test/tcp_logger.conf:/opt/flume-config/flume.conf -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh

docker run --restart=unless-stopped -d --net host -v /root/flumeng/test/kafka_test.conf:/opt/flume-config/flume.conf -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh



#!/bin/bash

FLUME_CONF_DIR=/opt/flume-config

[[ -d "${FLUME_CONF_DIR}"  ]]  || { echo "Flume config file not mounted in /opt/flume-config";  exit 1; }
[[ -z "${FLUME_AGENT_NAME}" ]] && { echo "FLUME_AGENT_NAME required"; exit 1; }

echo "Starting flume agent : ${FLUME_AGENT_NAME}"

flume-ng agent \
  -c ${FLUME_CONF_DIR} \
  -f ${FLUME_CONF_DIR}/flume.conf \
  -n ${FLUME_AGENT_NAME} \
  -Dflume.root.logger=INFO,console \
  -DpropertiesImplementation=org.apache.flume.node.EnvVarResolverProperties \




flume-ng agent -c /etc/flume-ng/conf/ -f flume.conf -n a1 -Dflume.root.logger=INFO,console

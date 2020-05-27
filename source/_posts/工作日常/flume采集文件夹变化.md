

registry.lisong.pub:28500/sunrise/flume  1.8.0-cdh



jd zookeeper 32773

kafka 32772

docker run -d -e FLUME_AGENT_NAME=a1 -v flume_conf:/opt/flume-config -v /root/test_log:/logs registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh   kafka_spool.conf



docker run -d -e FLUME_AGENT_NAME=a1 -v /root/flume_config/kafka_spool.conf:/opt/flume-config/flume.conf -v /root/test_log:/logs registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh



docker run --restart=unless-stopped -d --net host -v /root/flumeng/test/tcp_logger.conf:/opt/flume-config/flume.conf -v /root/test_log:/logs -e FLUME_AGENT_NAME=a1  registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh


docker pull registry.lisong.pub:28500/log_create
docker run -d -v /root/data/log/:/data/log registry.lisong.pub:28500/log_create
docker run -d -v /root/data/log/:/data/log registry.lisong.pub:28500/log_create2



/root/data/log




docker run -d -e FLUME_AGENT_NAME=a1 -v /root/flume_config/kafka_tail.conf:/opt/flume-config/flume.conf -v /root/data/log:/logs registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh

docker run -d -e FLUME_AGENT_NAME=a1 -v /root/flume_config/kafka_rege.conf:/opt/flume-config/flume.conf -v /root/data/log:/logs registry.lisong.pub:28500/sunrise/flume:1.8.0-cdh




/opt/jdk8/bin/java -Xmx20m -Dflume.root.logger=INFO,console -DpropertiesImplementation=org.apache.flume.node.EnvVarResolverProperties -cp /opt/flume-config:/opt/flume/lib/*:/lib/* -Djava.library.path= org.apache.flume.node.Application -f /opt/flume-config/flume.conf -n a1

flume-ng agent \
  -c /root/flume_config/ \
  -f /root/flume_config/kafka_tailDir.conf \
  -n a1 \
  -Dflume.root.logger=INFO,console \
  -DpropertiesImplementation=org.apache.flume.node.EnvVarResolverProperties &




  a1.sources.tailsource-1.type = exec
  a1.sources.tailsource-1.shell = /bin/bash -c
  a1.sources.tailsource-1.command = for i in /root/data/log/*.log;

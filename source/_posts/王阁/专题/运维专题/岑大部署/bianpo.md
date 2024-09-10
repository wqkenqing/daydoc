```

# example.conf: A single-node Flume configuration

# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
a1.sources.r1.type = exec 
a1.sources.r1.command = nc -l  datanode -k  44445
a1.sources.r1.max-line-length= 256
a1.sources.r1.ack-every-event= true
#a1.sources.r1.port = 44445
# 该配置解决source源编码的问题
a1.sources.r1.encoding = gbk






##kafka
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.brokerList = localhost:9092
a1.sinks.k1.kafka.topic =  cdgs_bianpo_1
a1.sinks.k1.allowTopicOverride =  false
a1.sinks.k1.serializer.class = kafka.serializer.StringEncoder
# a1.sinks.k1.kafka.producer.key.serializer.class = StringSerializer
a1.sinks.k1.batchSize = 100
a1.sinks.k1.requiredAcks = 1

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

```
 flume-ng agent -n a1 -c conf -f bianpo.conf -Dflume.root.logger=DEBUG
```




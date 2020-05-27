# kafka mirror consumer.config


jd kafka

116.196.81.123:32795,116.196.81.123:32797,116.196.81.123:32796


bootstrap.servers=192.168.10.100:9092,192.168.10.101:9092,192.168.10.102:9092
bootstrap.servers=10.103.22.40:9092,10.103.22.64:9092,10.103.22.65:9092



con.config

fetch.min.bytes=1
group.id=mirrorMaker
session.timeout.ms=30000
#bootstrap.servers=namenode:2181,datanode1:2181,datanode2:2181
#bootstrap.servers=116.196.81.123:32792
#bootstrap.servers=192.168.10.100:2181,192.168.10.101:2181,192.168.10.102:2181
#bootstrap.servers=192.168.10.100:9092,192.168.10.101:9092,192.168.10.102:9092
#bootstrap.servers=192.168.10.100:9092,192.168.10.101:9092,192.168.10.102:9092
#bootstrap.servers=116.196.81.123:32795,116.196.81.123:32797,116.196.81.123:32796
bootstrap.servers=183.220.144.148:9092,183.220.144.150:9092,183.220.144.149:9092
request.timeout.ms=40000

security.protocol=PLAINTEXT
sasl.kerberos.service.name=kafka


pro.config

batch.size=16384
#bootstrap.servers=116.196.81.123:32792
bootstrap.servers=116.196.81.123:32798,116.196.81.123:32797,116.196.81.123:32796
#bootstrap.servers=183.220.144.148:9092,183.220.144.150:9092,183.220.144.151:9092
buffer.memory=33554432
compression.type=none
linger.ms=0
request.timeout.ms=30000

security.protocol=PLAINTEXT
sasl.kerberos.service.name=kafka

<yandex>
<clickhouse_remote_servers>
<perftest_3shards_1replicas>
<shard>
<internal_replication>true</internal_replication>
<replica>
<host>ck02</host>
<port>9000</port>
</replica>
</shard>
<shard>
<replica>
<internal_replication>true</internal_replication>
<host>ck02</host>
<port>9000</port>
</replica>
</shard>
<shard>
<internal_replication>true</internal_replication>
<replica>
<host>ck03</host>
<port>9000</port>
</replica>
</shard>
</perftest_3shards_1replicas>
</clickhouse_remote_servers>

<!--zookeeper相关配置-->
<zookeeper-servers>
<node index="1">
<host>kafka01</host>
<port>2181</port>
</node>
<node index="2">
<host>kafka02</host>
<port>2181</port>
</node>
<node index="3">
<host>kafka03</host>
<port>2181</port>
</node>
</zookeeper-servers>

<macros>
<replica>ck02</replica>
</macros>

<networks>
<ip>::/0</ip>
</networks>

<clickhouse_compression>
<case>
<min_part_size>10000000000</min_part_size>
<min_part_size_ratio>0.01</min_part_size_ratio>
<method>lz4</method>
</case>
</clickhouse_compression>

</yandex>
## 需求整理

业主表示想要时间轴好用。

需求梳理

1. 时间轴联动优化
   1. 比如当时是2022.1.11~2022.3.11。那么下面全局都是这个范围
2. 游标定位放大缩小时，游标脱离了原视野范围。

3. 上述优化项可能带来的性能问题，要进行优化。

---





```
# 创建 sxsddsj_shield_data_0 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_0 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_1 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_1 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_2 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_2 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_3 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_3 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_4 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_4 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_5 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_5 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_6 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_6 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_7 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_7 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_8 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_8 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_9 topic
kafka-topics.sh --create --bootstrap-server your-bootstrap-server --topic sxsddsj_shield_data_9 --partitions 3 --replication-factor 1

```

```
# 创建 sxsddsj_shield_data_0 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_0 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_1 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_1 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_2 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_2 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_3 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_3 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_4 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_4 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_5 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_5 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_6 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_6 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_7 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_7 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_8 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_8 --partitions 3 --replication-factor 1

# 创建 sxsddsj_shield_data_9 topic
kafka-topics.sh --create --bootstrap-server kafka01:9092 --topic sxsddsj_shield_data_9 --partitions 3 --replication-factor 1

```


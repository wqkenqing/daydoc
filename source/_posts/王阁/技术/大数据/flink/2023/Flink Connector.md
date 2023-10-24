

title:  
date:  
tags: []

---

这是主要是对常见的connector 进行一个梳理，日常使用时可以开箱即用

 <!--more-->
 # Flink Connector 

 主要分为
 1. 预定义的 source 和 sink
 2. Bundled Connectors
 3. cdc Connector
 4. 自定义connector 

## 整理的connector

> 这里主要针对组件进行整理，具体的connector类型会作标记，有些是内置的，有些是自定义的，有些是三方的。



### Kafka Connector

**Source**

**kafka-connector(Bundled)**

**`USE`**

**Kafka Consumer **

```java
Properties properties = new Properties();
properties.setProperty("bootstrap.servers", "localhost:9092");
properties.setProperty("group.id", "test");
DataStream<String> stream = env
    .addSource(new FlinkKafkaConsumer<>("topic", new SimpleStringSchema(), properties));
```

```java

FlinkKafkaConsumer<String> myConsumer = new FlinkKafkaConsumer<>(...);
myConsumer.setStartFromEarliest();     // 尽可能从最早的记录开始
myConsumer.setStartFromLatest();       // 从最新的记录开始
myConsumer.setStartFromTimestamp(...); // 从指定的时间开始（毫秒）
myConsumer.setStartFromGroupOffsets(); // 默认的方法

```

```java
Map<KafkaTopicPartition, Long> specificStartOffsets = new HashMap<>();
specificStartOffsets.put(new KafkaTopicPartition("myTopic", 0), 23L);
specificStartOffsets.put(new KafkaTopicPartition("myTopic", 1), 31L);
specificStartOffsets.put(new KafkaTopicPartition("myTopic", 2), 43L);

myConsumer.setStartFromSpecificOffsets(specificStartOffsets);
```

```java
final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

Properties properties = new Properties();
properties.setProperty("bootstrap.servers", "localhost:9092");
properties.setProperty("group.id", "test");

FlinkKafkaConsumer<String> myConsumer = new FlinkKafkaConsumer<>(
    java.util.regex.Pattern.compile("test-topic-[0-9]"),
    new SimpleStringSchema(),
    properties);
```

```java
Properties properties = new Properties();
properties.setProperty("bootstrap.servers", "localhost:9092");
properties.setProperty("group.id", "test");

FlinkKafkaConsumer<String> myConsumer =
    new FlinkKafkaConsumer<>("topic", new SimpleStringSchema(), properties);
myConsumer.assignTimestampsAndWatermarks(
    WatermarkStrategy
        .forBoundedOutOfOrderness(Duration.ofSeconds(20)));

DataStream<String> stream = env.addSource(myConsumer);
```

**Kafka Sink**

```java
Properties properties = new Properties(); properties.setProperty(“bootstrap.servers”, “localhost:9092”);

FlinkKafkaProducer myProducer = new FlinkKafkaProducer( “my-topic”, // 目标 topic new SimpleStringSchema(), // 序列化 schema properties, // producer 配置 FlinkKafkaProducer.Semantic.EXACTLY_ONCE); // 容错

stream.addSink(myProducer);
```

![CleanShot 2023-03-02 at 14.40.29@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-02%20at%2014.40.29@2x.png)

### Elasticsearch

**ElasticsearchSource(Custom Source)**

```java
package sunrise.demo.source;

import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.source.RichSourceFunction;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/22
 * @desc
 */
public class ElasticsearchSource extends RichSourceFunction<String> {

    private final String index;
    private final String query;
    private final int interval;
    private boolean running;
    private RestHighLevelClient client;

    public ElasticsearchSource(String index, String query, int interval) {
        this.index = index;
        this.query = query;
        this.interval = interval;
    }

    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        client = new RestHighLevelClient(RestClient.builder(new HttpHost("calculation02", 9200, "http")));
    }

    @Override
    public void run(SourceContext<String> ctx) throws Exception {
        running = true;
        while (running) {
            SearchRequest searchRequest = new SearchRequest(index);
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
//            searchSourceBuilder.query(QueryBuilders.matchQuery("message", query));
            searchSourceBuilder.query(QueryBuilders.matchAllQuery());
            searchRequest.source(searchSourceBuilder);

            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

            for (SearchHit hit : searchResponse.getHits().getHits()) {
                ctx.collect(hit.getSourceAsString());
            }

            Thread.sleep(interval);
        }
    }

    @Override
    public void cancel() {
        running = false;
        try {
            client.close();
        } catch (Exception e) {
            // Ignore exception
        }
    }
}

```



**Elasticsearch Sink (Bundled)**

```java
import org.apache.flink.api.common.functions.RuntimeContext;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.connectors.elasticsearch.ElasticsearchSinkFunction;
import org.apache.flink.streaming.connectors.elasticsearch.RequestIndexer;
import org.apache.flink.streaming.connectors.elasticsearch6.ElasticsearchSink;

import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Requests;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

DataStream<String> input = ...;

List<HttpHost> httpHosts = new ArrayList<>();
httpHosts.add(new HttpHost("127.0.0.1", 9200, "http"));
httpHosts.add(new HttpHost("10.2.3.1", 9200, "http"));

// 使用 ElasticsearchSink.Builder 创建 ElasticsearchSink
ElasticsearchSink.Builder<String> esSinkBuilder = new ElasticsearchSink.Builder<>(
    httpHosts,
    new ElasticsearchSinkFunction<String>() {
        public IndexRequest createIndexRequest(String element) {
            Map<String, String> json = new HashMap<>();
            json.put("data", element);
        
            return Requests.indexRequest()
                    .index("my-index")
                    .type("my-type")
                    .source(json);
        }
        
        @Override
        public void process(String element, RuntimeContext ctx, RequestIndexer indexer) {
            indexer.add(createIndexRequest(element));
        }
    }
);

// 批量请求的配置；下面的设置使 sink 在接收每个元素之后立即提交，否则这些元素将被缓存起来
esSinkBuilder.setBulkFlushMaxActions(1);

// 为内部创建的 REST 客户端提供一个自定义配置信息的 RestClientFactory
esSinkBuilder.setRestClientFactory(
  restClientBuilder -> {
    restClientBuilder.setDefaultHeaders(...);
    restClientBuilder.setMaxRetryTimeoutMillis(...);
    restClientBuilder.setPathPrefix(...);
    restClientBuilder.setHttpClientConfigCallback(...);
  }
);

// 最后，构建并添加 sink 到作业管道中
input.addSink(esSinkBuilder.build());
```

```java
//要使用具有容错特性的 Elasticsearch Sinks，需要在执行环境中启用作业拓扑的 checkpoint：
final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.enableCheckpointing(5000); // 每 5000 毫秒执行一次 checkpoint
```

**处理失败的 Elasticsearch 请求** 

```java
DataStream<String> input = ...;

input.addSink(new ElasticsearchSink<>(
    config, transportAddresses,
    new ElasticsearchSinkFunction<String>() {...},
    new ActionRequestFailureHandler() {
        @Override
        void onFailure(ActionRequest action,
                Throwable failure,
                int restStatusCode,
                RequestIndexer indexer) throw Throwable {

            if (ExceptionUtils.findThrowable(failure, EsRejectedExecutionException.class).isPresent()) {
                // 队列已满；重新添加文档进行索引
                indexer.add(action);
            } else if (ExceptionUtils.findThrowable(failure, ElasticsearchParseException.class).isPresent()) {
                // 文档格式错误；简单地删除请求避免 sink 失败
            } else {
                // 对于所有其他失败的请求，失败的 sink
                // 这里的失败只是简单的重新抛出，但用户也可以选择抛出自定义异常
                throw failure;
            }
        }
}));
```

![CleanShot 2023-03-02 at 14.44.23@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-02%20at%2014.44.23@2x.png)

### hive

**hiveSource (custom source)**

```java
package sunrise.demo.source;/**
 * 
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2022/11/15
 * @desc 
 */
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.source.RichSourceFunction;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class HiveSource extends RichSourceFunction<Tuple2<String, String>> {


    private Connection connection = null;
    private PreparedStatement ps = null;
     String con;
     String user;
     String pass;
     String sql;
    public HiveSource(String con, String user, String pass, String sql ){
        this.user=user;
        this.pass=pass;
        this.con=con;
        this.sql=sql;
    }
    //该方法主要用于打开数据库连接，下面的ConfigKeys类是获取配置的类
    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        Class.forName("org.apache.hive.jdbc.HiveDriver");//加载数据库驱动
//        connection = DriverManager.getConnection("jdbc:mysql://106.54.170.224:10328", "root", "Bmsoft2020datateam");//获取连接

        connection = DriverManager.getConnection(con, user, pass);//获取连接
        ps = connection.prepareStatement(sql);
    }


    @Override
    public void run(SourceContext<Tuple2<String, String>> sourceContext) throws Exception {
        ResultSet resultSet = ps.executeQuery();
        while (resultSet.next()) {
            Tuple2<String, String> tuple = new Tuple2<String, String>();
            tuple.setFields(resultSet.getString(1), resultSet.getString(2));
            sourceContext.collect(tuple);
        }
    }

    @Override
    public void cancel() {
        try {
            super.close();
            if (connection != null) {
                connection.close();
            }
            if (ps != null) {
                ps.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```



**hive sink (custom sink)**

//暂略



### hbase

github上的一个开源的connector;

[**flink-connector-hbase**](https://github.com/apache/flink-connector-hbase)

**hbase source**

略

**hbase sink**

**Redis**

**flink-connector-redis**

```java
package sunrise.demo.stream.mapper;

import org.apache.flink.streaming.connectors.redis.common.mapper.RedisCommand;
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisCommandDescription;
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisMapper;
import sunrise.demo.pojo.VideoEvent;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/21
 * @desc
 */
public class RedisSinkMapper implements RedisMapper<VideoEvent> {
    @Override
    public RedisCommandDescription getCommandDescription() {
        return new RedisCommandDescription(RedisCommand.HSET,"video-sink");
    }

    @Override
    public String getKeyFromData(VideoEvent videoEvent) {
        return videoEvent.getCamera();
    }

    @Override
    public String getValueFromData(VideoEvent videoEvent) {
        return String.valueOf(videoEvent.getSpeed());
    }
}

```

### RabbitMQ

```java
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-rabbitmq</artifactId>
    <version>1.18-SNAPSHOT</version>
</dependency>

```

Source

```
final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
// checkpointing is required for exactly-once or at-least-once guarantees
env.enableCheckpointing(...);

final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
    .setHost("localhost")
    .setPort(5000)
    ...
    .build();
    
final DataStream<String> stream = env
    .addSource(new RMQSource<String>(
        connectionConfig,            // config for the RabbitMQ connection
        "queueName",                 // name of the RabbitMQ queue to consume
        true,                        // use correlation ids; can be false if only at-least-once is required
        new SimpleStringSchema()))   // deserialization schema to turn messages into Java objects
    .setParallelism(1);              // non-parallel source is only required for exactly-once
```

```
final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
    .setPrefetchCount(30_000)
    ...
    .build();

```

RabbitMQ Sink

```
final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
    .setPrefetchCount(30_000)
    ...
    .build();

```

### JDBC 

> 主要还是用的是Custom Source自己封装，不过官网也有相关connector。具体实现按需来。

## Table Connector

> 虽然connector的来源包可能是一样的，但使用代码可能不一样，所以区别记录一下。

### Formats

这里的format 指连接器的数据格式，可能有

1. csv
2. json
3. avro
4. cal cdc 
5. apache parquet
6. apache orc
7. Raw

在connector中有一个format参数，具体按数据内容格式指定就好

如下

```sql
CREATE TABLE att_business (
  id String,
  project_id String,
  project_code String) WITH (
 'connector' = 'filesystem',
 'path' = '/Users/kuiqwang/Desktop/att_business.csv',
 'format' = 'csv')
```





### Kafka Connector

```sql
CREATE TABLE KafkaTable (
  `deviceStatus` String,
  `describe` String,
  `postionNo` STRING,
  `creatTime` TIMESTAMP(3) METADATA FROM 'timestamp'
) WITH (
  'connector' = 'kafka',
  'topic' = 'jllsd-flume-collect-from-yaobo-1',
  'properties.bootstrap.servers' = 'kafka01:9092',
  'properties.group.id' = 'testGroup',
  'scan.startup.mode' = 'earliest-offset',
  'json.ignore-parse-errors' = 'true',
  'format' = 'json'
)
```

**消息键和消息体格式**

```sql
CREATE TABLE KafkaTable (
  `ts` TIMESTAMP(3) METADATA FROM 'timestamp',
  `user_id` BIGINT,
  `item_id` BIGINT,
  `behavior` STRING
) WITH (
  'connector' = 'kafka',
  ...

  'key.format' = 'json',
  'key.json.ignore-parse-errors' = 'true',
  'key.fields' = 'user_id;item_id',

  'value.format' = 'json',
  'value.json.fail-on-missing-field' = 'false',
  'value.fields-include' = 'ALL'
)
```

**重名的格式字段**

```sql
CREATE TABLE KafkaTable (
  `k_version` INT,
  `k_user_id` BIGINT,
  `k_item_id` BIGINT,
  `version` INT,
  `behavior` STRING
) WITH (
  'connector' = 'kafka',
  ...

  'key.format' = 'json',
  'key.fields-prefix' = 'k_',
  'key.fields' = 'k_version;k_user_id;k_item_id',

  'value.format' = 'json',
  'value.fields-include' = 'EXCEPT_KEY'
)
```

要启用加密和认证相关的安全配置，只需将安全配置加上 “properties.” 前缀配置在 Kafka 表上即可。下面的代码片段展示了如何配置 Kafka 表以使用 PLAIN 作为 SASL 机制并提供 JAAS 配置：

```sql
CREATE TABLE KafkaTable (
  `user_id` BIGINT,
  `item_id` BIGINT,
  `behavior` STRING,
  `ts` TIMESTAMP(3) METADATA FROM 'timestamp'
) WITH (
  'connector' = 'kafka',
  ...
  'properties.security.protocol' = 'SASL_PLAINTEXT',
  'properties.sasl.mechanism' = 'PLAIN',
  'properties.sasl.jaas.config' = 'org.apache.kafka.common.security.plain.PlainLoginModule required username=\"username\" password=\"password\";'
)
```

另一个更复杂的例子，使用 SASL_SSL 作为安全协议并使用 SCRAM-SHA-256 作为 SASL 机制：

```sql
CREATE TABLE KafkaTable (
  `user_id` BIGINT,
  `item_id` BIGINT,
  `behavior` STRING,
  `ts` TIMESTAMP(3) METADATA FROM 'timestamp'
) WITH (
  'connector' = 'kafka',
  ...
  'properties.security.protocol' = 'SASL_SSL',
  /* SSL 配置 */
  /* 配置服务端提供的 truststore (CA 证书) 的路径 */
  'properties.ssl.truststore.location' = '/path/to/kafka.client.truststore.jks',
  'properties.ssl.truststore.password' = 'test1234',
  /* 如果要求客户端认证，则需要配置 keystore (私钥) 的路径 */
  'properties.ssl.keystore.location' = '/path/to/kafka.client.keystore.jks',
  'properties.ssl.keystore.password' = 'test1234',
  /* SASL 配置 */
  /* 将 SASL 机制配置为 as SCRAM-SHA-256 */
  'properties.sasl.mechanism' = 'SCRAM-SHA-256',
  /* 配置 JAAS */
  'properties.sasl.jaas.config' = 'org.apache.kafka.common.security.scram.ScramLoginModule required username=\"username\" password=\"password\";'
)
```

**Upsert Kafka SQL**

```sql
CREATE TABLE pageviews_per_region (
  user_region STRING,
  pv BIGINT,
  uv BIGINT,
  PRIMARY KEY (user_region) NOT ENFORCED
) WITH (
  'connector' = 'upsert-kafka',
  'topic' = 'pageviews_per_region',
  'properties.bootstrap.servers' = '...',
  'key.format' = 'avro',
  'value.format' = 'avro'
);

CREATE TABLE pageviews (
  user_id BIGINT,
  page_id BIGINT,
  viewtime TIMESTAMP,
  user_region STRING,
  WATERMARK FOR viewtime AS viewtime - INTERVAL '2' SECOND
) WITH (
  'connector' = 'kafka',
  'topic' = 'pageviews',
  'properties.bootstrap.servers' = '...',
  'format' = 'json'
);

-- 计算 pv、uv 并插入到 upsert-kafka sink
INSERT INTO pageviews_per_region
SELECT
  user_region,
  COUNT(*),
  COUNT(DISTINCT user_id)
FROM pageviews
GROUP BY user_region;
```

### JDBC

> 常见的关系型数据库的应用

![CleanShot 2023-03-02 at 16.50.21@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-02%20at%2016.50.21@2x.png)



**mysql**

```sql
-- 在 Flink SQL 中注册一张 MySQL 表 'users'
CREATE TABLE MyUserTable (
  id BIGINT,
  name STRING,
  age INT,
  status BOOLEAN,
  PRIMARY KEY (id) NOT ENFORCED
) WITH (
   'connector' = 'jdbc',
   'url' = 'jdbc:mysql://localhost:3306/mydatabase',
   'table-name' = 'users'
);

-- 从另一张表 "T" 将数据写入到 JDBC 表中
INSERT INTO MyUserTable
SELECT id, name, age, status FROM T;

-- 查看 JDBC 表中的数据
SELECT id, name, age, status FROM MyUserTable;

-- JDBC 表在时态表关联中作为维表
SELECT * FROM myTopic
LEFT JOIN MyUserTable FOR SYSTEM_TIME AS OF myTopic.proctime
ON myTopic.key = MyUserTable.id;
```

### Elasticsearch

> 官网的connector 只能作为sink的存在。

```sql
CREATE TABLE myUserTable (
  user_id STRING,
  user_name STRING
  uv BIGINT,
  pv BIGINT,
  PRIMARY KEY (user_id) NOT ENFORCED
) WITH (
  'connector' = 'elasticsearch-7',
  'hosts' = 'http://calculation02:9200',
  'index' = 'sxsddsj-file-system'
);
```

### Hbase

```sql
-- 在 Flink SQL 中注册 HBase 表 "mytable"
CREATE TABLE hTable (
 rowkey INT,
 family1 ROW<q1 INT>,
 family2 ROW<q2 STRING, q3 BIGINT>,
 family3 ROW<q4 DOUBLE, q5 BOOLEAN, q6 STRING>,
 PRIMARY KEY (rowkey) NOT ENFORCED
) WITH (
 'connector' = 'hbase-1.4',
 'table-name' = 'mytable',
 'zookeeper.quorum' = 'localhost:2181'
);

-- 用 ROW(...) 构造函数构造列簇，并往 HBase 表写数据。
-- 假设 "T" 的表结构是 [rowkey, f1q1, f2q2, f2q3, f3q4, f3q5, f3q6]
INSERT INTO hTable
SELECT rowkey, ROW(f1q1), ROW(f2q2, f2q3), ROW(f3q4, f3q5, f3q6) FROM T;

-- 从 HBase 表扫描数据
SELECT rowkey, family1, family3.q4, family3.q6 FROM hTable;

-- temporal join HBase 表，将 HBase 表作为维表
SELECT * FROM myTopic
LEFT JOIN hTable FOR SYSTEM_TIME AS OF myTopic.proctime
ON myTopic.key = hTable.rowkey;
```

```sql
-- 在 Flink SQL 中注册 HBase 表 "mytable"
CREATE TABLE hTable (
 rowkey INT,
 info ROW<remark String>,
 info ROW<name STRINGT>,
 PRIMARY KEY (rowkey) NOT ENFORCED
) WITH (
 'connector' = 'hbase-2.12',
 'table-name' = 'cs_user1',
 'zookeeper.quorum' = 'kafka01:2181'
);

-- 用 ROW(...) 构造函数构造列簇，并往 HBase 表写数据。
-- 假设 "T" 的表结构是 [rowkey, f1q1, f2q2, f2q3, f3q4, f3q5, f3q6]
INSERT INTO hTable
SELECT rowkey, ROW(f1q1), ROW(f2q2, f2q3), ROW(f3q4, f3q5, f3q6) FROM T;

-- 从 HBase 表扫描数据
SELECT rowkey, family1, family3.q4, family3.q6 FROM hTable;

-- temporal join HBase 表，将 HBase 表作为维表
SELECT * FROM myTopic
LEFT JOIN hTable FOR SYSTEM_TIME AS OF myTopic.proctime
ON myTopic.key = hTable.rowkey;
```

```sql
CREATE TABLE hTable (
 rowkey String,
  info ROW<name String>,
 PRIMARY KEY (rowkey) NOT ENFORCED
) WITH (
 'connector' = 'hbase-2.2',
 'table-name' = 'cs_user1',
 'zookeeper.quorum' = 'kafka01:2181'
)
```

### FileSystem SQL Connector 

> 常规文件上文提到过，单独列出来主要是官网提供了一些如文件夹监听的功能

```sql
CREATE TABLE MyUserTable (
  column_name1 INT,
  column_name2 STRING,
  ...
  part_name1 INT,
  part_name2 STRING
) PARTITIONED BY (part_name1, part_name2) WITH (
  'connector' = 'filesystem',           -- required: specify the connector
  'path' = 'file:///path/to/whatever',  -- required: path to a directory
  'format' = '...',                     -- required: file system connector requires to specify a format,
                                        -- Please refer to Table Formats
                                        -- section for more details
  'partition.default-name' = '...',     -- optional: default partition name in case the dynamic partition
                                        -- column value is null/empty string

  -- optional: the option to enable shuffle data by dynamic partition fields in sink phase, this can greatly
  -- reduce the number of file for filesystem sink but may lead data skew, the default value is false.
  'sink.shuffle-by-partition.enable' = '...',
  ...
)
```

### Directory watching

```sql
CREATE TABLE MyUserTableWithFilepath (
  column_name1 INT,
  column_name2 STRING,
  `file.path` STRING NOT NULL METADATA
) WITH (
  'connector' = 'filesystem',
  'path' = 'file:///path/to/whatever',
  'format' = 'json'
)

```

### Streaming Sink 

```sql

CREATE TABLE kafka_table (
  user_id STRING,
  order_amount DOUBLE,
  log_ts TIMESTAMP(3),
  WATERMARK FOR log_ts AS log_ts - INTERVAL '5' SECOND
) WITH (...);

CREATE TABLE fs_table (
  user_id STRING,
  order_amount DOUBLE,
  dt STRING,
  `hour` STRING
) PARTITIONED BY (dt, `hour`) WITH (
  'connector'='filesystem',
  'path'='...',
  'format'='parquet',
  'sink.partition-commit.delay'='1 h',
  'sink.partition-commit.policy.kind'='success-file'
);

-- streaming sql, insert into file system table
INSERT INTO fs_table 
SELECT 
    user_id, 
    order_amount, 
    DATE_FORMAT(log_ts, 'yyyy-MM-dd'),
    DATE_FORMAT(log_ts, 'HH') 
FROM kafka_table;

-- batch sql, select with partition pruning
SELECT * FROM fs_table WHERE dt='2020-05-20' and `hour`='12';
```

```sql
CREATE TABLE kafka_table (
  user_id STRING,
  order_amount DOUBLE,
  ts BIGINT, -- time in epoch milliseconds
  ts_ltz AS TO_TIMESTAMP_LTZ(ts, 3),
  WATERMARK FOR ts_ltz AS ts_ltz - INTERVAL '5' SECOND -- Define watermark on TIMESTAMP_LTZ column
) WITH (...);

CREATE TABLE fs_table (
  user_id STRING,
  order_amount DOUBLE,
  dt STRING,
  `hour` STRING
) PARTITIONED BY (dt, `hour`) WITH (
  'connector'='filesystem',
  'path'='...',
  'format'='parquet',
  'partition.time-extractor.timestamp-pattern'='$dt $hour:00:00',
  'sink.partition-commit.delay'='1 h',
  'sink.partition-commit.trigger'='partition-time',
  'sink.partition-commit.watermark-time-zone'='Asia/Shanghai', -- Assume user configured time zone is 'Asia/Shanghai'
  'sink.partition-commit.policy.kind'='success-file'
);

-- streaming sql, insert into file system table
INSERT INTO fs_table 
SELECT 
    user_id, 
    order_amount, 
    DATE_FORMAT(ts_ltz, 'yyyy-MM-dd'),
    DATE_FORMAT(ts_ltz, 'HH') 
FROM kafka_table;

-- batch sql, select with partition pruning
SELECT * FROM fs_table WHERE dt='2020-05-20' and `hour`='12';
```


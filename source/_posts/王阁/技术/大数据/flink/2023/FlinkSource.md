title:  Flink Source
date:  2023年 2月28日
tags: [Flink、source]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

# Flink Source

> flink source 梳理

## 1、Source 组成与原理篇

暂略

## 2、常用Source 

因为flink 流批一体，这里source作为数据流的入口，常见的类型也可以分为

1. 有界(Bounded)
2. 无界(Unbounded)

### 2.1 Bounded Source 

#### 2.1.1 集合

1. 直接从集合元素中获取

```
env.fromCollection(collection)
```

2. 从元素获取

   ```
   env.fromElements(
       new User("Mary", "./home", 1000L),
       new User("Bob", "./cart", 2000L)
   );
   ```

   

   #### 2.1.2 文件

   主要的方法有

   1. readTextFile
   2. readFile

   ```
   env.readTextFile("user.csv");
   ```

   ### 2.2 无界

   #### 2.2.1 Socket

   ```
   DataStream<String> stream = env.socketTextStream("localhost", 7777);
   ```

   #### 2.2.2 kafka

   ```java
   env.setParallelism(1);
           Properties properties = new Properties();
           properties.setProperty("bootstrap.servers", "kafka01:9092,kafka02:9092,kafka03:9092");
           properties.setProperty("group.id", "consumer-group");
           properties.setProperty("key.deserializer",
                   "org.apache.kafka.common.serialization.StringDeserializer");
           properties.setProperty("value.deserializer",
                   "org.apache.kafka.common.serialization.StringDeserializer");
           properties.setProperty("auto.offset.reset", "earliest");
           DataStreamSource<String> kafkaStream = env.addSource(new FlinkKafkaConsumer<String>("jllsd-flume-collect-from-yaobo-1", new SimpleStringSchema(), properties));
           kafkaStream.print("jll");
   ```

   

   ### 2.3 自定义

   自定义Source也是非常常用和重要的一个Source

1. SourceFunction
   1. 并行度为1
   2. 自定义的方法有
      1. run()
      2. cancel()
2. RichSourceFunction
   1. 在实现SourceFunction基础上，又继承了AbstractRichFunction
   2. 重要的方法有
      1. open()
      2. run()
      3. cancel()
   3. 相比之下
3. ParallelSourceFunction
   1. 可以设置并行度
   2. 重要的方法
      1. run()
      2. cancel
4. RichParallelSourceFunction
   1. 可以设置并行度，并获取更丰富的内容
   2. 重要的方法
      1. run()
      2. cancel()

#### 2.3.1 MysqlSource( RichSourceFunction)

```java
package sunrise.demo.source;/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2022/11/15
 * @desc
 */

import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.source.RichSourceFunction;
import sunrise.demo.pojo.GoodsRecord;
import sunrise.demo.util.ORMUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class MysqlReader extends RichSourceFunction<GoodsRecord> {


    String con;
    String user;
    String pass;
    String sql;
    private Connection connection = null;
    private PreparedStatement ps = null;

    public MysqlReader(String con, String user, String pass, String sql) {
        this.user = user;
        this.pass = pass;
        this.con = con;
        this.sql = sql;
    }

    //该方法主要用于打开数据库连接，下面的ConfigKeys类是获取配置的类
    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        Class.forName("com.mysql.cj.jdbc.Driver");//加载数据库驱动
        connection = DriverManager.getConnection(con, user, pass);//获取连接
        ps = connection.prepareStatement(sql);
    }


    @Override
    public void run(SourceContext<GoodsRecord> sourceContext) throws Exception {
        ResultSet resultSet = ps.executeQuery();
        while (resultSet.next()) {
            sourceContext.collect((GoodsRecord) ORMUtil.autoPackage(ORMUtil.getAnnotationVal(GoodsRecord.class), resultSet, GoodsRecord.class));
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

2. 后续补充其它demo


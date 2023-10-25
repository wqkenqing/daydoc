title:  flink table & sql 
date:  2023年 03月 03日
tags: [flink 、table 、sql、catalog]

password: 7FKBKZrTTTPG2LnC

---

flink table & sql的掌握，然后基于catalog的元数据信息梳理。

 <!--more-->

# Flink sql & Table

> 实际应用中flink table 与sql 的应用中,table api应用较少，更多的是直接使用sql 。

## Flink Table 

flink table 这里我前期专门掌握，了解api脉络，主要也是学习拓展。所以也针对性的进行一些记录。 



Tips: 也正因为要用flink sql 与table所以在原来flink 1.1.12.4的基础上进行了一定的升级。现在的主要版本是flink 1.14.4

表环境的特点：

```
• 在内部的Catalog 中注册 Table。

• 注册 外部的 C a t a l o g 。

• 加载可插拔模块。

• 执行SQL 查询。

• 注册自定义西数。

• 将Dat aStream或Dataset转换成Table。

• 对ExecutionEnvironment或StreamExecutionEnvironment的引用。
```

Table API和SQL 总是与特定的表环境绑定。不能在同一条查询中使用不同表环境中的表，即 不能对不同表环境中的表进行Join 或Union 操作。

表环境可以通过create( 方法，在StreamExecutionEnvironment或ExecutionEnvironment中创建。

bleEnvironment 有以下3种表环境:

1. TableEnvironment、
2. StreamTableEnvironment、 
3. BatchTableEnvironment，

![CleanShot 2023-03-03 at 13.50.45@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-03%20at%2013.50.45@2x.png)

1. 使用OldPlanner和BlinkPlanner

如果两个计划器的 JAR 包都在类路径中，则应该明确地设置要在当前程序中使用的计划器。

1. 使 用 O l d P l a n n e r 。

```
 定义所有初始化表环境的参数 
 EnvironmentSettings fsSettings = EnvironmentSettings.newInstance).useoldPlanner( ). instreamingmode()1/ 设蛋组件应在流模式下工作。默认启用
build();
/1 获取流处理的执行环境
StreamExecutionEnvironment fsEnv = StreamExecutionEnvironment.getExecutionEnvironment(); 
11 创建 Tab le API 和SQL程序的执行环境
StreamTableEnvironment fsTableEnv = StreamTableEnvironment.create(fsEnv, fs
```

```
如果执行批量查询，则使用如下所示的配置: // 获取执行环境
ExecutionEnvironment fbEnv = ExecutionEnvironment. getExecutionEnvironment () ; 
1 创 建 T a b l e A P I 和S Q L 程 序 的 执 行 环 境
BatchTableEnvironment fbTableEnv - BatchTableEnvironment.create (fbEnv);
```

(2)使用BlinkPlanner。

```
/ 获取流处理的执行环境
StreamExecutionEnvironment bsEnv = StreamExecutionEnvironment.getExecution&nvironment (); 1/ 定义所有初始化表环境的参数
EnvironmentSettings bsSettings = EnvironmentSettings.newInstance) •useBlinkPlanner()// 将B1inkPlanner设置为必需的模块
•inStreamingmode()1/ 设置组件应在流模式下工作。默认启用
•build();
/ / 刨建 Table AFI和 SoL 程序的 执行环境
StreamTableEnvironment bsTableEnv = StreamTableEnvironment.create(bsEnv, bsSettings); 1/ 或者TableEnvironment bsTableEnv= TableEnvironment.create(bsSettings); 如果执行批量查询，则使用如下所示的 配置:
/ / 定义所有初始化表环境的参数
EnvironmentSettings bbSettings =
EnvironmentSettings.newInstance()
. u s e B l i n k P l a n n e r ( ) //将 B l i n k P l a n n e r 设 置 为 必需的 模 块
.inBatchMode ()
.build();
// 创建Table API和SQL程序的执行环境
TableEnvironment bbTableEnv = TableEnvironment.create(bbSettings);
```

如果“ /lib” 目录中只有一种计划器的JAR 包，则可以使用useAnyPlanner0方法创建 EnvironmentSettings。

![CleanShot 2023-03-03 at 13.57.48@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-03%20at%2013.57.48@2x.png)



```
//面 展 示 一 个 简 单 的 T a b l e A P l 聚 合 查 询 :
创建Table Api 和sQL程序的执行环境 TableEnvironment täbleEnv =
// 扫 描注 册的 or d e r s 表
Table orders = tableEnv.from("Orders"); // 计算来自法国的所有客户的收入
Table revenue = orders
.filter($("cCountry"). isEqual("FRANCE")) // 分 组 转换 箅 子
.groupBy($("cID"), $("cName”)
select (S("CID"), $("cName"), $("revenue"). sum().as("revSum")); 1 1 发 出 或转 换 表
//执 行查 询:
```

2. SQL 查询

   ```
   创選TableAPI和SQL程序的执行环塊
   TableEnvironment tableEnv = ..
   !/ 注册Orders表，计期来自法園的所有客户的收入
   Table revenue = tableEn.sq1Query
   "SELECT CID, cName, SUM(revenue) AS revSum " + "FROM Orders " +
   "WHERE Country = 'FRANCE' " + "GROUP BY cID, cName"
   );
   1 / 发 出 或 转 换表
   / / 执行蓝询
   ```

3. 下面展示如何指定一个更新查询， 并将查询的结果插入已注册的表中:

   ```
   创建TableAPI和SoL程序的执行环境
   TableEnvironment tableEnv =...;
   //注册Orders表，注册RevenueFrance输出表，计算来自法国約所有客户的收入并发出到Revenuefrance表 
   tableEnv.executeSq1(
   "INSERT INTO RevenueFrance " +
   “SELECT CID, cName, SUM(revenue) AS revsum" + "FROM Orders " +
   "WHERE country = 'FRANCE' " + "GROUP BY cID,cName")
   ```

4. 由 于 T a b l e A P I 和 S Q L 都 返 回 T a b l e 对 象 ，因 此 它 们 可 以 混 用 。可 以 在 S Q L 查 询 返 回 的 T a b l e 对象上定义Table APl查询。

5.  输 出表Table 通过写入TableSink 输出。Tablesink 是一个通用接又，支持以下几种文件格式。 • CSV、ApacheParquet、ApacheAvro。

6.  输 出表

   Table 通过写入TableSink 输出。Tablesink 是一个通用接又，支持以下几种文件格式。 

   1. CSV、ApacheParquet、ApacheAvro。 
   2. 存储系统(如JDBC、Apache HBase、Elasticsearch)
   3. 消息队列系统(Apache Kafka)

   

   批处理 Table 只能写入 BatchTablesink，

   而流处理 Table 需要指定写入 AppendStreamTableSink、RetractStreamTableSink或UpsertStreamTableSink。

```

下 面演 示输 出 T a b l e :
创建Table AI 和SQL 程序的执行环塤 TableEnvironment tableEnv
// 创建输出表
fi n a l Schema schema = new Schema)
.field("a", DataTypes.INT())
'field("b", DataTypes.STRING()) .field("c", DataTypes.LONG());
tableEnv.connect (new FileSystem("/path/to/file"))
.withFormat (new Csv().fieldDelimiter('|'). deriveSchema ())
, withSchema(schema) •createTemporaryTable("CsSinkTable"); / / 使用Table API 或SQL童询来计箅结果表 
Table result = . .
/ 将结 果 表 发 送 到 注册 的 T a b l e s i n k 
result.executeInsert("CsvSinkTable");
```


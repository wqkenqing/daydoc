title: hive练习实操记录 
date: 2023-11-01 14:01:44 
tags: []
categories: [回顾]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

通过car_data创建一个car表

建表语句

```
CREATE TABLE car_pakwheels (
    Id INT,
    Company_Name STRING,
    Model_Name STRING,
    Price DOUBLE,
    Model_Year INT,
    Location STRING,
    Mileage DOUBLE,
    Engine_Type STRING,
    Engine_Capacity DOUBLE,
    Color STRING,
    Assembly STRING,
    Body_Type STRING,
    Transmission_Type STRING,
    Registration_Status STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

```

导入csv文件，这里有一个小需求，就是我的csv文件第一行都是字段行。我需要在导入时，过滤掉这一行

基于这个文件，我们来创建分区表，先考虑按地区来创建。先指定动态分区

```
CREATE TABLE car_pakwheels_part (
    Id INT,
    Company_Name STRING,
    Model_Name STRING,
    Price DOUBLE,
    Model_Year INT,
    Location STRING,
    Mileage DOUBLE,
    Engine_Type STRING,
    Engine_Capacity DOUBLE,
    Color STRING,
    Assembly STRING,
    Body_Type STRING,
    Transmission_Type STRING,
    Registration_Status STRING
)
partitioned by (Postion STRING)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE;

set hive.exec.dynamic.partition=true;
set hive.exec.dynamic.partition.mode=nonstrict
insert into table car_pakwheels_part partition( Postion ) select * from car_pakwheels;
```

这里的情况是分区字段是虚拟字段，也会占一个列，但不在本地存储（其实就是以文件夹名的形式存在），这里的处理方式就是将Locaiton字段的作为Postion的内容放在最后一列(分区字段在最后一列)；

-> 从而实现分区表的转换

```
#这里是limit的用法和分区的用法
select * from car_pakwheels_part where Postion='Islamabad' limit 100 offset 3
```

接下来有一个多个表的数据源，后面可以测试多表的join功能。

**数据源**： **Delivery Center Food & Goods orders in Brazil**



### douban数据

遇到一个问题，就是导入的数据中 中文是乱码的。

通过下面方式解决的，但这里有一个问题，那就是这个表的中文编码是gbk，但一般来说最好是utf8

```
alter table douban_movie_comments set serdeproperties ('serialization.encoding'= 'gbk');
select * from douban_movie_comments limit 100;
```



movies

```

CREATE TABLE hive_demo.douban_movies (
    movie_id STRING,
    name STRING,
    alias STRING,
    actors STRING,
    cover STRING,
    directors STRING,
    douban_score FLOAT,
    douban_votes INT,
    genres STRING,
    imdb_id STRING,
    languages STRING,
    mins INT,
    official_site STRING,
    regions STRING,
    release_date STRING,
    slug STRING,
    storyline STRING,
    tags STRING,
    year INT,
    actor_ids STRING,
    director_ids STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
STORED AS TEXTFILE
TBLPROPERTIES ("serialization.null.format" = "0.0"
    ,
    'skip.header.line.count'='1'
    );


load data inpath "/hive_demo/douban_data/movies.csv" into table douban_movies
```

这个表有点问题，但具体后面使用时再看

这里有个别字段可以进行udf函数练习

actor_ids等，它的字段信息如下

```
"王博:|吴佳尼:1313262|王姬:1275275|高丽雯:1325661|郭力行:1354456|尹哲:1326188|沈丹萍:1009141|罗中旭:1328354|臧金生:1045901|罗刚:1315029|居文沛:1275019|阎青妤:1317117"
```

---

现在这里还有一个baike的数据，它是json格式的。

```
CREATE TABLE hive_demo.baike (
    qid STRING,
    category STRING,
    title STRING,
    desc STRING,
    answer STRING
)
ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
STORED AS TEXTFILE;

```

这里应用了**org.apache.hive.hcatalog.data.JsonSerDe**

[常见的SerDe](https://cwiki.apache.org/confluence/display/Hive/SerDe)

1. Avro
2. ORC
3. RegEx
4. Thrift
5. Parquet
6. CSV
7. JsonSerDe

---

Hive中默认提供了多种SerDe用于解析和加载不同类型的数据文件，常用的有ORCSerde、RegexSerde、JsonSerDe等。

还有就是结合数据自定义开发SerDe

---

然后了解了一下 parse_url的用法

我这里建了一个azmon的表

```

CREATE TABLE hive_demo.amzon_products (
    asin STRING,
    title STRING,
    imgUrl STRING,
    productURL STRING,
    stars FLOAT,
    reviews INT,
    price FLOAT,
    listPrice FLOAT,
    categoryName STRING,
    isBestSeller BOOLEAN,
    boughtInLastMonth INT
)
ROW  FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
    'separatorChar' = ',',
    'quoteChar' = '"',
    'escapeChar' = '\\'
)
STORED AS TEXTFILE
TBLPROPERTIES ("serialization.null.format" = "0.0"
    ,
    'skip.header.line.count'='1'
    );

```

---

按UDTF+Lateral View的使用

其实也简单，主要就是一列化多列，然后多表join的效果。

示例语句：

```
select asin,title, host,path from amzon_products lateral view parse_url_tuple(producturl,"HOST","PATH")p as host,path
```

效果如下

![image-20231108165751948](http://img.wqkenqing.ren/typora_img/image-20231108165751948.png)

---

然后看了一下列转行、行转列的用法。具体结合数据再实验

---

再接下来看了一下json的处理

l **方式一****：****使用JSON函数进行处理**

Hive中提供了两个专门用于解析JSON字符串的函数：**get****_json_object****、****json_tuple**，这两个函数都可以实现将JSON数据中的每个字段独立解析出来，构建成表。

 

l **方式二****：****使用Hive内置的JSON Serde加载数据**

Hive中除了提供JSON的解析函数以外，还提供了一种专门用于**加载JSON文件的Serde**来实现对JSON文件中数据的解析，在创建表时指定Serde，加载文件到表中，会自动解析为对应的表格式。

---

接下来 窗口函数的应用实例

先查询了一下窗口函数中的patition by 和建表是partiton by 的区别

```
Hive的窗口函数中的`PARTITION BY`和建表时的`PARTITIONED BY`虽然语法上相似，但它们的作用完全不同：

1. **窗口函数中的`PARTITION BY`**:
   - 在窗口函数中使用时，`PARTITION BY`用来在计算窗口函数之前对数据进行逻辑分区。窗口函数随后在这些分区内独立计算，而不是在整个数据集上。
   - 例如，`SUM(col) OVER (PARTITION BY col1)`会对每个`col1`的值进行分组，然后在每个分组内独立计算`col`的和。这不会改变数据表中的行数，每行都会得到其对应`col1`分组内`col`的累计和。
   - 这是一种SQL的高级特性，用于执行复杂的数据分析和报告任务。

2. **建表时的`PARTITIONED BY`**:
   - 在创建Hive表时，`PARTITIONED BY`用于定义表的物理分区。这是一种数据库设计，用于优化查询，可以在文件系统级别将数据分割成不同的部分。
   - 例如，`CREATE TABLE ... PARTITIONED BY (col1)`会在Hive的底层存储（通常是HDFS）中为`col1`的每个唯一值创建一个单独的目录。这有助于加速查询，因为Hive可以只扫描包含特定`col1`值的分区，而不是整个表。
   - 这是物理存储的一个组织方式，影响的是数据的存储和查询性能。

总结一下，窗口函数中的`PARTITION BY`是一个运行时操作，它在查询执行时对结果集进行分区以进行聚合或计算，而建表时的`PARTITIONED BY`是一个数据存储时的物理分区设计，它会影响数据的物理存储结构和查询的性能。
```

```
select *
from (select *,
             row_number() over ( partition by body_type order by engine_capacity) rw
      from car_pakwheels_part)mm
where mm.rw <=3;

```

参考上面这个示例，它的作用就是按车型进行分区，并取每个分区引擎能力前三的车型



分区还有很多其它的玩法，这里先简单过一下，明天再专项训练一下。

---

按教程里面一下一个学习的点是拉链表

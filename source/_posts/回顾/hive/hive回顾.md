title: hive回顾   
date: 2020-06-23
tags:[ hive ,DDL,DML]
---
DDL ,DML

 <!--more-->


 `hive 创建hbase内部表`


 ```sql
 create table ods_uba.lin_test
(
   operate_no           string,
   dev_no               string,
   user_id              string,
   start_time           string
)
PARTITIONED BY (start_date string) 
 CLUSTERED BY (start_time)
 INTO 16 BUCKETS
 STORED AS ORC tblproperties("parquet.compress"="SNAPPY");

 ```



```

create external table bigdata17_user(
userid int,
username string,
fullname string)  
row format delimited fields terminated by ','   
lines terminated by '\n';

```


## 基本组成

1. database
2. 表
3. 分区
4. 桶

## 表结构支持类型
hive是一个数据仓库,采用了一些类数据库的设计,但底层通过java实现,因此它各字段主要能支持的类型,基本与java的基本数据类型和一些常用对象一致.如
 Integers
   * TINYINT-1位的整型
   * SMALLINT-2位的整型
   * INT-4位的整型
   * BIGINT-8位的整型

布尔类型
   * BOOLEAN-TRUE/FALSE

浮点类型
   * FLOAT
   * DOUBLE

定点数
   DECIMAL

字符串
   STRING
   VARCHAR
   CHAR

日期和时间
   TIMESTAMP
   DATE
二进制
   BINARY

 复杂类型
- 结构体类型
- MAP
- 数组


## HIVE表的创建,管理

### 创建表

#### 内部表

```sql
CREATE TABLE page_view(viewTime INT, userid BIGINT,
                page_url STRING, referrer_url STRING,
                ip STRING COMMENT 'IP Address of the User')
COMMENT 'This is the page view table'
PARTITIONED BY(dt STRING, country STRING)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '1'
STORED AS SEQUENCEFILE;
```


#### 外部表


### 展示表和分区

#### 查看所有表

```
show tables
```

#### 查看所有表的分区
```
SHOW PARTITIONS table_name
```

#### 查看表和表的列信息

```
describe table_name
```

#### 列出表的列和表的其它信息

```
describe extended table_name
```
#### 列出表和分区的隐藏信息

```

describe extended table_name PARTITION(rowName='')

```

### 修改表

#### 对表重命名

```
ALTER TABLE old_table_name RENAME TO new_table_name;
```
#### 对已有表的列名进行重命名

```
ALTER TABLE old_table_name REPLACE COLUMNS (col1 TYPE, ...);
```
需要保持位置与类型相同,不然会有列丢失

#### 对已创建的表增加列

```

ALTER TABLE tab1 ADD COLUMNS (c1 INT COMMENT 'a new int column', c2 STRING DEFAULT 'def val');

```
### 删除表和分区
#### 删除表

```
drop table table_name
```
#### 删除分区

``` 
drop table table_name drop PARTITION()
```

### 加载数据




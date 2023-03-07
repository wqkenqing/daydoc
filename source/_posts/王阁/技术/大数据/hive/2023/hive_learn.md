title:  hive学习
date:  2023年 3月 7日
tags: [hive、hql、面试]
password: 7FKBKZrTTTPG2LnC

---

以面试为标准的再学习hive

 <!--more-->

# hive learn



## 1、流程梳理

1. hive是什么
   1. Hive：由Facebook开源用于解决海量结构化日志的数据统计。
   2. Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张表，并提供类SQL查询功能。
2. hive由什么组成
3. hive怎么部署
4. hive 数据类型
5. hive DDL
6. hive DML
7. hive 查询
8. hive函数
9. hive压缩与存储
10. hive调优
11. hive离线数仓

## 2、学习QA

1. hive执行原理

hive如何从client执行到sql解析到mapreduce 任务层 再提交到yarn。

2. 建表时format中相关参数细化了解

如下

```
row format delimited fields terminated by ','  -- 列分隔符
collection items terminated by '_'  --MAP STRUCT 和 ARRAY 的分隔符(数据分割符号)
map keys terminated by ':'				-- MAP中的key与value的分隔符
lines terminated by '\n';					-- 行分隔符

```


## 实例

1. 创建表，并从 hdfs导数据致hive中


**创建表**

```
create table test(
name string,
friends array<string>,
children map<string, int>,
address struct<street:string, city:string>
)
row format delimited fields terminated by ','
collection items terminated by '_'
map keys terminated by ':'
lines terminated by '\n';

字段解释：
row format delimited fields terminated by ','  -- 列分隔符
collection items terminated by '_'  --MAP STRUCT 和 ARRAY 的分隔符(数据分割符号)
map keys terminated by ':'				-- MAP中的key与value的分隔符
lines terminated by '\n';					-- 行分隔符

```




**hdfs导数据至hive表** 

```

load data inpath 'hdfs://scm-server:8020/user/admin/test1.txt' overwrite into table test

```


**从本地导数据至hive表**

```

load local data inpath '/user/admin/test1.txt' overwrite into table tablename


```


test1.txt 的数据集

**建库** 

```
create database  if not exist dbname


```

建库指定位置

```

create database if not exists db_hive_02 location '/user/text/db_hive_02.db';


```


常用hive命令

```

## 展示所有库
show databases;

##展示所有表


show tables;


## 描述库

desc database dbname;


##描述表

desc tablename;

## 删库
drop database dbname;

drop database if exists db_hive_02;



## 删表
drop table

## 显示表名的分区

show partitions 表名;
## 创建数据表
use xxdb; create table xxx;              #内部表
#创建一个表，结构与其他一样
create table xxx like xxx;
#创建一个表，结构数据与其他一样，相当于复制一个表
create table xxx as xxx;
#创建内部表，制定分隔符为tab键
create table tb_name(name1 int,name2 string) row format delimited fields terminated by '\t';

#创建外部表
创建外部表，制定分隔符为tab键
create external table tb_name(name1 int,name2 string) row format delimited fields terminated by '\t';


#创建分区表
创建分区：分区依据（Id int）
create table tb_name(
    id int,
    name string
) partitioned by (Id int) 
    row format delimited fields terminated by '\t';
普通表和分区表区别：有大量数据增加的需要建分区表


内外表转换

内部表转外部表
alter table table-name set TBLPROPROTIES('EXTERNAL'='TURE');

外部表转内部表
alter table table-name set TBLPROPROTIES('EXTERNAL'='FALSE');

删除分区
#注意：若是外部表，则还需要删除文件（hadoop fs -rm -r -f hdfspath）
alter table table_name drop if exists partitions (d='2016-07-01');

# 加载数据列表
把本地数据装载到数据表，也就是在metastore上创建信息
load data local inpath '/root/a.txt' into table tb_name;
把HDFS上的数据装载到数据表
load data inpath '/target.txt' into table tb_name;

加载数据到分区表必须指明所属分区
load data local inpath './book.txt' overwrite into table tb_name partition (Id = 10);


# 重命名表名
ALTER TABLE 表名1 RENAME TO 表名2;
# 删除表
drop table 表名;
drop table if exists 表名;

# 插入表数据
向有分区的表插入数据
（1）覆盖现有分区数据，如果没有该指定分区，新建该分区，并且插入数据
INSERT OVERWRITE TABLE 库名.表名 PARTITION(dt='2018-09-12',name='Tom', ...)
SELECT ... FROM 库名.表名 where...

（2）向现有的分区插入数据 (之前的数据不会被覆盖)
INSERT INTO TABLE 库名.表名 PARTITION(dt='2018-09-12',name='Tom',...)
SELECT ... FROM 库名.表名  WHERE ...


#向无分区的表插入数据
(1) 覆盖原有表里的数据，命令和有分区的表类似，只是去掉后面的PARTITION（dt=’ ‘,name=’ '）
INSERT OVERWRITE TABLE 库名.表名 
SELECT ... FROM 库名.表名 where...


(2) 向现有的表插入数据 (之前的数据不会被覆盖)
INSERT INTO TABLE 库名.表名 
SELECT ... FROM 库名.表名  WHERE ...

#表结构修改
增加字段
alter table table_name add columns(newscol1 int conment '新增')；

修改字段
alter table table_name change col_name new_col_name new_type;

删除字段

删除字段（COLUMNS中只放保留的字段）
alter table table_name replace columns(col1 int,col2 string,col3string);

字段类型

tinyint ，smallint，int，bigint，float，decimal，boolean，string
复合数据类型

struct，array，map
分桶表
hive.enforce.bucketing = true;

创建一个桶：
# 按（id）分为4个bucket 
create table tb_name ( 
    id int, 
    name string 
) clustered by (id) into 4 buckets 
    row format delimited fields terminated by ',';

    通过子查询插入数据：
insert into tb_name1 select * from tb_name;


创建一个视图

create view v_name as 
  select table1.column1, table2.column2, table3.column3 
  where table1.column1 = table2.column2;



```
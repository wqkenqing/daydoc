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

### 数据导入



**1. 向表中装载数据（Load)**

```

load data [local] inpath '/opt/module/datas/student.txt' [overwrite] into table student [partition (partcol1=val1,…)];
（1）load data:表示加载数据
（2）local:表示从本地加载数据到hive表；否则从HDFS加载数据到hive表
（3）inpath:表示加载数据的路径
（4）overwrite:表示覆盖表中已有数据，否则表示追加
（5）into table:表示加载到哪张表
（6）student:表示具体的表
（7）partition:表示上传到指定分区
```

2. **通过查询语句向表中插入数据（Insert）**

```
insert overwrite table student partition(month='201708') select id, name from student where month='201709';
```

3. **查询语句中创建表并加载数据（As Select）**

```
create table if not exists student3 as select id, name from student;
```

**4. 创建表时通过 Location 指定加载数据路径**

```
create table if not exists student5(id int, name string)row format delimited fields terminated by '\t' location '/user/hive/warehouse/student5';
```

5. **Import 数据到指定 Hive 表中**

```
import table student2 partition(month='201709') from '/user/hive/warehouse/export/student';
```

数据导出

```
1. 1. 将查询的结果导出到本地

      hive (default)> insert overwrite local directory '/opt/module/datas/export/student' select * from student;

   2. 将查询的结果格式化导出到本地

      hive (default)> insert overwrite local directory '/opt/module/datas/export/student1'
      ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
      select * from student;

   3. 将查询的结果导出到HDFS 上(没有 local)

      hive (default)> insert overwrite directory '/user/atguigu/student2'
      ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
      select * from student;

2. **Hadoop 命令导出到本地**

   hive (default)> dfs -get /user/hive/warehouse/student/month=201709/000000_0 /opt/module/datas/export/student3.txt;

3. **Hive Shell 命令导出**

   [hadoop102 hive]$ bin/hive -e 'select * from default.student;' >> /opt/module/datas/export/student4.txt;

4. **Export 导出到 HDFS 上**

   hive (default)> export table default.student to '/user/hive/warehouse/export/student';

5. **Sqoop 导出**
```

### 排序

1. Order By：全局排序，一个 Reducer

2. Sort By：每个 Reducer 内部进行排序，对全局结果集来说不是排序。

   1. 设置reduce 个数

      hive (default)> set mapreduce.job.reduces=3;

   2. 查看设置 reduce 个数

      hive (default)> set mapreduce.job.reduces;

   3. 根据部门编号降序查看员工信息

      hive (default)> insert overwrite local directory '/opt/module/datas/sortby' select * from emp sort by deptno desc;

3. Distribute By：类似 MR 中 partition，进行分区，结合 sort by 使用。注意，Hive 要求 DISTRIBUTE BY 语句要写在SORT BY 语句之前。

   对于 distribute by 进行测试，一定要分配多 reduce 进行处理，否则无法看到 distribute by的效果。 

注意

```
在公司中，order by 是不建议使用的，效率太低了！！！在数据特别少时可以使用。生产环境中数据过多，放一个reducer中排序，一般一个reducer是根本跑不成功的，会报错。下文我们会对 order by 进行优化，即引入sort by、distribute by 等。
 
  Hive 中可以针对 order by 设置使用模式，严格模式（即hive.mapred.mode = strict）下，只要使用了 order by，在运行时就会直接报错的，order by子句必须后跟一个 limit 子句。如果将hive.mapred.mode设置为非限制，则不需要限制子句。原因是为了强加所有结果的总顺序，必须有一个redcue对最终输出进行排序。如果输出中的行数太大，则单个还原器可能需要很长时间才能完成。
```

**sort by 按什么规则分区：**

1. 使用 sort by 时，通常会跟 `distribute by` 字段一起连用，通过 distribute by 来指定`分区规则`。
2. 当不指定分区规则时(只使用sort by )，则使用`默认的内部算法进行分区`。

```
如果按照查询语句中的某个字段进行分区。因为字段的不确定性，很大可能会导致数据倾斜，所以单独使用 sort by 不使用 distribute by 指定分区规则的话，它采用内部默认算法进行分区
```

**Distribute By(指定分区规则)**

```
Distribute By：类似 MR 中 partition，进行分区，结合 sort by 使用。注意，Hive 要求 DISTRIBUTE BY 语句要写在SORT BY 语句之前。

对于 distribute by 进行测试，一定要分配多 reduce 进行处理，否则无法看到 distribute by的效果。 
```

**Cluster By**

当 distribute by 和 sorts by 字段相同时，可以使用 cluster by 方式。

cluster by 除了具有 distribute by 的功能外还兼具 sort by 的功能。但是排序只能是升序排序，不能指定排序规则为 ASC 或者 DESC。



### 查询

hive 解析json

[hive解析json](https://mp.weixin.qq.com/s/awCvlb9BzCRX-Da1_l1FYg)

Hive SQL底层执行过程详细剖析

[Hive SQL底层执行过程详细剖析](https://mp.weixin.qq.com/s?__biz=Mzg2MzU2MDYzOA==&mid=2247485376&idx=1&sn=8fc5bf7e6f5d1f6a4421fd861a0d0fde&chksm=ce77f111f900780755da38430aa74b94aa2bc8ae28f171b2bb5e5a6a6aa915da5338197ad875&cur_album_id=1800525691487076353&scene=189#wechat_redirect)

[hive ](https://mp.weixin.qq.com/s?__biz=Mzg2MzU2MDYzOA==&mid=2247484938&idx=1&sn=06945f65dd49285f276c29759a363fc3&chksm=ce77f0dbf90079cd25adc8a9770d28eefff3e8736c1fa79f01f65c4bfe8b844386753d91452f&cur_album_id=1800525691487076353&scene=190#rd)
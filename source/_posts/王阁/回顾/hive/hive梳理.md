title: hive梳理 
date: 2023-10-27 14:55:42 
tags: []
categories: [回顾]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

###  DDL 建表

#### 内部表

1. 被Hive拥有和管理的托管表（Managed table）。默认情况下创建的表就是内部表，Hive拥有该表的结构和文件
2. 完全管理表（元数据和数据）的生命周期，类似于RDBMS中的表。
3. 删除内部表时，它会删除数据以及表的元数据。

建表语句示例

```
create table demo(
    num int,
    name string,
    sex string,
    age int,
    dept string) 
row format delimited 
fields terminated by ',';
```

#### 外部表

1. **外部表（****External table****）**中的数据不是Hive拥有或管理的，只管理表元数据的生命周期。要创建一个外部表，需要使用EXTERNAL语法关键字。

2. 删除外部表只会删除元数据，而不会删除实际数据。在Hive外部仍然可以访问实际数据。

3. 而且外部表更为方便的是可以搭配location语法指定数据的路径。

建表语句示例

```
create external table demo(
    num int,
    name string,
    sex string,
    age int,
    dept string)
row format delimited
fields terminated by ','
location '/demo';
```

#### 内部表、外部表差异

无论内部表还是外部表，Hive都在Hive Metastore中管理表定义及其分区信息。

1. 删除内部表会从Metastore中删除表元数据，还会从HDFS中删除其所有数据/文件。
2. **删除外部表，只会从Metastore中删除表的元数据**，并保持HDFS位置中的实际数据不变。

![image-20231027150311774](http://img.wqkenqing.ren/typora_img/image-20231027150311774.png)

### 分区表

建表示例语句

```
create table t_demo(
         id int,
         name string,
         hp_max int,
         mp_max int,
         attack_max int,
         defense_max int,
         attack_range string,
         role_main string,
         role_assist string
) partitioned by (skill_type string)
row format delimited
fields terminated by "\t";
```

#### 分区表的作用

支持根据用户指定的字段进行分区，分区的字段可以是日期、地域、种类等具有标识意义的字段。比如把一整年的数据根据月份划分12个月（12个分区），后续就可以查询指定月份分区的数据，尽可能避免了全表扫描查询。

```
select * from t_demo where hp_max>29999
```

例如这个sql。我们晓得这里的筛查是全数据筛查，带来的性能开销较大。使用了分区表，这里可以结合自己的需求，一定程度的优化查询时的效率

#### 分区表的注意事项

1. 分区字段不能是表中已经存在的字段，因为分区字段最终也会以虚拟字段的形式显示在表结构上。
2.  分区表不是建表的必要语法规则，是一种**优化手段**表，可选；分区**字段不能是表中已有的字段**，不能重复；
3.  分区字段是**虚拟字段**，其数据并不存储在底层的文件中；
4.  分区字段值的确定来自于用户价值数据手动指定（**静态分区**）或者根据查询结果位置自动推断（**动态分区**）
5. Hive**支持多重分区**，也就是说在分区的基础上继续分区，划分更加细粒度

#### 分区表的分类

1. 静态分区

   1. 手动指定

2. 动态分区

   ```
   set hive.exec.dynamic.partition=true;
   
   set hive.exec.dynamic.partition.mode=nonstrict;
   
   insert into table t_all_hero_part_dynamic partition(role) select tmp.*,tmp.role_main from t_all_hero tmp;
   ```

   1. 第一个参数表示开启动态分区功能，第二个参数指定动态分区的模式。分为nonstick非严格模式和strict严格模式。strict严格模式要求至少有一个分区为静态分区。动态分区插入时，分区值是根据查询返回字段位置自动推断的。

#### 分区的本质

**不同分区对应着不同的文件夹****，同一分区的数据存储在同一个文件夹下**。只需要根据分区值找到对应的文件夹，扫描本分区下的文件即可，避免全表数据扫描。

#### 多重分区表

多重分区下，**分区之间是一种递进关系****，****可以理解为在前一个分区的基础上继续分区**。从HDFS的角度来看就是**文件夹下继续划分子文件夹**。

```
-单分区表，按省份分区
create table t_user_province (id int, name string,age int) partitioned by (province string);

--双分区表，按省份和市分区
create table t_user_province_city (id int, name string,age int) partitioned by (province string, city string);

--三分区表，按省份、市、县分区
create table t_user_province_city_county (id int, name string,age int) partitioned by (province string, city string,county string);
```

```
load data local inpath '文件路径' into table t_user_province partition(province='shanghai');

load data local inpath '文件路径' into table t_user_province_city_county partition(province='zhejiang',city='hangzhou',county='xiaoshan');

select * from t_user_province_city_county where province='zhejiang' and city='hangzhou';
```

### 分桶表

在分桶时，我们要指定根据哪个字段将数据分为几桶（几个部分）。默认规则是：Bucket number = hash_function(bucketing_column) mod num_buckets。

#### 分通表的语法

```
--分桶表建表语句
CREATE [EXTERNAL] TABLE [db_name.]table_name
[(col_name data_type, ...)]
CLUSTERED BY (col_name)
INTO N BUCKETS;
```

其中CLUSTERED BY (col_name)表示根据哪个字段进行分；INTO N BUCKETS表示分为几桶（也就是几个部分）。需要注意的是，分桶的字段必须是表中已经存在的字段。

```
CREATE TABLE itcast.t_usa_covid19(
    count_date string,
    county string,
    state string,
    fips int,
    cases int,
    deaths int)
CLUSTERED BY(state) INTO 5 BUCKETS;
```

在创建分桶表时，还可以指定分桶内的数据排序规则

```
--根据state州分为5桶 每个桶内根据cases确诊病例数倒序排序
CREATE TABLE itcast.t_usa_covid19_bucket_sort(
      count_date string,
      county string,
      state string,
      fips int,
      cases int,
      deaths int)
CLUSTERED BY(state) sorted by (cases desc) INTO 5 BUCKETS
```

#### 分桶表的数据加载

```
--step1:开启分桶的功能 从Hive2.0开始不再需要设置
set hive.enforce.bucketing=true;

--step2:把源数据加载到普通hive表中
CREATE TABLE itcast.t_usa_covid19(
       count_date string,
       county string,
       state string,
       fips int,
       cases int,
       deaths int)
row format delimited fields terminated by ",";
--将源数据上传到HDFS，t_usa_covid19表对应的路径下
hadoop fs -put us-covid19-counties.dat /user/hive/warehouse/itcast.db/t_usa_covid19

--step3:使用insert+select语法将数据加载到分桶表中
insert into t_usa_covid19_bucket select * from t_usa_covid19;
```

#### 分桶表的使用好处

1.  基于分桶字段查询时，减少全表扫描，这点跟分区表类似
2. JOIN时可以提高MR程序效率，减少笛卡尔积数量
3.  分桶表数据进行抽样



### 视图（view）

跟关系型数据库的视图差不多一个意思。注意用法。

### 物化视图

后面再研究

### DDL 其它用法

#### database

1. create database
2. DESCRIBE DATABASE/SCHEMA [EXTENDED] db_name;
3. use database_name;
4. DROP (DATABASE|SCHEMA) [IF EXISTS] database_name [RESTRICT|CASCADE];
5. alter database

```
CREATE (DATABASE|SCHEMA) [IF NOT EXISTS] database_name 
[COMMENT database_comment]
[LOCATION hdfs_path]
[WITH DBPROPERTIES (property_name=property_value, ...)];
```



#### table

1. describe

   1. ```
      describe formatted [db_name.]table_name;
      describe extended [db_name.]table_name;
      ```

2. drop table

   1. ```
      DROP TABLE [IF EXISTS] table_name [PURGE];    -- (Note: PURGE available in Hive 0.14.0 and later)
      ```

3. Truncate table

   1. ```
      TRUNCATE [TABLE] table_name;
      
      ```

4. alter

   1. ```
      --1、更改表名
      ALTER TABLE table_name RENAME TO new_table_name;
      --2、更改表属性
      ALTER TABLE table_name SET TBLPROPERTIES (property_name = property_value, ... );
      --更改表注释
      ALTER TABLE student SET TBLPROPERTIES ('comment' = "new comment for student table");
      --3、更改SerDe属性
      ALTER TABLE table_name SET SERDE serde_class_name [WITH SERDEPROPERTIES (property_name = property_value, ... )];
      ALTER TABLE table_name [PARTITION partition_spec] SET SERDEPROPERTIES serde_properties;
      ALTER TABLE table_name SET SERDEPROPERTIES ('field.delim' = ',');
      --移除SerDe属性
      ALTER TABLE table_name [PARTITION partition_spec] UNSET SERDEPROPERTIES (property_name, ... );
      
      --4、更改表的文件存储格式 该操作仅更改表元数据。现有数据的任何转换都必须在Hive之外进行。
      ALTER TABLE table_name  SET FILEFORMAT file_format;
      --5、更改表的存储位置路径
      ALTER TABLE table_name SET LOCATION "new location";
      
      --6、更改列名称/类型/位置/注释
      CREATE TABLE test_change (a int, b int, c int);
      // First change column a's name to a1.
      ALTER TABLE test_change CHANGE a a1 INT;
      // Next change column a1's name to a2, its data type to string, and put it after column b.
      ALTER TABLE test_change CHANGE a1 a2 STRING AFTER b;
      // The new table's structure is:  b int, a2 string, c int.
      // Then change column c's name to c1, and put it as the first column.
      ALTER TABLE test_change CHANGE c c1 INT FIRST;
      // The new table's structure is:  c1 int, b int, a2 string.
      // Add a comment to column a1
      ALTER TABLE test_change CHANGE a1 a1 INT COMMENT 'this is column a1';
      
      --7、添加/替换列
      --使用ADD COLUMNS，您可以将新列添加到现有列的末尾但在分区列之前。
      --REPLACE COLUMNS 将删除所有现有列，并添加新的列集。
      ALTER TABLE table_name ADD|REPLACE COLUMNS (col_name data_type,...);
      
      ```

#### paritition

1. add partition

   1. ```
      --1、增加分区
      ALTER TABLE table_name ADD PARTITION (dt='20170101') location
          '/user/hadoop/warehouse/table_name/dt=20170101'; 
      --一次添加一个分区
      
      ALTER TABLE table_name ADD PARTITION (dt='2008-08-08', country='us') location '/path/to/us/part080808' PARTITION (dt='2008-08-09', country='us') location '/path/to/us/part080809';  
      --一次添加多个分区
      ```

2. rename

   1. ```
      --2、重命名分区
      ALTER TABLE table_name PARTITION partition_spec RENAME TO PARTITION partition_spec;
      ALTER TABLE table_name PARTITION (dt='2008-08-09') RENAME TO PARTITION (dt='20080809');
      ```

3. delete partition

   1. ```
      --3、删除分区
      ALTER TABLE table_name DROP [IF EXISTS] PARTITION (dt='2008-08-08', country='us');
      ALTER TABLE table_name DROP [IF EXISTS] PARTITION (dt='2008-08-08', country='us') PURGE; --直接删除数据 不进垃圾桶
      ```

   2. 
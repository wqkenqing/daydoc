title: hive梳理 
date: 2023-10-27 14:55:42 
tags: []
categories: [回顾]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

## 2、DDL 建表

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

3. *delete partition* 

   1. ```
      --3、删除分区
      ALTER TABLE table_name DROP [IF EXISTS] PARTITION (dt='2008-08-08', country='us');
      ALTER TABLE table_name DROP [IF EXISTS] PARTITION (dt='2008-08-08', country='us') PURGE; --直接删除数据 不进垃圾桶
      ```

4. ### msck partition

   1. 修复分区

      ```
      MSCK [REPAIR] TABLE table_name [ADD/DROP/SYNC PARTITIONS];
      ```

### show 显示语法

```
--1、显示所有数据库 SCHEMAS和DATABASES的用法 功能一样
show databases;
show schemas;

--2、显示当前数据库所有表/视图/物化视图/分区/索引
show tables;
SHOW TABLES [IN database_name]; --指定某个数据库

--3、显示当前数据库下所有视图
Show Views;
SHOW VIEWS 'test_*'; -- show all views that start with "test_"
SHOW VIEWS FROM test1; -- show views from database test1
SHOW VIEWS [IN/FROM database_name];

--4、显示当前数据库下所有物化视图
SHOW MATERIALIZED VIEWS [IN/FROM database_name];

--5、显示表分区信息，分区按字母顺序列出，不是分区表执行该语句会报错
show partitions table_name;

--6、显示表/分区的扩展信息
SHOW TABLE EXTENDED [IN|FROM database_name] LIKE table_name;
show table extended like student;

--7、显示表的属性信息
SHOW TBLPROPERTIES table_name;
show tblproperties student;

--8、显示表、视图的创建语句
SHOW CREATE TABLE ([db_name.]table_name|view_name);
show create table student;

--9、显示表中的所有列，包括分区列。
SHOW COLUMNS (FROM|IN) table_name [(FROM|IN) db_name];
show columns  in student;

--10、显示当前支持的所有自定义和内置的函数
show functions;

--11、Describe desc
--查看表信息
desc extended table_name;
--查看表信息（格式化美观）
desc formatted table_name;
--查看数据库相关信息
describe database database_name;
```

## 3、DML DQL

### hive加载数据的方式

1. 可以直接通过hadoop fs -put 的方式，将数据上传至指定路径下

2. 通过load的方式，将数据移动到hive表对应的位置。

示例语句: 

```
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]

LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)] [INPUTFORMAT 'inputformat' SERDE 'serde'] (3.0 or later)
```

#### filepath

​	filepath表示的待移动数据的路径，可以引用一个文件（在这种情况下，Hive将文件移动到表中），也可以是一个目录（在这种情况下，Hive将把该目录中的所有文件移动到表中）。

​	相对路径，例如：project/data1 

​	绝对路径，例如：/user/hive/project/data1 

​	具有schema的完整URI，例如：hdfs://namenode:9000/user/hive/project/data1

#### local

如果指定了LOCAL， load命令将在本地文件系统中查找文件路径。如果指定了相对路径，它将相对于用户的当前工作目录进行解释。

用户也可以为本地文件指定完整的URI-例如：[file:///user/hive/project/data1](file:///user/hive/project/data1)。

注意，如果对HiveServer2服务运行此命令。这里的**本地文件系统指的是Hiveserver****2服务所在机器的本地Linux文件系统**，不是Hive客户端所在的本地文件系统。

#### OVERWRITE 

如果使用了OVERWRITE关键字，则目标表（或者分区）中的内容会被删除，然后再将 filepath 指向的文件/目录中的内容添加到表/分区中。 

```
--------练习:Load Data From Local FS or HDFS------
--step1:建表
--建表student_local 用于演示从本地加载数据
create table student_local(num int,name string,sex string,age int,dept string) row format delimited fields terminated by ',';
--建表student_HDFS  用于演示从HDFS加载数据
create external table student_HDFS(num int,name string,sex string,age int,dept string) row format delimited fields terminated by ',';
--建表student_HDFS_p 用于演示从HDFS加载数据到分区表
create table student_HDFS_p(num int,name string,sex string,age int,dept string) partitioned by(country string) row format delimited fields terminated by ',';

--建议使用beeline客户端 可以显示出加载过程日志信息
--step2:加载数据
-- 从本地加载数据  数据位于HS2（node1）本地文件系统  本质是hadoop fs -put上传操作
LOAD DATA LOCAL INPATH '/root/hivedata/students.txt' INTO TABLE student_local;

--从HDFS加载数据  数据位于HDFS文件系统根目录下  本质是hadoop fs -mv 移动操作
--先把数据上传到HDFS上  hadoop fs -put /root/hivedata/students.txt /
LOAD DATA INPATH '/students.txt' INTO TABLE student_HDFS;

----从HDFS加载数据到分区表中并制定分区  数据位于HDFS文件系统根目录下
--先把数据上传到HDFS上 hadoop fs -put /root/hivedata/students.txt /
LOAD DATA INPATH '/students.txt' INTO TABLE student_HDFS_p partition(country ="CHina");
```

**hive3.0 Load新特性**

```
-------hive 3.0 load命令新特性------------------
CREATE TABLE if not exists tab1 (col1 int, col2 int)
PARTITIONED BY (col3 int)
row format delimited fields terminated by ',';

LOAD DATA LOCAL INPATH '/root/hivedata/tab1.txt' INTO TABLE tab1;
--tab1.txt内容如下
11,22,1
33,44,2
```

本来加载的时候没有指定分区，语句是报错的，但是文件的格式符合表的结构，前两个是col1,col2,最后一个是分区字段col3，则此时会将load语句转换成为insert as select语句。

在Hive3.0中，还支持使用inputformat、SerDe指定任何Hive输入格式，例如文本，ORC等。

### DML-Insert插入数据

### RDBMS中insert使用（insert+values）

在MySQL这样的RDBMS中，通常是insert+values的方式来向表插入数据，并且速度很快。这也是RDBMS中插入数据的核心方式。

但在hive中会比较慢，因为底层启用的是mapreduce，每一次启用的开销会比较大。

### insert **+** select

Hive中insert主要是结合select查询语句使用，将查询结果插入到表中，例如：

```
INSERT OVERWRITE TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...) [IF NOT EXISTS]] select_statement1 FROM from_statement;

INSERT INTO TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...)] select_statement1 FROM from_statement;
```

INSERT OVERWRITE将覆盖表或分区中的任何现有数据。

需要保证查询结果列的数目和需要插入数据表格的列数目一致。

如果查询出来的数据类型和插入表格对应的列数据类型不一致，将会进行转换，但是不能保证转换一定成功，转换失败的数据将会为NULL。

```
--step1:创建一张源表student
drop table if exists student;
create table student(num int,name string,sex string,age int,dept string)
row format delimited
fields terminated by ',';
--加载数据
load data local inpath '/root/hivedata/students.txt' into table student;

--step2：创建一张目标表  只有两个字段
create table student_from_insert(sno int,sname string);
--使用insert+select插入数据到新表中
insert into table student_from_insert select num,name from student;

select *
from student_insert1;
```

**multiple inserts 多重插入**

multiple inserts可以翻译成为多次插入，多重插入，核心是：一次扫描，多次插入。其功能也体现出来了就是减少扫描的次数。

```
------------multiple inserts----------------------
--当前库下已有一张表student
select * from student;
--创建两张新表
create table student_insert1(sno int);
create table student_insert2(sname string);
--多重插入
from student
insert overwrite table student_insert1
select num
insert overwrite table student_insert2
select name;
```

**dynamic partition insert动态分区插入**

```
create table student_HDFS_p(Sno int,Sname string,Sex string,Sage int,Sdept string) partitioned by(country string) row format delimited fields terminated by ',';
--注意 分区字段country的值是在导入数据的时候手动指定的 China
LOAD DATA INPATH '/students.txt' INTO TABLE student_HDFS_p partition(country ="China");
```

### Hive Transaction事务



### 4、 DML-Update Delete更新、删除数据



### 5、 DQL-Select

#### 基础查询

语法树示例

```
[WITH CommonTableExpression (, CommonTableExpression)*] 
SELECT [ALL | DISTINCT] select_expr, select_expr, ...
  FROM table_reference
  [WHERE where_condition]
  [GROUP BY col_list]
  [ORDER BY col_list]
  [CLUSTER BY col_list
    | [DISTRIBUTE BY col_list] [SORT BY col_list]
  ]
 [LIMIT [offset,] rows]
```

```
--step1:创建普通表t_usa_covid19
drop table itcast.t_usa_covid19;
CREATE TABLE itcast.t_usa_covid19(
       count_date string,
       county string,
       state string,
       fips int,
       cases int,
       deaths int)
row format delimited fields terminated by ",";
--将源数据load加载到t_usa_covid19表对应的路径下
load data local inpath '/root/hivedata/us-covid19-counties.dat' into table t_usa_covid19;

--step2:创建一张分区表 基于count_date日期,state州进行分区
CREATE TABLE itcast.t_usa_covid19_p(
     county string,
     fips int,
     cases int,
     deaths int)
partitioned by(count_date string,state string)
row format delimited fields terminated by ",";

--step3:使用动态分区插入将数据导入t_usa_covid19_p中
set hive.exec.dynamic.partition.mode = nonstrict;

insert into table t_usa_covid19_p partition (count_date,state)
select county,fips,cases,deaths,count_date,state from t_usa_covid19;
```

1. 每个select_expr表示您要检索的列。必须至少有一个 select_expr。

2. ####  **ALL 、DISTINCT**

   1. ALL和DISTINCT选项指定是否应返回重复的行。如果没有给出这些选项，则默认值为ALL（返回所有匹配的行）。DISTINCT指定从结果集中删除重复的行。

3. ####  **WHERE**

   1. WHERE条件是一个布尔表达式。在WHERE表达式中，您可以使用Hive支持的任何函数和运算符，但聚合函数除外。

   2. ```
      select * from t_usa_covid19_p where state ="California" and deaths > 1000;
      select * from t_usa_covid19_p where 1 > 2;  -- 1 > 2 返回false
      select * from t_usa_covid19_p where 1 = 1;  -- 1 = 1 返回true
      
      --where条件中使用函数 找出州名字母超过10个
      select * from t_usa_covid19_p where length(state) >10 ;
      
      --WHERE子句支持子查询
      SELECT *
      FROM A
      WHERE A.a IN (SELECT foo FROM B);
      
      --where条件中不能使用聚合函数
      --报错 SemanticException:Not yet supported place for UDAF 'sum'
      select state,sum(deaths)
      from t_usa_covid19_p where sum(deaths) >100 group by state;
      ```

   3. 那么为什么不能在where子句中使用聚合函数呢？

      因为**聚合函数要使用它的前提是结果集已经确定。而****where子句还处于“确定”结果集的过程中，因而不能使用****聚合****函数**。

4. ####  **分区查询、分区裁剪**

   1. 通常，SELECT查询将扫描整个表（所谓的全表扫描）。如果使用PARTITIONED BY子句创建的分区表，则在查询时可以指定分区查询，减少全表扫描，也叫做分区裁剪。
   2. 所谓分区裁剪指的是：对分区表进行查询时，会检查WHERE子句或JOIN中的ON子句中是否存在对分区字段的过滤，如果存在，则仅访问查询符合条件的分区，即裁剪掉没必要访问的分区。

   ```
   --找出来自加州，累计死亡人数大于1000的县 state字段就是分区字段 进行分区裁剪 避免全表扫描
   select * from t_usa_covid19_p where state ="California" and deaths > 1000;
   
   --多分区裁剪
   select * from t_usa_covid19_p where count_date = "2021-01-28" and state ="California" and deaths > 1000;
   ```

5. ####  **GROUP BY**

   1. GROUP BY 语句用于结合聚合函数，根据一个或多个列对结果集进行分组。需要注意的是，出现在GROUP BY中select_expr的字段：**要么是GROUP BY分组的字段****；****要么是被聚合函数应用的字段****。**原因很简单，避免出现一个字段多个值的歧义。

      ```
      --根据state州进行分组
      
      --SemanticException:Expression not in GROUP BY key 'deaths'
      --deaths不是分组字段 报错
      --state是分组字段 可以直接出现在select_expr中
      select state,deaths
      from t_usa_covid19_p where count_date = "2021-01-28" group by state;
      
      --被聚合函数应用
      select state,count(deaths)
      from t_usa_covid19_p where count_date = "2021-01-28" group by state;
      ```

6. Having

   在SQL中增加HAVING子句原因是，WHERE关键字无法与聚合函数一起使用。

​		HAVING子句可以让我们筛选分组后的各组数据,并且可以在Having中使用聚合函数，因为此时where，group by已经执行结束，结果集已经确定。

```
--having
--统计死亡病例数大于10000的州
--where语句中不能使用聚合函数 语法报错
select state,sum(deaths)
from t_usa_covid19_p
where count_date = "2021-01-28" and sum(deaths) >10000 group by state;

--先where分组前过滤（此处是分区裁剪），再进行group by分组（含聚合）， 分组后每个分组结果集确定 再使用having过滤
select state,sum(deaths)
from t_usa_covid19_p
where count_date = "2021-01-28"
group by state
having sum(deaths) > 10000;

--这样写更好 即在group by的时候聚合函数已经作用得出结果 having直接引用结果过滤 不需要再单独计算一次了
select state,sum(deaths) as cnts
from t_usa_covid19_p
where count_date = "2021-01-28"
group by state
having cnts> 10000;
```

​		having与where的区别:

​		having是在分组后对数据进行过滤

​		where是在分组前对数据进行过滤

​		having后面可以使用聚合函数

​		where后面不可以使用聚合

7. LIMIT

   1. LIMIT子句可用于约束SELECT语句返回的行数。

      LIMIT接受一个或两个数字参数，这两个参数都必须是非负整数常量。

      第一个参数指定要返回的第一行的偏移量（从 Hive 2.0.0开始），第二个参数指定要返回的最大行数。当给出单个参数时，它代表最大行数，并且偏移量默认为0。

    **Hive** **SQL查询执行顺序**

   ```
   SELECT [ALL | DISTINCT] select_expr, select_expr, ...  FROM table_reference  [WHERE where_condition]  [GROUP BY col_list]  [ORDER BY col_list]  [CLUSTER BY col_list   | [DISTRIBUTE BY col_list] [SORT BY col_list]  ]  [LIMIT [offset,] rows]
   ```

   在查询过程中执行顺序：**from>where>group（含聚合）>having>order>select**。

   所以聚合语句(sum,min,max,avg,count)要比having子句优先执行，而where子句在查询过程中执行优先级别优先于聚合语句(sum,min,max,avg,count)。

   

   

   #### 高阶查询

   #### 1.   **SORT/ORDER/CLUSTER/DISTRIBUTE BY**

   1.1  ORDER BY

   ORDER BY [ASC|DESC]

   Hive SQL中的ORDER BY语法类似于SQL语言中的ORDER BY语法。会对输出的结果进行全局排序，因此底层使用MapReduce引擎执行的时候，只会有一个reducetask执行。也因此，如果输出的行数太大，会导致需要很长的时间才能完成全局排序。

   默认排序顺序为升序（ASC），也可以指定为DESC降序。

   在Hive 2.1.0和更高版本中，支持在“ order by”子句中为每个列指定null类型结果排序顺序。ASC顺序的默认空排序顺序为NULLS FIRST，而DESC顺序的默认空排序顺序为NULLS LAST。

   ```
   ---order by
   --根据字段进行排序
   select * from t_usa_covid19_p
   where count_date = "2021-01-28"
   and state ="California"
   order by deaths; --默认asc null first
   
   select * from t_usa_covid19_p
   where count_date = "2021-01-28"
   and state ="California"
   order by deaths desc; --指定desc null last
   
   --强烈建议将LIMIT与ORDER BY一起使用。避免数据集行数过大
   --当hive.mapred.mode设置为strict严格模式时，使用不带LIMIT的ORDER BY时会引发异常。
   select * from t_usa_covid19_p
   where count_date = "2021-01-28"
     and state ="California"
   order by deaths desc
   limit 3;
   ```

   1.2  **CLUSTER** **BY**

   SELECT expression… FROM table CLUSTER BY col_name;

   Hive SQL中的**CLUSTER** **BY**语法可以指定根据后面的字段将数据分组，每组内再根据这个字段正序排序（不允许指定排序规则），概况起来就是：**根据同一个字段，分且排序**。

   分组的规则hash散列。hash_func(col_name) % reduce task nums

   分为几组取决于reduce task的个数。下面在Hive beeline客户端中针对student表进行演示。

```
--cluster by
select * from student;
--不指定reduce task个数
--日志显示：Number of reduce tasks not specified. Estimated from input data size: 1
select * from student cluster by sno;

--手动设置reduce task个数
set mapreduce.job.reduces =2;
select * from student cluster by sno;
```

1.3  **DISTRIBUTE BY** **+****SORT BY**

**CLUSTER BY****=****DISTRIBUTE BY +SORT BY****（字段一样）**

![CleanShot 2023-10-30 at 15.41.46@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-10-30%20at%2015.41.46@2x.png)

![CleanShot 2023-10-30 at 15.42.14@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-10-30%20at%2015.42.14@2x.png)

#### 1.4 Union联合查询

UNION用于将来自多个SELECT语句的结果合并为一个结果集。语法如下：

```
select_statement UNION [ALL | DISTINCT] select_statement UNION [ALL | DISTINCT] select_statement ...
```

使用DISTINCT关键字与只使用UNION默认值效果一样，都会删除重复行。

使用ALL关键字，不会删除重复行，结果集包括所有SELECT语句的匹配行（包括重复行）。

1.2.0之前的Hive版本仅支持UNION ALL，在这种情况下不会消除重复的行。

每个select_statement返回的列的数量和名称必须相同。

```
--union
--使用DISTINCT关键字与使用UNION默认值效果一样，都会删除重复行。
select num,name from student_local
UNION
select num,name from student_hdfs;
--和上面一样
select num,name from student_local
UNION DISTINCT
select num,name from student_hdfs;

--使用ALL关键字会保留重复行。
select num,name from student_local
UNION ALL
select num,name from student_hdfs;

--如果要将ORDER BY，SORT BY，CLUSTER BY，DISTRIBUTE BY或LIMIT应用于单个SELECT
--请将子句放在括住SELECT的括号内
SELECT sno,sname FROM (select sno,sname from student_local LIMIT 2) subq1
UNION
SELECT sno,sname FROM (select sno,sname from student_hdfs LIMIT 3) subq2

--如果要将ORDER BY，SORT BY，CLUSTER BY，DISTRIBUTE BY或LIMIT子句应用于整个UNION结果
--请将ORDER BY，SORT BY，CLUSTER BY，DISTRIBUTE BY或LIMIT放在最后一个之后。
select sno,sname from student_local
UNION
select sno,sname from student_hdfs
order by sno desc;
```

#####   **from子句中子查询**

在Hive0.12版本，仅在FROM子句中支持子查询。而且必须要给子查询一个名称，因为FROM子句中的每个表都必须有一个名称。

子查询返回结果中的列必须具有唯一的名称。子查询返回结果中的列在外部查询中可用，就像真实表的列一样。子查询也可以是带有UNION的查询表达式。Hive支持任意级别的子查询，也就是所谓的嵌套子查询。

Hive 0.13.0和更高版本中的子查询名称之前可以包含可选关键字“ AS” 。

```
--from子句中子查询（Subqueries）
--子查询
SELECT num
FROM (
         select num,name from student_local
     ) tmp;

--包含UNION ALL的子查询的示例
SELECT t3.name
FROM (
         select num,name from student_local
         UNION distinct
         select num,name from student_hdfs
     ) t3;
```

where 子句中的子查询

```
--where子句中子查询（Subqueries）
--不相关子查询，相当于IN、NOT IN,子查询只能选择一个列。
--（1）执行子查询，其结果不被显示，而是传递给外部查询，作为外部查询的条件使用。
--（2）执行外部查询，并显示整个结果。　　
SELECT *
FROM student_hdfs
WHERE student_hdfs.num IN (select num from student_local limit 2);

--相关子查询，指EXISTS和NOT EXISTS子查询
--子查询的WHERE子句中支持对父查询的引用
SELECT A
FROM T1
WHERE EXISTS (SELECT B FROM T2 WHERE T1.X = T2.Y);
```

CTE 

公用表表达式（CTE）是一个临时结果集，该结果集是从WITH子句中指定的简单查询派生而来的，该查询紧接在SELECT或INSERT关键字之前。

CTE仅在单个语句的执行范围内定义。一个或多个CTE可以在Hive SELECT，INSERT，  CREATE TABLE AS SELECT或CREATE VIEW AS SELECT语句中使用。

**Join连接查询**

在这种情况下，有时需要基于多张表查询才能得到最终完整的结果，SQL中join语法的出现是**用于根据两个或多个表中的列之间的关系，从这些表中共同组合查询数据**，因此有时为了得到完整的结果，我们就需要执行 join。

Hive作为面向分析的数据仓库软件，为了更好的支持数据分析的功能丰富，也实现了join的语法，整体上来看和RDBMS中的join语法类似，只不过在某些点有自己的特色。需要特别注意。

### **Hive join语法**

在**Hive**中，当下版本3.1.2总共支持**6种join语法**。分别是：

1. **inner** join（内连接）
2. **left** join（左连接）
3. **right** join（右连接）
4. **full outer** join（全外连接）

、、、l**eft semi** join（左半开连接）、**cross** join（交叉连接，也叫做笛卡尔乘积）。

**语法丰富**

```
从Hive 0.13.0开始，支持隐式联接表示法（请参阅HIVE-5558）。这允许FROM子句连接以逗号分隔的表列表，而省略JOIN关键字。
```

```
SELECT *
FROM table1 t1, table2 t2, table3 t3
WHERE t1.id = t2.id AND t2.id = t3.id AND t1.zipcode = '02535';
```

从Hive 2.2.0开始，支持ON子句中的复杂表达式，支持不相等连接（请参阅HIVE-15211和HIVE-15251）。在此之前，Hive不支持不是相等条件的联接条件。

```
SELECT a.* FROM a JOIN b ON (a.id = b.id)
SELECT a.* FROM a JOIN b ON (a.id = b.id AND a.department = b.department)
SELECT a.* FROM a LEFT OUTER JOIN b ON (a.id <> b.id)
```

###  **join查询数据环境准备**
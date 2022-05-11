
## 调研结果
通过具体调研，本次迭代能直接通过sqoop直接实现的任务有
1. mysql to hbase (单表)
2. mysql to hive (单表)
3. mysql to hive (整库)
4. hive to mysql （单表）

其它则在数据治理模块中的任务编排功能实现后，再借助任务编排功能实现
具体有
mysql to hbase （整库）
hbase to mysql 
hive to mysql(整库)


sqoop执行环境：
192.168.10.100 
user：root
password: HyYg123


## mysql to hbase


### 单表导入

sqoop import \
--connect jdbc:mysql://192.168.10.210:3306/hy_hydd \
--username yg_reader \
--password yg987654321 \
--table t_user \
--hbase-table  test:t_user \
--column-family info \
--delete-target-dir \
--hbase-create-table \
--hbase-row-key id \
--hbase-bulkload

支持覆盖

### 整库导入

sqoop import-all-tables --connect jdbc:mysql://192.168.10.210:3306/hy_hydd --driver com.mysql.jdbc.Driver --username 'yg_reader' --password 'yg987654321' --hbase-create-table --hbase-table 'test:hy_hydd' --column-family 'info' --hbase-bulkload

sqoop mysql to hbase的效果是直接导入到一个表中（该库中的所有表，都导入到一个表中）


## hbase to mysql 

无法直接导出,需要借助hive、hdfs等策略


## mysql to hive 


### 单表导入

```
sqoop import \
--connect jdbc:mysql://192.168.10.210:3306/hy_hydd \
--username yg_reader \
--password yg987654321 \
--table t_user \
-m 1 \
--hive-import \
--hive-table t_user \
--hive-overwrite \
--create-hive-table \
--fields-terminated-by ',' \
--lines-terminated-by '\n'


```



### 全库导入

sqoop  import-all-tables -Dorg.apache.sqoop.splitter.allow_text_splitter=true    --connect jdbc:mysql://192.168.10.210:3306/$db --username yg_reader --password yg987654321 --hive-database   $db   --hive-import --hive-overwrite  -m 1


## hive to myqsl 

### 单表

sqoop export --connect jdbc:mysql://192.168.10.210:3306/hive_test --table t_user --username root --password yg987654321 --hcatalog-table t_user 

### 整库


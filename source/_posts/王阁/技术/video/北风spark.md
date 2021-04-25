 ---
 title:  北风spark
 date: 2020-07-22
 tags: [spark,sparksql]
 ---

 <!--more-->

## 新特性

Q:spark2.x 与spark1.x相比新增的一些新特性

1. DataFrame 与DataSet进行统一,DataFrame即是DataSet<Row>类型别名

2. SparkSession统一sqlContext与HiveContext 新的上下文入口

3. DataSet的增强聚合api

4. 支持sql 2003标准

5. 支持子查询

6. sparkmlib 转成DataSet api ,rdd api转为维护.

7. structured streaming

8. Dstream 支持 kafka 0.11.0

## 移除部份功能

spark2.X 不支持hadoop2.1之前的版本

spark2.X 慢慢移除java7




## spark sql(spark2.0)

sql&DataSet api


### SparkSession


### DataFrame


#### 创建临时视图

#### 持久化

#### 逻辑执行计划

explain()

#### Dataset与Dataframe的转换

java code
df.as(Encoder encoder)

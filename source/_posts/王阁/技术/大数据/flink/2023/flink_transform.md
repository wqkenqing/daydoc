title:  flink_transform
date:  2023年 2月22日
tags: [flink、transform]
password: 7FKBKZrTTTPG2LnC

---

本文主要针对常用的算子，以记录，展示为主，Time & Window或有涉及，但或弱化，另会有专门的文章进行相关说明

 <!--more-->

# Flink Transform



## 1、基本转换算子

1. map

2. flatmap

3. filter

4. reduce

5. aggregation

   1. keyBy
   2. sun()
   3. max()
   4. minBy()

6. UDF

   1. 特点是相应的算子+Function名称组成基本函数

   2. 特点是相应的Rich+算子+Function组成富函数（较前者有更多的状态与属性）

      1. Rich Function 有生命周期的概念。典型的生命周期方法有

         1. open()方法，是RichFunction的初始化方法，也就是会开启一个算子的生命周期。当

            一个算子的实际工作方法例如 map()或者 filter()方法被调用之前，open()会首先被调 用。所以像文件 IO 的创建，数据库连接的创建，配置文件的读取等等这样一次性的 工作，都适合在 open()方法中完成。

         2. close()方法，是生命周期中的最后一个调用的方法，类似于解构方法。一般用来做一 些清理工作。

         3. 实例参考 [FlinkSource](./FlinkSource.md) 中的MysqlReader的实例

7. 分区算子

   1. 逻辑分区

      1. keyBy

   2. 物理分区

      1. 物理分区与 keyBy 另一大区别在于，keyBy 之后得到的是一个 KeyedStream，而物理分 区之后结果仍是 DataStream，且流中元素数据类型保持不变。从这一点也可以看出，分区算子 并不对数据进行转换处理，只是定义了数据的传输方式。

      2. 分区策略

         1. 随机分配(Random)
         2. 轮询分配(Round-Robin)
         3. 重缩放(Rescale)
         4. 广播(Broadcast)

      3. 算子

         1.  随机分区(**shuffle**)

            1. 将数据随 机地分配到下游算子的并行任务中去。所以可以把流中的数据随机打乱，均匀地 传递到下游任务分区因为是完全随机的，所以对于同样的输入数据, 每次执 行得到的结果也不会相同。

         2. 轮询分区(**Round-Robin**)

            1. 调用 DataStream 的.rebalance()方法
               1. rebalance 使用的是 Round-Robin 负载均衡算法，可以将输入流数据平均分配到下游的并行任务中去。

         3. 重缩放分区(**rescale**)

            1. 当调用 rescale()方法时实底层也是使用 Round-Robin 算法进行轮询，但是只会将数据轮询发送到下游并行任务的一部分中
            2. 当下游任务(数据接收方)的数量是上游任务(数据发送方)数量的整数倍时，rescale 的效率明显会更高。比如当上游任务数量是 2，下游任务数量是 6 时，上游任务其中一个分区 的数据就将会平均分配到下游任务的 3 个分区中。
            3. 由于 rebalance 是所有分区数据的“重新平衡”，当 TaskManager 数据量较多时，这种跨节 点的网络传输必然影响效率;而如果我们配置的 task slot 数量合适，用 rescale 的方式进行“局 部重缩放”，就可以让数据只在当前 TaskManager 的多个 slot 之间重新分配，从而避免了网络 传输带来的损耗。
            4. 从底层实现上看，rebalance 和 rescale 的根本区别在于任务之间的连接机制不同。rebalance 将会针对所有上游任务(发送数据方)和所有下游任务(接收数据方)之间建立通信通道，这 是一个笛卡尔积的关系;而 rescale 仅仅针对每一个任务和下游对应的部分任务之间建立通信 通道，节省了很多资源

         4. 广播(**broadcast**)

            1. 这种方式其实不应该叫做“重分区”，因为经过广播之后，数据会在不同的分区都保留一 份，可能进行重复处理。可以通过调用 DataStream 的 broadcast()方法，将输入数据复制并发送 到下游算子的所有并行任务中去。

         5. 全局分区(**global**)

            1. 全局分区也是一种特殊的分区方式。这种做法非常极端，通过调用.global()方法，会将所
            2. 有的输入流数据都发送到下游算子的第一个并行子任务中去。这就相当于强行让下游任务并行 度变成了 1，所以使用这个操作需要非常谨慎，可能对程序造成很大的压力。

         6. 自定义分区(**Custom**)

            1. 当 Flink 􏰀供的所有分区策略都不能满足用户的需求时，我们可以通过使用 partitionCustom()方法来自定义分区策略。

               在调用时，方法需要传入两个参数，第一个是自定义分区器(Partitioner)对象，第二个 是应用分区器的字段，它的指定方式与 keyBy 指定 key 基本一样:可以通过字段名称指定， 也可以通过字段位置索引来指定，还可以实现一个 KeySelector。

               

## 2、 部份算子的示例

### 2.1 UDF的算子示例

UDF算子的实现一般有三种方式

1. 支持lambda的方式

   1. 这种方式存在泛型信息被擦除的情况， Flink无法自动推断输出的类型信息,所以要显式的指定类型信息，否则输出将被识为Object类型，这会导致低效的序列化。

   2. .returns()

   3. ```java
          words.flatMap(wordFlatMap).print();
              words.flatMap((String s, Collector<Tuple2<String, Integer>> collector) -> {
                          for (String ss : s.split("\\s+")) {
                              collector.collect(Tuple2.of(ss, 1));
                          }
                      }).returns(Types.TUPLE(Types.STRING, Types.INT))
                      .print();
      ```

   4. 

2. 匿名类

   1. 下面这个示例不算匿名内部类，但有java基础的也能看得明白。

   2. ```java
       FlatMapFunction wordFlatMap = new FlatMapFunction<String, Tuple2<String, Integer>>() {
                  @Override
                  public void flatMap(String s, Collector<Tuple2<String, Integer>> collector) throws Exception {
                      for (String ss : s.split("\\s+")) {
                          collector.collect(Tuple2.of(ss, 1));
                      }
                      ;
                  }
              };
      ```

3. 独立的实现类

   ```java
   package sunrise.demo.function.agg;
   
   import org.apache.flink.api.common.functions.RichMapFunction;
   import org.apache.flink.api.common.state.MapState;
   import org.apache.flink.api.common.state.MapStateDescriptor;
   import org.apache.flink.api.java.tuple.Tuple2;
   import org.apache.flink.configuration.Configuration;
   import sunrise.demo.pojo.CarInfo;
   
   import java.util.Map;
   
   /**
    * @author kuiqwang
    * @emai wqkenqingto@163.com
    * @time 2023/2/9
    * @desc
    */
   
   public class WordMapFunction extends RichMapFunction<Tuple2<String, Integer>, Tuple2<String, Integer>> {
       MapState<String, Integer> mapState = null;
   
       //车辆最后的车速
       @Override
       public void open(Configuration parameters) throws Exception {
           super.open(parameters);
   
           MapStateDescriptor<String, Integer> wordCountMap = new MapStateDescriptor<String, Integer>(
                   "word-count",
                   String.class, Integer.class);
           mapState = getRuntimeContext().getMapState(wordCountMap);
   
       }
   
   
       @Override
       public Tuple2<String, Integer> map(Tuple2<String, Integer> s) throws Exception {
           if (null == mapState.get(s.f0)) {
               mapState.put(s.f0, 1);
           } else {
               mapState.put(s.f0, mapState.get(s.f0) + 1);
           }
           return Tuple2.of(s.f0, mapState.get(s.f0));
       }
   }
   
   ```

---



 


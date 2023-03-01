title:  flink 多流转换
date:  2023年 3月 1日
tags: [flink、stream、转换]
password: 7FKBKZrTTTPG2LnC

---

本文主要用于讲诉一条流怎么转变成多条流等，也比较实用


 <!--more-->

# flink多流转换

> 一般分为分流和合流两个操作

涉及的算子主要有

1. connect
2. join
3. union
4. cogroup

## 1、分流

所谓“分流”，就是将一条数据流拆分成完全独立的两条、甚至多条流。也就是基于一个 DataStream，得到完全平等的多个子 DataStream

实现方式：

1. stream.filter
   1. 缺点，相当于复制了三份流
2. 早期版本有一个spilt()方法
   1. 也可以切分流
3. 侧路输出流
   1. Flink 1.13 版本中，已经弃用了.split()方法，取而代之的是直接用处理函数(process function)的侧输出流(side output)。

```java
package sunrise.demo.stream;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.ProcessFunction;
import org.apache.flink.util.Collector;
import org.apache.flink.util.OutputTag;
import sunrise.demo.function.process.SideProcessFunctionDemo;
import sunrise.demo.pojo.CarInfo;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/16
 * @desc 测试旁路输出
 */
public class SideOutputStreamDemo {


    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        DataStreamSource<String> carStream = env.socketTextStream("localhost", 8883);
        SingleOutputStreamOperator<CarInfo> sideCar= carStream.map(s -> {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(s, CarInfo.class);
        }).returns(TypeInformation.of(CarInfo.class)).process(new SideProcessFunctionDemo());
        OutputTag<CarInfo> littleTag = new OutputTag<CarInfo>("little") {

        };
        OutputTag<CarInfo> bigtag = new OutputTag<CarInfo>("big") {
        };
//        sideCar.getSideOutput(littleTag).print("little-number");
//        sideCar.getSideOutput(bigtag).print("big-number");
        env.execute();
    }
}

```

## 2、合流操作

### 1、联合

最简单的合流操作，就是直接将多条流合在一起，叫作流的“联合”(union)。联合操作要求必须流中的数据类型必须相同，合并之后的新流会包括所有流中的元素， 数据类型不变。

我们只要基于 DataStream 直接调用.union()方法，传入其他 DataStream 作为参数，就可以实现流的联合了;得到的依然是一个 DataStream。这跟sql中的union作用相似

```java
import java.time.Duration;
public class UnionExample {
   public static void main(String[] args) throws Exception {
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
       env.setParallelism(1);
 SingleOutputStreamOperator<Event> stream1 = env.socketTextStream("hadoop102", 7777)
.map(data -> {
String[] field = data.split(",");
return new Event(field[0].trim(), field[1].trim(),
Long.valueOf(field[2].trim()));
             })
             .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forBound
edOutOfOrderness(Duration.ofSeconds(2))
                     .withTimestampAssigner(new
SerializableTimestampAssigner<Event>() {
recordTimestamp) {
}) );
   return element.timestamp;
}
       stream1.print("stream1");
       SingleOutputStreamOperator<Event>
env.socketTextStream("hadoop103", 7777)
stream2 =
@Override
public long extractTimestamp(Event element, long
.map(data -> {
String[] field = data.split(",");
return new Event(field[0].trim(), field[1].trim(),
Long.valueOf(field[2].trim()));
             })
             .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forBound
edOutOfOrderness(Duration.ofSeconds(5))
                    .withTimestampAssigner(new
SerializableTimestampAssigner<Event>() {
@Override
 recordTimestamp) {
}) );
public long extractTimestamp(Event element, long
   return element.timestamp;
}
stream2.print("stream2");
// 合并两条流 stream1.union(stream2)
       .process(new ProcessFunction<Event, String>() {
          @Override
public void processElement(Event value, Context ctx, Collector<String> out) throws Exception {
out.collect(" 水 位 线 : " + ctx.timerService().currentWatermark());
} })
.print();
       env.execute();
   }
}
```

**水位线也还是向左取最小。**

### 连接(Connect)

连接流(ConnectedStreams)

首先基于一条 DataStream 调用.connect()方法，传入另外 一条 DataStream 作为参数，将两条流连接起来，得到一个 ConnectedStreams;然后再调用同处 理方法得到 DataStream。这里可以的调用的同处理方法有.map()/.flatMap()，以及.process()方法。

```java
package sunrise.demo.stream.old;

import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.co.CoMapFunction;
import org.apache.flink.streaming.api.functions.co.RichCoMapFunction;
import org.apache.flink.streaming.api.functions.source.FileProcessingMode;

import java.util.HashMap;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/8
 * @desc
 */
public class CoDemo {
    final static HashMap carID = new HashMap();

    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        DataStreamSource<String> carIdSource = env.readTextFile("/Users/kuiqwang/Desktop/gitfiles/study_record/study-flink/src/main/resources/carFlow_all_column_test.txt").setParallelism(1);
        DataStreamSource<String> socketSource = env.socketTextStream("0.0.0.0", 8882).setParallelism(1);
        CoMapFunction<String, String, String> carCoMapFunction = new RichCoMapFunction<String, String, String>() {
            @Override
            public String map1(String s) throws Exception {
                System.out.printf("carID Map的长度是：" + carID.size());

                System.out.printf("this is res:" + s);
                if (carID.get(s) != null) {
                    String result = (String) carID.get(s);
                    System.out.println("result is : " + result);
                    return result;
                }
                return "this is null";
            }

            @Override
            public String map2(String s) throws Exception {
                String[] infos = s.split(",");
                String carId = infos[2].replace("\'", "");
                String res = infos[2];
                carID.put(carId, res);
                System.out.println("carId's size is :" + carID.entrySet().size());
                return res;
            }

        };
        socketSource.connect(carIdSource).map(carCoMapFunction).broadcast().print();
        env.execute();
    }
}

```

ConnectedStreams 也可以直接调用.keyBy()进行按键分区的操作，得到的 还是一个 ConnectedStreams:

```
connectedStreams.keyBy(keySelector1, keySelector2);
```

#### CoProcessFunction

```
public class BillCheckExample {
   public static void main(String[] args) throws Exception{
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.setParallelism(1);
// 来自 app 的支付日志
SingleOutputStreamOperator<Tuple3<String, String, Long>> appStream =
env.fromElements(
             Tuple3.of("order-1", "app", 1000L),
             Tuple3.of("order-2", "app", 2000L)
       ).assignTimestampsAndWatermarks(WatermarkStrategy.<Tuple3<String,
String, Long>>forMonotonousTimestamps()
             .withTimestampAssigner(new
SerializableTimestampAssigner<Tuple3<String, String, Long>>() {
@Override
public long extractTimestamp(Tuple3<String, String, Long> element, long recordTimestamp) {
                    return element.f2;
                 }
})
);
// 来自第三方支付平台的支付日志
SingleOutputStreamOperator<Tuple4<String, String, String, Long>>
thirdpartStream = env.fromElements(
             Tuple4.of("order-1", "third-party", "success", 3000L),
             Tuple4.of("order-3", "third-party", "success", 4000L)
       ).assignTimestampsAndWatermarks(WatermarkStrategy.<Tuple4<String,
 String, String, Long>>forMonotonousTimestamps()
             .withTimestampAssigner(new
SerializableTimestampAssigner<Tuple4<String, String, String, Long>>() {
@Override
public long extractTimestamp(Tuple4<String, String, String, Long> element, long recordTimestamp) {
                    return element.f3;
                 }
 }) );
// 检测同一支付单在两条流中是否匹配，不匹配就报警 appStream.connect(thirdpartStream)
             .keyBy(data -> data.f0, data -> data.f0)
             .process(new OrderMatchResult())
             .print();
       env.execute();
   }
// 自定义实现 CoProcessFunction
public static class OrderMatchResult extends CoProcessFunction<Tuple3<String, String, Long>, Tuple4<String, String, String, Long>, String>{
 // 定义状态变量，用来保存已经到达的事件
       private ValueState<Tuple3<String, String, Long>> appEventState;
private ValueState<Tuple4<String, String, String, Long>> thirdPartyEventState;
       @Override
       public void open(Configuration parameters) throws Exception {
          appEventState = getRuntimeContext().getState(

 new ValueStateDescriptor<Tuple3<String, String, Long>>("app-event", Types.TUPLE(Types.STRING, Types.STRING, Types.LONG))
);
          thirdPartyEventState = getRuntimeContext().getState(
new ValueStateDescriptor<Tuple4<String, String, String, Long>>("thirdparty-event", Types.TUPLE(Types.STRING, Types.STRING, Types.STRING,Types.LONG))
 ); }
@Override
public void processElement1(Tuple3<String, String, Long> value, Context ctx, Collector<String> out) throws Exception {
// 看另一条流中事件是否来过
if (thirdPartyEventState.value() != null){
out.collect("对 账 成 功 :"+value+" "+ thirdPartyEventState.value());
// 清空状态
             thirdPartyEventState.clear();
          } else {
// 更新状态 appEventState.update(value);
 // 注册一个 5 秒后的定时器，开始等待另一条流的事件
             ctx.timerService().registerEventTimeTimer(value.f2 + 5000L);
          }
}
@Override
public void processElement2(Tuple4<String, String, String, Long> value, Context ctx, Collector<String> out) throws Exception {
if (appEventState.value() != null){
 out.collect("对账成功:" + appEventState.value() + " " + value); // 清空状态
appEventState.clear();
} else {
// 更新状态
thirdPartyEventState.update(value);
// 注册一个 5 秒后的定时器，开始等待另一条流的事件
              ctx.timerService().registerEventTimeTimer(value.f3 + 5000L);
          }
}
@Override
public void onTimer(long timestamp, OnTimerContext ctx, Collector<String> out) throws Exception {
// 定时器触发，判断状态，如果某个状态不为空，说明另一条流中事件没来 if (appEventState.value() != null) {
out.collect("对账失败:" + appEventState.value() + " " + "第三方支付
平台信息未到"); }
if (thirdPartyEventState.value() != null) { out.collect("对账失败:"+thirdPartyEventState.value()+" "+"app
信息未到"); }
        appEventState.clear();
       thirdPartyEventState.clear();
   }
}}
输出结果是:
 对账成功:(order-1,app,1000) (order-1,third-party,success,3000) 对账失败:(order-2,app,2000) 第三方支付平台信息未到

对账失败:(order-3,third-party,success,4000) app信息未到
```

Tiips: 两个流连接后的业务使用。

### 广播连接流(BroadcastConnectedStream)

关于两条流的连接，还有一种比较特殊的用法: DataStream 调用.connect()方法时，传入的 参数也可以不是一个 DataStream，而是一个“广播流”(BroadcastStream)，这时合并两条流得 到的就变成了一个“广播连接流”(BroadcastConnectedStream)。

这种连接方式往往用在需要动态定义􏰁些规则或配置的场景。因为规则是实时变动的，所 以我们可以用一个单独的流来获取规则数据;而这些规则或配置是对整个应用全局有效的，所 以不能只把这数据传递给一个下游并行子任务处理，而是要“广播”(broadcast)给所有的并 行子任务。而下游子任务收到广播出来的规则，会把它保存成一个状态，这就是所谓的“广播 状态”(broadcast state)

广播状态底层是用一个“映射”(map)结构来保存的。在代码实现上，可以直接调用 DataStream 的.broadcast()方法，传入一个“映射状态􏰂述器”(MapStateDescriptor)说明状态 的名称和类型，就可以得到规则数据的“广播流”(BroadcastStream):

```java
public abstract class BroadcastProcessFunction<IN1, IN2, OUT> extends BaseBroadcastProcessFunction {
...
public abstract void processElement(IN1 value, ReadOnlyContext ctx, Collector<OUT> out) throws Exception;
public abstract void processBroadcastElement(IN2 value, Context ctx, Collector<OUT> out) throws Exception;
...
}
```

## 基于时间的合流——双流联结(Join)

### 窗口联结(Window Join)

Flink 为这种场景专门􏰀供了一个窗口联结(window join)算子，可以定义时间窗口，并将两条流中共享一个公共键(key)的数据放在窗口中进行配对处理。

1. 窗口联结的调用

```
窗口联结在代码中的实现，首先需要调用 DataStream 的.join()方法来合并两条流，得到一 个 JoinedStreams;接着通过.where()和.equalTo()方法指定两条流中联结的 key;然后通 过.window()开窗口，并调用.apply()传入联结窗口函数进行处理计算。
```

```
stream1.join(stream2)
   .where(<KeySelector>)
   .equalTo(<KeySelector>)
.window(<WindowAssigner>)
.apply(<JoinFunction>)
```

上面代码中.where()的参数是键选择器(KeySelector)，用来指定第一条流中的 key; 而.equalTo()传入的 KeySelector 则指定了第二条流中的 key。两者相同的元素，如果在同一窗 口中，就可以匹配起来，并通过一个“联结函数”(JoinFunction)进行处理了。

这里.window()传入的就是窗口分配器，之前讲到的三种时间窗口都可以用在这里:滚动 窗口(tumbling window)、滑动窗口(sliding window)和会话窗口(session window)。

而后面调用.apply()可以看作实现了一个特殊的窗口函数。注意这里只能调用.apply()，没有其他替代的方法。

```java
public interface JoinFunction<IN1, IN2, OUT> extends Function, Serializable {
   OUT join(IN1 first, IN2 second) throws Exception;
}
```

**窗口联结的处理流程**





### 间隔联结(Interval Join)

Flink 提供了一种叫作“间隔联结”(interval join)的合流操作。顾 名思义，间隔联结的思路就是针对一条流的每个数据，开辟出其时间戳前后的一段时间间隔， 看这期间是否有来自另一条流的数据匹配。

**间隔联结的原理**

间隔联结具体的定义方式是，我们给定两个时间点，分别叫作间隔的“上界”(upperBound) 和“下界”(lowerBound);于是对于一条流(不妨叫作 A)中的任意一个数据元素 a，就可以 开辟一段时间间隔:[a.timestamp + lowerBound, a.timestamp + upperBound],即以 a 的时间戳为 中心，下至下界点、上至上界点的一个闭区间:我们就把这段时间作为可以匹配另一条流数据 的“窗口”范围。所以对于另一条流(不妨叫 B)中的数据元素 b，如果它的时间戳落在了这 个区间范围内，a 和 b 就可以成功配对，进而进行计算输出结果。所以匹配的条件为:

a.timestamp + lowerBound <= b.timestamp <= a.timestamp + upperBound

这里需要注意，做间隔联结的两条流 A 和 B，也必须基于相同的 key;下界 lowerBound 应该小于等于上界 upperBound，两者都可正可负;间隔联结目前只支持事件时间语义。

**间隔联结的调用**

间隔联结在代码中，是基于 KeyedStream 的联结(join)操作。DataStream 在 keyBy 得到 KeyedStream 之后，可以调用.intervalJoin()来合并两条流，传入的参数同样是一个 KeyedStream， 两者的 key 类型应该一致;得到的是一个 IntervalJoin 类型。后续的操作同样是完全固定的: 先通过.between()方法指定间隔的上下界，再调用.process()方法，定义对匹配数据对的处理操 作。调用.process()需要传入一个处理函数，这是处理函数家族的最后一员:“处理联结函数”ProcessJoinFunction。

```java
stream1
   .keyBy(<KeySelector>)
   .intervalJoin(stream2.keyBy(<KeySelector>))
   .between(Time.milliseconds(-2), Time.milliseconds(1))
   .process (new ProcessJoinFunction<Integer, Integer, String(){
@Override
public void processElement(Integer left, Integer right, Context ctx, Collector<String> out) {
          out.collect(left + "," + right);
       }
})
```

**间隔联结实例**

```java
// 基于间隔的 join
public class IntervalJoinExample {
public static void main(String[] args) throws Exception {
 StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
       env.setParallelism(1);
SingleOutputStreamOperator<Tuple3<String, String, Long>> orderStream = env.fromElements(
             Tuple3.of("Mary", "order-1", 5000L),
             Tuple3.of("Alice", "order-2", 5000L),
              Tuple3.of("Bob", "order-3", 20000L),
             Tuple3.of("Alice", "order-4", 20000L),
             Tuple3.of("Cary", "order-5", 51000L)
       ).assignTimestampsAndWatermarks(WatermarkStrategy.<Tuple3<String,
String, Long>>forMonotonousTimestamps()
             .withTimestampAssigner(new
SerializableTimestampAssigner<Tuple3<String, String, Long>>() {
@Override
public long extractTimestamp(Tuple3<String, String, Long> element, long recordTimestamp) {
}) );
   return element.f2;
}
 SingleOutputStreamOperator<Event> clickStream = env.fromElements(
       new Event("Bob", "./cart", 2000L),
       new Event("Alice", "./prod?id=100", 3000L),
       new Event("Alice", "./prod?id=200", 3500L),
       new Event("Bob", "./prod?id=2", 2500L),
       new Event("Alice", "./prod?id=300", 36000L),
       new Event("Bob", "./home", 30000L),
       new Event("Bob", "./prod?id=1", 23000L),

new Event("Bob", "./prod?id=3", 33000L)
       ).assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forMonotonousT
imestamps()
{
{
@Override
public long extractTimestamp(Event element, long recordTimestamp)
.withTimestampAssigner(new SerializableTimestampAssigner<Event>()
}) );
   return element.timestamp;
}
       orderStream.keyBy(data -> data.f0)
             .intervalJoin(clickStream.keyBy(data -> data.user))
             .between(Time.seconds(-5), Time.seconds(10))
.process(new ProcessJoinFunction<Tuple3<String, String, Long>, Event, String>() {
@Override
public void processElement(Tuple3<String, String, Long> left, Event right, Context ctx, Collector<String> out) throws Exception {
                    out.collect(right + " => " + left);
                 }
}) .print();
   env.execute();
}}
```

### 窗口同组联结(Window CoGroup)

与 window join 的区别在于，调用.apply()方法定义具体操作时，传入的是一个 CoGroupFunction。这也是一个函数类接口，源码中定义如下:

```java
public interface CoGroupFunction<IN1, IN2, O> extends Function, Serializable { void coGroup(Iterable<IN1> first, Iterable<IN2> second, Collector<O> out)
throws Exception;
}
```

内部的.coGroup()方法，有些类似于 FlatJoinFunction 中.join()的形式，同样有三个参数， 分别代表两条流中的数据以及用于输出的收集器(Collector)。不同的是，这里的前两个参数 不再是单独的每一组“配对”数据了，而是传入了可遍历的数据集合。也就是说，现在不会再 去计算窗口中两条流数据集的笛卡尔积，而是直接把收集到的所有数据一次性传入，至于要怎 样配对完全是自定义的。这样.coGroup()方法只会被调用一次，而且即使一条流的数据没有任 何另一条流的数据匹配，也可以出现在集合中、当然也可以定义输出结果了。

所以能够看出，coGroup 操作比窗口的 join 更加通用，不仅可以实现类似 SQL 中的“内 连接”(inner join)，也可以实现左外连接(left outer join)、右外连接(right outer join)和全外 连接(full outer join)。事实上，窗口 join 的底层，也是通过 coGroup 来实现的。



```java
// 基于窗口的 join
public class CoGroupExample {
public static void main(String[] args) throws Exception { StreamExecutionEnvironment env =
StreamExecutionEnvironment.getExecutionEnvironment();
       env.setParallelism(1);
DataStream<Tuple2<String, Long>> stream1 = env
             .fromElements(
                    Tuple2.of("a", 1000L),
                    Tuple2.of("b", 1000L),
                    Tuple2.of("a", 2000L),
                    Tuple2.of("b", 2000L)
             )
             .assignTimestampsAndWatermarks(
                    WatermarkStrategy
                           .<Tuple2<String, Long>>forMonotonousTimestamps()
                           .withTimestampAssigner(
                                 new
SerializableTimestampAssigner<Tuple2<String, Long>>() {
Long> stringLongTuple2, long l) {
} )
@Override
public long extractTimestamp(Tuple2<String,
   return stringLongTuple2.f1;
}
       );
DataStream<Tuple2<String, Long>> stream2 = env
.fromElements(
                    Tuple2.of("a", 3000L),
                    Tuple2.of("b", 3000L),
                    Tuple2.of("a", 4000L),
                    Tuple2.of("b", 4000L)
             )
             .assignTimestampsAndWatermarks(
                    WatermarkStrategy
                           .<Tuple2<String, Long>>forMonotonousTimestamps()
                           .withTimestampAssigner(
                                 new
SerializableTimestampAssigner<Tuple2<String, Long>>() {
@Override

  Long> stringLongTuple2, long l) {
} )
);
       stream1
             .coGroup(stream2)
             .where(r -> r.f0)
public long extractTimestamp(Tuple2<String,
   return stringLongTuple2.f1;
}
.equalTo(r -> r.f0) .window(TumblingEventTimeWindows.of(Time.seconds(5)))
.apply(new CoGroupFunction<Tuple2<String, Long>, Tuple2<String,
Long>, String>() {
                 @Override
public void coGroup(Iterable<Tuple2<String, Long>> iter1, Iterable<Tuple2<String, Long>> iter2, Collector<String> collector) throws Exception {
                    collector.collect(iter1 + "=>" + iter2);
                 }
}) .print();
       env.execute();
   }
}
```


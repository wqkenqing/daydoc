title:  Flink_Process_Function
date:  2023年 2月22日
tags: [flink、transform、process]
password: 7FKBKZrTTTPG2LnC

---

本文讲解的是Flink 分层api中低层的api， process函数的使用

 <!--more-->

# 处理函数



> 在分层的底层，我们可以不定义任何具体的算子，如map、filter、或者window。只是提炼出了一个处理操作(process)。它是所有转换算子的一个概括性的表达，可以自定义处理逻辑，所以这一层接口就被叫作“处理函数”(process function)

## 1、基本处理函数

### 1.1 处理函数的功能和使用

处理函数􏰀供了一个“定时服务” (TimerService)，我们可以通过它访问流中的事件(event)、时间戳(timestamp)、水位线 (watermark)，甚至可以注册“定时事件”。而且处理函数继承了 AbstractRichFunction 抽象类，所以拥有富函数类的所有特性，同样可以访问状态(state)和其他运行时信息。此外，处理函 数还可以直接将数据输出到侧输出流(side output)中。所以，处理函数是最为灵活的处理方 法，可以实现各种自定义的业务逻辑;同时也是整个 DataStream API 的底层基础。

处理函数的使用与基本的转换操作类似，只需要直接基于 DataStream 调用.process()方法 就可以了。方法需要传入一个 ProcessFunction 作为参数，用来定义处理逻辑。

```
 stream.process(new MyProcessFunction())
```

这里 ProcessFunction 不是接口，而是一个抽象类，继承了 AbstractRichFunction; MyProcessFunction 是它的一个具体实现。所以所有的处理函数，都是富函数(RichFunction)， 富函数可以调用的东西这里同样都可以调用。
```java
package sunrise.demo.function.process;

import lombok.extern.slf4j.Slf4j;
import org.apache.flink.streaming.api.functions.ProcessFunction;
import org.apache.flink.util.Collector;
import sunrise.demo.pojo.CarInfo;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/16
 * @desc
 */
@Slf4j
public class ProcessFunctionDemo extends ProcessFunction<CarInfo,CarInfo> {
    @Override
    public void processElement(CarInfo carinfo, ProcessFunction<CarInfo, CarInfo>.Context context, Collector<CarInfo> collector) throws Exception {
        String carNumber = carinfo.getCarNumber();
        Integer number = Integer.valueOf(carNumber.replace("carNo-", ""));
        Integer speed = Integer.valueOf(carinfo.getCarSpeed());
        if (number > 55 && speed > 80) {
            //限定了车牌和车速
            collector.collect(carinfo);
        }
    }
}

```

### ProcessFunction 解析

内部单独定义了两个方法:一个是必须要实现的抽象方法.processElement();另一个是非 抽象方法.onTimer()。

1. 抽象方法.processElement()
   1. 用于“处理元素”，定义了处理的核心逻辑。这个方法对于流中的每个元素都会调用一次， 参数包括三个:输入数据值 value，上下文 ctx，以及“收集器”(Collector)out。方法没有返 回值，处理之后的输出数据是通过收集器 out 来定义的。
   2. value:当前流中的输入元素，也就是正在处理的数据，类型与流中数据类 型一致。
   3. ctx:类型是ProcessFunction中定义的内部抽象类Context，表示当前运行的 上下文，可以获取到当前的时间戳，并􏰀供了用于查询时间和注册定时器的“定时服 务”(TimerService)，以及可以将数据发送到“侧输出流”(side output)的方法.output()。
   4. out:“收集器”(类型为Collector)，用于返回输出数据。使用方式与flatMap 算子中的收集器完全一样，直接调用 out.collect()方法就可以向下游发出一个数据。 这个方法可以多次调用，也可以不调用。
   5. 而通过富函数􏰀供的获取上下文方法.getRuntimeContext()， 也可以自定义状态(state)进行处理，
2. 非抽象方法.onTimer()
   1. 用于定义定时触发的操作，这是一个非常强大、也非常有趣的功能。这个方法只有在注册 好的定时器触发的时候才会调用，而定时器是通过“定时服务”TimerService 来注册的
   2. 打个 比方，注册定时器(timer)就是设了一个闹钟，到了设定时间就会响;而.onTimer()中定义的， 就是闹钟响的时候要做的事。所以它本质上是一个基于时间的“回调”(callback)方法，通过 时间的进展来触发
   3. 定时方法.onTimer()也有三个参数:时间戳(timestamp)，上下 文(ctx)，以及收集器(out)。这里的 timestamp 是指设定好的触发时间，事件时间语义下当然就是水位线了。另外这里同样有上下文和收集器，所以也可以调用定时服务(TimerService)， 以及任意输出处理之后的数据。
   4. 我们也可以看到，处理函数都是基于事件触发的。水位线就如同插入流中的一条数据一样; 只不过处理真正的数据事件调用的是.processElement()方法，而处理水位线事件调用的 是.onTimer()。
   5. 我们也可以看到，处理函数都是基于事件触发的。水位线就如同插入流中的一条数据一样; 只不过处理真正的数据事件调用的是.processElement()方法，而处理水位线事件调用的 是.onTimer()。

### 处理函数的分类

我们知道，DataStream 在调用一些转换方法之后，有可能生成新的流类型;例如调 用.keyBy()之后得到 KeyedStream，进而再调用.window()之后得到 WindowedStream。对于不同 类型的流，其实都可以直接调用.process()方法进行自定义处理，这时传入的参数就都叫作处理 函数

Flink 提供了 8 个不同的处理函数

1. ProcessFunction

   1. ```java
      最基本的处理函数，基于 DataStream 直接调用.process()时作为参数传入。
      ```

2. KeyedProcessFunction

   1. 对流按键分区后的处理函数，基于 KeyedStream 调用.process()时作为参数传入。要想使用 定时器，比如基于 KeyedStream。

3. ProcessWindowFunction

   1. 开窗之后的处理函数，也是全窗口函数的代表。基于 WindowedStream 调用.process()时作 为参数传入。

4. ProcessAllWindowFunction

   1. 同样是开窗之后的处理函数，基于 AllWindowedStream 调用.process()时作为参数传入。

5. CoProcessFunction

   1. 合并(connect)两条流之后的处理函数，基于 ConnectedStreams 调用.process()时作为参 数传入。关于流的连接合并操作

6. ProcessJoinFunction

   1. 间隔连接(interval join)两条流之后的处理函数，基于 IntervalJoined 调用.process()时作为 参数传入。

7. BroadcastProcessFunction

   1. 广播连接流处理函数，基于 BroadcastConnectedStream 调用.process()时作为参数传入。这 里的“广播连接流”BroadcastConnectedStream，是一个未 keyBy 的普通 DataStream 与一个广 播流(BroadcastStream)做连接(conncet)之后的产物。

8. KeyedBroadcastProcessFunction

   1. 按键分区的广播连接流处理函数，同样是基于 BroadcastConnectedStream 调用.process()时 作为参数传入。与 BroadcastProcessFunction 不同的是，这时的广播连接流，是一个 KeyedStream 与广播流(BroadcastStream)做连接之后的产物。

## 2、按键分区处理函数

### 2.1 定时器(Timer)和定时服务(TimerService)

KeyedProcessFunction 的一个特色，就是可以灵活地使用定时器。

定时器(timers)是处理函数中进行时间相关操作的主要机制。注册定时器的功能，是通过上下文中􏰀供的“定时服务”(TimerService)来实现的

TimerService 是 Flink 关于时间和定时器的基础服务接口,定时服务与当前运行的环境有关。前面已经介绍过，ProcessFunction 的上下文(Context)中提供了.timerService()方法，可以直接返回一个 TimerService 对象

```
public abstract TimerService timerService();
```

**TimerService**

```java
// 获取当前的处理时间
long currentProcessingTime();
// 获取当前的水位线(事件时间) long currentWatermark();
// 注册处理时间定时器，当处理时间超过 time 时触发 void registerProcessingTimeTimer(long time);
// 注册事件时间定时器，当水位线超过 time 时触发 void registerEventTimeTimer(long time);
// 删除触发时间为 time 的处理时间定时器
void deleteProcessingTimeTimer(long time);
// 删除触发时间为 time 的处理时间定时器 void deleteEventTimeTimer(long time);
```

基于处理时间和基于事件时间。而对应的操作主要有三个:获 取当前时间，注册定时器，以及删除定时器。

**要注意，尽管处理函数中都可以直接访问 TimerService，不过只有基于 KeyedStream 的处理函数，才能去调用注册和删除定时器的方法; 未作按键分区的 DataStream 不支持定时器操作，只能获取当前时间**

一个时间戳上的定时器只会触发一次。

基于 KeyedStream 注册定时器时，会传入一个定时器触发的时间戳，这个时间戳的定时器 对于每个 key 都是有效的。这样，我们的代码并不需要做额外的处理，底层就可以直接对不同 key 进行独立的处理操作了。

利用这个特性，有时我们可以故意降低时间戳的精度，来减少定时器的数量，从而􏰀高处 理性能。比如我们可以在设置定时器时只保留整秒数，那么定时器的触发频率就是最多 1 秒一 次。

```
long coalescedTime = time / 1000 * 1000;
ctx.timerService().registerProcessingTimeTimer(coalescedTime);
```

Flink 的定时器同样具有容错性，它和状态一起都会被保存到一致性检查点(checkpoint) 中。当发生故障时，Flink 会重启并读取检查点中的状态，恢复定时器。如果是处理时间的定 时器，有可能会出现已经“过期”的情况，这时它们会在重启时被立刻触发。



### KeyedProcessFunction的使用

KeyedProcessFunction 可以说是处理函数中的“嫡系部队”，可以认为是 ProcessFunction 的 一个扩展。我们只要基于 keyBy 之后的 KeyedStream，直接调用.process()方法，这时需要传入 的参数就是 KeyedProcessFunction 的实现类。

```java
stream.keyBy( t -> t.f0 )
       .process(new MyKeyedProcessFunction())
```

```java
package sunrise.demo.window;

import org.apache.flink.api.common.eventtime.SerializableTimestampAssigner;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import sunrise.demo.function.process.KeyedProcessFunctionDemo;
import sunrise.demo.pojo.Event;
import sunrise.demo.stream.api.source.CustomSource;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/16
 * @desc
 */
public class KeyedProcessDemo {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.addSource(new CustomSource()).assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forMonotonousTimestamps().withTimestampAssigner(new SerializableTimestampAssigner<Event>() {
            @Override
            public long extractTimestamp(Event event, long l) {
                return event.getTimestamp();
            }
        })).keyBy(Event::getUser).process(new KeyedProcessFunction<String, Event, String>() {

            @Override
            public void processElement(Event event, KeyedProcessFunction<String, Event, String>.Context context, Collector<String> collector) throws Exception {
                collector.collect("数据到达，时间戳为:" + context.timestamp());
                collector.collect(" 数 据 到 达 ， 水 位 线 为 : " + context.timerService().currentWatermark() + "\n -------分割线-------");
                context.timerService().registerEventTimeTimer(context.timestamp() + 10 * 1000L);
            }

            @Override
            public void onTimer(long timestamp, KeyedProcessFunction<String, Event, String>.OnTimerContext ctx, Collector<String> out) throws Exception {
                super.onTimer(timestamp, ctx, out);
                out.collect("定时器触发，触发时间:" + timestamp);
            }
        }).print();
        env.execute();
    }
}

```



## 3. 窗口处理函数

#### 窗口处理函数的使用

窗口处理函数 ProcessWindowFunction 的使用与其他窗口函数类似，也是基于 WindowedStream 直接调用方法就可以

```java
stream.keyBy( t -> t.f0 )
       .window( TumblingEventTimeWindows.of(Time.seconds(10)) )
       .process(new MyProcessWindowFunction())
```

#### ProcessWindowFunction 解析

```java
package sunrise.demo.function.window;

import org.apache.commons.net.ntp.TimeStamp;
import org.apache.flink.streaming.api.functions.windowing.ProcessWindowFunction;
import org.apache.flink.streaming.api.windowing.windows.TimeWindow;
import org.apache.flink.util.Collector;
import scala.collection.Iterable;
import scala.collection.immutable.List;
import sunrise.demo.pojo.CarInfo;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

/**
 * @author kuiqwang
 * @emai wqkenqingto@163.com
 * @time 2023/2/16
 * @desc
 */
public class CarCountProcessWindowFunction extends ProcessWindowFunction<CarInfo,String,String, TimeWindow> {


    @Override
    public void process(String s, ProcessWindowFunction<CarInfo, String, String, TimeWindow>.Context context, java.lang.Iterable<CarInfo> iterable, Collector<String> collector) throws Exception {
        Set<String> carSet = new HashSet<String>();
        for (CarInfo car : iterable) {
            carSet.add(car.getCarNumber());
        }
        long start = context.window().getStart();
        long end = context.window().getEnd();

        collector.collect("窗口:" + new Timestamp(start) + "~" + new Timestamp(end) + "的过车数是：" + carSet.size());

    }
}

```

```java
public abstract class ProcessWindowFunction<IN, OUT, KEY, W extends Window>
       extends AbstractRichFunction {
...
public abstract void process(
KEY key, Context context, Iterable<IN> elements, Collector<OUT> out) throws
Exception;
public void clear(Context context) throws Exception {}
   public abstract class Context implements java.io.Serializable {...}
}
```

ProcessWindowFunction 依然是一个继承了 AbstractRichFunction 的抽象类，它有四个类型 参数:

1. IN:input，数据流中窗口任务的输入数据类型。

2. OUT:output，窗口任务进行计算之后的输出数据类型。

3. OUT:output，窗口任务进行计算之后的输出数据类型。

4. W:窗口的类型，是Window的子类型。一般情况下我们定义时间窗口，W 就是 TimeWindow。

   

```
public abstract class Context implements java.io.Serializable {
   public abstract W window();
   public abstract long currentProcessingTime();
   public abstract long currentWatermark();
   public abstract KeyedStateStore windowState();
   public abstract KeyedStateStore globalState();
   public abstract <X> void output(OutputTag<X> outputTag, X value);
}
```

### 侧输出流(Side Output)

```java
DataStream<Integer> stream = env.addSource(...);
SingleOutputStreamOperator<Long> longStream = stream.process(new ProcessFunction<Integer, Long>() {
@Override
public void processElement( Integer value, Context ctx, Collector<Integer> out) throws Exception {
// 转换成 Long，输出到主流中
out.collect(Long.valueOf(value));
// 转换成 String，输出到侧输出流中
ctx.output(outputTag, "side-output: " + String.valueOf(value));
} });
DataStream<String> stringStream = longStream.getSideOutput(outputTag);
```










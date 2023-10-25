title:  Flink_Time_Window
date:  2023年 2月22日
tags: [flink、time、window]
password: 7FKBKZrTTTPG2LnC

---

Flink 中 Time 和window

 <!--more-->

# Flink Time&Window

> Flink擅长的是有状态的无界流的计算，无界流的计算与有界数据的计算的区别就在于，无界流因为没有终止点，所以它的运算也没有终止点，而有界流因为有终止边界，所以运算会有终止点。但无界流可以通过时间等参数进行窗口划分进行计算。所以这里就有了Flink两个重要的概念Time 与Window

## 1、Time

### 1.1 Flink中时间语义与水位线

1. 处理时间(Processing Time)
   1. 窗口任务处理这条数据时，当前的系统时间
2. 事件时间(Event Time)
   1. 事件时间，是指每个事件在对应的设备上发生的时间，也就是数据生成的时间。
3. 水位线(Watermarks)
   1. 由于分布式系统中网络传输延迟的不确定性，实际应用中我们要面对的 数据流往往是乱序的。在这种情况下，就不能简单地把数据自带的时间戳当作时钟了，而需要 用另外的标志来表示事件时间进展，在 Flink 中把它叫作事件时间的“水位线”(Watermarks)。
   2. **一般会采用事件时间语义。而水位线，就是基于事件时间􏰀出的概念.**
   3. 用来衡量事 件时间(Event Time)进展的标记，就被称作“水位线”(Watermark)。
   4. 具体实现上，水位线可以看作一条特殊的数据记录，它是插入到数据流中的一个标记点， 主要内容就是一个时间戳，用来指示当前的事件时间。而它插入流中的位置，就应该是在􏰁个 数据到来之后;这样就可以从这个数据中􏰀取时间戳，作为当前水位线的时间戳了。
   5. 这里的思路其实跟TCP实现中的水位线原理相似，会专门对此进行一个对比。
4. 摄入时间(Ingestion Time)
   1. 它是指数据进入 Flink 数据流的时间，也就是 Source 算子读入数据的时间。摄入时间相当于是 事件时间和处理时间的一个中和，它是把 Source 任务的处理时间，当作了数据的产生时间添 加到数据里。
   2. 这样一来，水位线(watermark)也就基于这个时间直接生成，不需要单独指定 了。这种时间语义可以保证比较好的正确性，同时又不会引入太大的延迟。它的具体行为跟事 件时间非常像，可以当作特殊的事件时间来处理。

### 1.2 水位线

1. **有序流中的水位线**

   1. 在理想状态下，数据应该按照它们生成的先后顺序、排好队进入流中;也就是说，它们处 理的过程会保持原先的顺序不变，遵守先来后到的原则。这样的话我们从每个数据中提取时间戳，就可以保证总是从小到大增长的，从而插入的水位线也会不断增长、事件时钟不断向前推 进。

2. **乱序流中的水位线**

3. **水位线的特性**

   1. 水位线是插入到数据流中的一个标记，可以认为是一个特殊的数据
   2. 水位线主要的内容是一个时间戳，用来表示当前事件时间的进展
   3. 水位线是基于数据的时间戳生成的
   4. 水位线的时间戳必须单调递增，以确保任务的事件时间时钟一直向前推进
   5. 水位线可以通过设置延迟，来保证正确处理乱序数据
   6. 一个水位线 Watermark(t)，表示在当前流中事件时间已经达到了时间戳 t, 这代表 t 之 前的所有数据都到齐了，之后流中不会出现时间戳 t’ ≤ t 的数据

4. **如何生成水位线**

   1. 生成水位线的总体原则

   2. 水位线生成策略(Watermark Strategies)

      1. .assignTimestampsAndWatermarks()

         1. ```java
            public SingleOutputStreamOperator<T> assignTimestampsAndWatermarks(
                   WatermarkStrategy<T> watermarkStrategy)
            ```

         2. ```java
            DataStream<Event> stream = env.addSource(new ClickSource());
            DataStream<Event> withTimestampsAndWatermarks =
            stream.assignTimestampsAndWatermarks(<watermark strategy>);
            ```

         3. .assignTimestampsAndWatermarks()方法需要传入一个 WatermarkStrategy 作为参数,这就是所谓的“水位线生成策略”。WatermarkStrategy 中包含了一个“时间戳分配 器”TimestampAssigner 和一个“水位线生成器”WatermarkGenerator。

            1. ```java
               public interface WatermarkStrategy<T>
                  extends TimestampAssignerSupplier<T>,
                         WatermarkGeneratorSupplier<T>{
               @Override
                  TimestampAssigner<T>
               createTimestampAssigner(TimestampAssignerSupplier.Context context);
               @Override
               WatermarkGenerator<T>
               createWatermarkGenerator(WatermarkGeneratorSupplier.Context context);
               }
               ```

            2. TimestampAssigner:主要负责从流中数据元素的􏰂个字段中􏰀取时间戳，并分配给 元素。时间戳的分配是生成水位线的基础。

            3. WatermarkGenerator:主要负责按照既定的方式，基于时间戳生成水位线。在 WatermarkGenerator 接口中，主要又有两个方法:onEvent()和 onPeriodicEmit()。

            4. onEvent:每个事件(数据)到来都会调用的方法，它的参数有当前事件、时间戳， 以及允许发出水位线的一个 WatermarkOutput，可以基于事件做各种操作

            5. onPeriodicEmit:周期性调用的方法，可以由WatermarkOutput发出水位线。周期时间

               为处理时间，可以调用环境配置的.setAutoWatermarkInterval()方法来设置，默认为

               200ms。

            6. env.getConfig().setAutoWatermarkInterval(60 * 1000L);//自动生成水位线时间间隔

         4. **Flink 内置水位线生成器**

            1. 有序流

               1. 对于有序流，主要特点就是时间戳单调增长(Monotonously Increasing Timestamps)，所以

                  永远不会出现迟到数据的问题。这是周期性生成水位线的最简单的场景，直接调用

                  WatermarkStrategy.forMonotonousTimestamps()方法就可以实现。简单来说，就是直接拿当前最

                  大的时间戳作为水位线就可以了。

               2. ```java
                  stream.assignTimestampsAndWatermarks(
                         WatermarkStrategy.<Event>forMonotonousTimestamps()
                  { {
                  );
                  .withTimestampAssigner(new SerializableTimestampAssigner<Event>()
                  @Override
                  public long extractTimestamp(Event element, long recordTimestamp)
                         return element.timestamp;
                     }
                  })
                  ```

               3. 这里需要注意的是，时间戳和水位线的单位，必须都是毫秒。

            2. 乱序流

               1. 由于乱序流中需要等待迟到数据到齐，所以必须设置一个固定量的延迟时间(Fixed Amount of Lateness)。这时生成水位线的时间戳，就是当前数据流中最大的时间戳减去延迟的 结果，相当于把表调慢，当前时钟会滞后于数据的最大时间戳。调用 WatermarkStrategy. forBoundedOutOfOrderness()方法就可以实现。这个方法需要传入一个 maxOutOfOrderness 参 数，表示“最大乱序程度”，它表示数据流中乱序数据时间戳的最大差值;如果我们能确定乱序 程度，那么设置对应时间长度的延迟，就可以等到所有的乱序数据了

               2. ```java
                  public class WatermarkTest {
                     public static void main(String[] args) throws Exception {
                  StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
                         env.setParallelism(1);
                         env
                  .addSource(new ClickSource()) // 插入水位线的逻辑 .assignTimestampsAndWatermarks(
                  // 针对乱序流插入水位线，延迟时间设置为 5s
                  WatermarkStrategy.<Event>forBoundedOutOfOrderness(Duration.ofSeconds(5))
                                             .withTimestampAssigner(new
                  SerializableTimestampAssigner<Event>() {
                  // 抽取时间戳的逻辑
                  recordTimestamp) {
                  }) .print();
                         env.execute();
                     }
                  }
                  @Override
                  public long extractTimestamp(Event element, long
                     return element.timestamp;
                  }
                  ```

               3. 事实上，有序流的水位线生成器本质上和乱序流是一样的，相当于延迟设为 0 的乱序流水 位线生成器，两者完全等同:

               4. ```java
                  WatermarkStrategy.forMonotonousTimestamps()
                  WatermarkStrategy.forBoundedOutOfOrderness(Duration.ofSeconds(0))
                  ```

            3. **自定义水位线策略**

               1. Flink 有两种不同的生成水位线的方式

                  1. 一种是周期性的(Periodic)
                  2. 另一种是断点式的(Punctuated)
                  3. 前者是在每个事件到来时调用，而后者由框架周期性调用。周期性调用的方法中发出水位线，自 然就是周期性生成水位线;而在事件触发的方法中发出水位线，自然就是断点式生成了

               2. 周期性水位线生成器(Periodic Generator)

                  1. ```java
                     public static WatermarkStrategy<Event> {
                     @Override
                     class
                     CustomWatermarkStrategy
                     implements
                     .assignTimestampsAndWatermarks(new CustomWatermarkStrategy())
                     .print();
                            public
                     createTimestampAssigner(TimestampAssignerSupplier.Context context) {
                               return new SerializableTimestampAssigner<Event>() {
                                  @Override
                     TimestampAssigner<Event>
                     135{
                     public long extractTimestamp(Event element, long recordTimestamp)
                     return element.timestamp; // 告诉程序数据源里的时间戳是哪一个字段 }
                     }; }
                     @Override
                            public
                     createWatermarkGenerator(WatermarkGeneratorSupplier.Context context) {
                               return new CustomPeriodicGenerator();
                     WatermarkGenerator<Event>
                     } }
                     public static class CustomPeriodicGenerator implements WatermarkGenerator<Event> {
                     private Long delayTime = 5000L; // 延迟时间
                     private Long maxTs = Long.MIN_VALUE + delayTime + 1L; // 观察到的最大时间戳
                     @Override
                     public void onEvent(Event event, long eventTimestamp, WatermarkOutput output) {
                     // 每来一条数据就调用一次
                     maxTs = Math.max(event.timestamp, maxTs); // 更新最大时间戳 }
                            @Override
                            public void onPeriodicEmit(WatermarkOutput output) {
                     // 发射水位线，默认 200ms 调用一次
                               output.emitWatermark(new Watermark(maxTs - delayTime - 1L));
                            }
                     } }
                     ```

                  2. 断点式水位线生成器(Punctuated Generator)

                     1. 断点式生成器会不停地检测 onEvent()中的事件，当发现带有水位线信息的特殊事件时，

                        就立即发出水位线。一般来说，断点式生成器不会通过 onPeriodicEmit()发出水位线。

                     2. ```
                        public class CustomPunctuatedGenerator implements WatermarkGenerator<Event> {
                        136@Override
                        public void onEvent(Event r, long eventTimestamp, WatermarkOutput output) {
                        // 只有在遇到特定的 itemId 时，才发出水位线 if (r.user.equals("Mary")) {
                               output.emitWatermark(new Watermark(r.timestamp - 1));
                           }
                        }
                        @Override
                        public void onPeriodicEmit(WatermarkOutput output) {
                        // 不需要做任何事情，因为我们在 onEvent 方法中发射了水位线
                        } }
                        ```

            								  4. **在自定义数据源中发送水位线**

                         								  1. 我们也可以在自定义的数据源中抽取事件时间，然后发送水位线。这里要注意的是，在自 定义数据源中发送了水位线以后，就不能再在程序中使用 assignTimestampsAndWatermarks 方 法来生成水位线了。在自定义数据源中生成水位线和在程序中使用 assignTimestampsAndWatermarks 方法生成水位线二者只能取其一。

                         								  2. ```java
                                      public class EmitWatermarkInSourceFunction {
                                         public static void main(String[] args) throws Exception {
                                      StreamExecutionEnvironment env =
                                      StreamExecutionEnvironment.getExecutionEnvironment();
                                             env.setParallelism(1);
                                             env.addSource(new ClickSourceWithWatermark()).print();
                                             env.execute();
                                         }
                                      // 泛型是数据源中的类型
                                      public static class ClickSourceWithWatermark implements SourceFunction<Event> {
                                             private boolean running = true;
                                             @Override
                                      137间戳
                                      public void run(SourceContext<Event> sourceContext) throws Exception { Random random = new Random();
                                      String[] userArr = {"Mary", "Bob", "Alice"};
                                      String[] urlArr = {"./home", "./cart", "./prod?id=1"};
                                      while (running) {
                                      long currTs = Calendar.getInstance().getTimeInMillis(); // 毫秒时
                                      String username = userArr[random.nextInt(userArr.length)]; String url = urlArr[random.nextInt(urlArr.length)];
                                      Event event = new Event(username, url, currTs);
                                      // 使用 collectWithTimestamp 方法将数据发送出去，并指明数据中的时间戳的字段
                                      sourceContext.collectWithTimestamp(event, event.timestamp);
                                      // 发送水位线
                                      sourceContext.emitWatermark(new Watermark(event.timestamp - 1L)); Thread.sleep(1000L);
                                      } }
                                             @Override
                                             public void cancel() {
                                                running = false;
                                             }
                                      } }
                                      
                                      ```

            								  5. **水位线的传递**

                         								  1. 简而言之，向左取最小

            								  6. **水位线的总结**

#### 1.3 窗口

 1. **窗口分类**

    1. **按照驱动类型分类**

       1. 时间窗口(**Time Window**)

          1. 时间窗口以时间点来定义窗口的开始(start)和结束(end)，所以截取出的就是􏰂一时间

             段的数据。到达结束时间时，窗口不再收集数据，触发计算输出结果，并将窗口关闭销毁。所 以可以说基本思路就是“定点发车”。

          2. Flink 中有一个专门的类来表示时间窗口，名称就叫作 TimeWindow。这个类只有两个私 有属性:start 和 end，表示窗口的开始和结束的时间戳，单位为毫秒。

          3. ```
             public long maxTimestamp() {
               return end - 1;
             }
             ```

          4. 如上有一个问题，为什么要 减1 ，后面专项分析解答。

       2. 计数窗口(**Count Window**)

          1. 计数窗口基于元素的个数来截取数据，到达固定的个数时就触发计算并关闭窗口。这相当

             于座位有限、“人满就发车”，是否发车与时间无关。每个窗口截取数据的个数，就是窗口的大 小。

2. **按照窗口分配数据的规则分类**

   1. 滚动窗口(Tumbling Window)
   2. 滑动窗口(Sliding Window)
   3. 会话窗口(Session Window)
   4. 全局窗口(Global Window)

3. window 使用API

   1. 按键分区(Keyed)和非按键分区(Non-Keyed)

      1. 在调用窗口算子之前， 是否有 keyBy 操作.

         1. 按键分区窗口(Keyed Windows)

         2. 经过按键分区 keyBy 操作后，数据流会按照 key 被分为多条逻辑流(logical streams)，这就是 KeyedStream。基于 KeyedStream 进行窗口操作时, 窗口计算会在多个并行子任务上同时 执行。相同 key 的数据会被发送到同一个并行子任务，而窗口操作会基于每个 key 进行单独的 处理。所以可以认为，每个 key 上都定义了一组窗口，各自独立地进行统计计算。

         3. ```java
            stream.keyBy(...)
                  .window(...)
            ```

      2. 非按键分区(Non-Keyed Windows)

         1. 如果没有进行 keyBy，那么原始的 DataStream 就不会分成多条逻辑流。这时窗口逻辑只

            能在一个任务(task)上执行，就相当于并行度变成了 1。所以在实际应用中一般不推荐使用 这种方式。

         2. ```java
            stream.windowAll(...)
            ```

      2. 窗口API的使用

         1. 窗口分配器(Window Assigners)

            1.  时间窗口

               				1. 滚动处理时间窗口

                      				1. ```java
                             stream.keyBy(...)
                             .window(TumblingProcessingTimeWindows.of(Time.seconds(5)))
                             .aggregate(...)
                             ```

                      				2. ```
                             .window(TumblingProcessingTimeWindows.of(Time.days(1), Time.hours(-8)))
                             ```

               				2. 滑动处理时间窗口

                      				1. ```java
                             stream.keyBy(...)
                             .window(SlidingProcessingTimeWindows.of(Time.seconds(10), Time.seconds(5)))
                             .aggregate(...)
                             ```

               				3. 处理时间会话窗口

                      				1. ```java
                             stream.keyBy(...)
                             .window(ProcessingTimeSessionWindows.withGap(Time.seconds(10)))
                             .aggregate(...)
                             ```

                      				2. ```java
                             .window(ProcessingTimeSessionWindows.withDynamicGap(new
                             SessionWindowTimeGapExtractor<Tuple2<String, Long>>() {
                                @Override
                                public long extract(Tuple2<String, Long> element) {
                             // 提取 session gap 值返回, 单位毫秒 return element.f0.length() * 1000;
                             } }))
                             ```

               				4. 滚动事件时间窗口

                      				1. ```java
                             stream.keyBy(...)
                             .window(TumblingEventTimeWindows.of(Time.seconds(5)))
                             .aggregate(...)
                               
                             ```

               				5. 滑动事件时间窗口

                      				1. ```java
                             stream.keyBy(...)
                               .window(SlidingEventTimeWindows.of(Time.seconds(10), Time.seconds(5)))
                               .aggregate(...)
                             ```

               				6. 事件时间会话窗口

                      				1. ```java
                             stream.keyBy(...)
                               .window(EventTimeSessionWindows.withGap(Time.seconds(10)))
                               .aggregate(...)
                             ```

            2. **计数窗口**

               				1. 滚动计数窗口

                      1. ```java
                         stream.keyBy(...)
                              .countWindow(10)
                         ```

               				2. 滑动计数窗口

                      				1. ```java
                             stream.keyBy(...) .countWindow(10，3)
                             ```

               				3. 全局窗口

                      				1. ```
                             stream.keyBy(...)
                                  .window(GlobalWindows.create());
                             ```

                      				2. 需要注意使用全局窗口，必须自行定义触发器才能实现窗口计算，否则起不到任何作用。

            3. 

         2. 窗口函数(Window Functions)。

         ```java
         stream.keyBy(<key selector>) .window(<window assigner>) .aggregate(<window function>)
         ```

#### 窗口函数					

1. 归约函数(**ReduceFunction**)

   1. 窗口的归约聚合也非常类似，就是将窗口中收集到的数据两两进行归约。当我们进行流处 理时，就是要保存一个状态;每来一个新的数据，就和之前的聚合状态做归约，这样就实现了 增量式的聚合。

   2. 窗口函数中也􏰀供了 ReduceFunction:只要基于 WindowedStream 调用.reduce()方法，然 后传入 ReduceFunction 作为参数，就可以指定以归约两个元素的方式去对窗口中数据进行聚 合了。这里的 ReduceFunction 其实与简单聚合时用到的 ReduceFunction 是同一个函数类接口， 所以使用方式也是完全一样的。

   3. ```java
      public class WindowReduceExample {
         public static void main(String[] args) throws Exception {
      StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
             env.setParallelism(1);
      // 从自定义数据源读取数据，并提取时间戳、生成水位线 SingleOutputStreamOperator<Event> stream = env.addSource(new
      ClickSource())
                     .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forBoun
      dedOutOfOrderness(Duration.ZERO)
      {
      {
      Long>>() {
      .withTimestampAssigner(new SerializableTimestampAssigner<Event>()
      @Override
      public long extractTimestamp(Event element, long recordTimestamp)
             return element.timestamp;
         }
      })); stream.map(new MapFunction<Event, Tuple2<String,
      @Override
      public Tuple2<String, Long> map(Event value) throws Exception {
      // 将数据转换成二元组，方便计算
             return Tuple2.of(value.user, 1L);
         }
      })
                   .keyBy(r -> r.f0)
      // 设置滚动事件时间窗口 .window(TumblingEventTimeWindows.of(Time.seconds(5))) .reduce(new ReduceFunction<Tuple2<String, Long>>() {
      @Override
      public Tuple2<String, Long> reduce(Tuple2<String, Long> value1, Tuple2<String, Long> value2) throws Exception {
      // 定义累加规则，窗口闭合时，向下游发送累加结果
                          return Tuple2.of(value1.f0, value1.f1 + value2.f1);
                       }
      })
      154.print();
             env.execute();
         }
      }
      ```

2. 聚合函数(**AggregateFunction**)

   1. Flink的Window API中的aggregate就􏰀供了这样的操作。直接基于WindowedStream调

      用.aggregate()方法，就可以定义更加灵活的窗口聚合操作。这个方法需要传入一个 AggregateFunction 的实现类作为参数

   2. ```java
      public interface AggregateFunction<IN, ACC, OUT> extends Function, Serializable {
         ACC createAccumulator();
         ACC add(IN value, ACC accumulator);
         OUT getResult(ACC accumulator);
         ACC merge(ACC a, ACC b);
      }
      ```

   3. AggregateFunction 可以看作是 ReduceFunction 的通用版本，这里有三种类型:输入类型 (IN)、累加器类型(ACC)和输出类型(OUT)。输入类型 IN 就是输入流中元素的数据类型;累加器类型 ACC 则是我们进行聚合的中间状态类型;而输出类型当然就是最终计算结果的类 型了。

   4. 接口中有四个方法:

      1. createAccumulator():创建一个累加器，这就是为聚合创建了一个初始状态，每个聚 合任务只会调用一次。
      2. add():将输入的元素添加到累加器中。这就是基于聚合状态，对新来的数据进行进 一步聚合的过程。方法传入两个参数:当前新到的数据 value，和当前的累加器 accumulator;返回一个新的累加器值，也就是对聚合状态进行更新。每条数据到来之 后都会调用这个方法。
      3. add():将输入的元素添加到累加器中。这就是基于聚合状态，对新来的数据进行进 一步聚合的过程。方法传入两个参数:当前新到的数据 value，和当前的累加器 accumulator;返回一个新的累加器值，也就是对聚合状态进行更新。每条数据到来之 后都会调用这个方法。
      4. merge():合并两个累加器，并将合并后的状态作为一个累加器返回。这个方法只在 需要合并窗口的场景下才会被调用;最常见的合并窗口(Merging Window)的场景 就是会话窗口(Session Windows)。

   5. AggregateFunction 的工作原理是:首先调用 createAccumulator()为任务初 始化一个状态(累加器);而后每来一个数据就调用一次 add()方法，对数据进行聚合，得到的 结果保存在状态中;等到了窗口需要输出时，再调用 getResult()方法得到计算结果。很明显， 与 ReduceFunction 相同，AggregateFunction 也是增量式的聚合;而由于输入、中间状态、输 出的类型可以不同，使得应用更加灵活方便

      1. ```java
         public class WindowAggregateFunctionExample {
            public static void main(String[] args) throws Exception {
         StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
                env.setParallelism(1);
         SingleOutputStreamOperator<Event> stream = env.addSource(new ClickSource())
                        .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forMono
         tonousTimestamps()
         {
         {
         .withTimestampAssigner(new SerializableTimestampAssigner<Event>()
         @Override
         public long extractTimestamp(Event element, long recordTimestamp)
                      return element.timestamp;
                   }
         }));
         // 所有数据设置相同的 key，发送到同一个分区统计 PV 和 UV，再相除 stream.keyBy(data -> true)
                .window(SlidingEventTimeWindows.of(Time.seconds(10),
         Time.seconds(2)))
                      .aggregate(new AvgPv())
         .print();
                env.execute();
            }
         public static class AvgPv implements AggregateFunction<Event, Tuple2<HashSet<String>, Long>, Double> {
                @Override
                public Tuple2<HashSet<String>, Long> createAccumulator() {
         157// 创建累加器
                   return Tuple2.of(new HashSet<String>(), 0L);
                }
         @Override
         public Tuple2<HashSet<String>, Long> add(Event value, Tuple2<HashSet<String>, Long> accumulator) {
         // 属于本窗口的数据来一条累加一次，并返回累加器 accumulator.f0.add(value.user);
         return Tuple2.of(accumulator.f0, accumulator.f1 + 1L);
         }
                @Override
                public Double getResult(Tuple2<HashSet<String>, Long> accumulator) {
         // 窗口闭合时，增量聚合结束，将计算结果发送到下游
                   return (double) accumulator.f1 / accumulator.f0.size();
                }
         @Override
         public Tuple2<HashSet<String>, Long> merge(Tuple2<HashSet<String>, Long> a, Tuple2<HashSet<String>, Long> b) {
                   return null;
                }
         } }
         ```

   6. 全窗口函数(full window functions)

      1. 窗口操作中的另一大类就是全窗口函数。与增量聚合函数不同，全窗口函数需要先收集窗 口中的数据，并在内部缓存起来，等到窗口要输出结果的时候再取出数据进行计算。
      2. 这就是典型的批处理思路了——先攒数据，等一批都到齐了再正式启动处理流程。 这样做毫无疑问是低效的:因为窗口全部的计算任务都积压在了要输出结果的那一瞬间，而在 之前收集数据的漫长过程中却无所事事。这就好比平时不用功，到考试之前通宵抱佛脚，肯定 不如把工夫花在日常积累上。
      3. 那为什么还需要有全窗口函数呢?这是因为有些场景下，我们要做的计算必须基于全部的 数据才有效，这时做增量聚合就没什么意义了;另外，输出的结果有可能要包含上下文中的一 些信息(比如窗口的起始时间)，这是增量聚合函数做不到的。所以，我们还需要有更丰富的 窗口计算方式，这就可以用全窗口函数来实现。

   7. 全窗口函数也有两种:WindowFunction 和 ProcessWindowFunction。

      1. 窗口函数(**WindowFunction**)

         1. WindowFunction 字面上就是“窗口函数”，它其实是老版本的通用窗口函数接口。我们可 以基于 WindowedStream 调用.apply()方法，传入一个 WindowFunction 的实现类。

         2. ```java
            stream
               .keyBy(<key selector>)
               .window(<window assigner>)
               .apply(new MyWindowFunction());
            ```

         3. 这个类中可以获取到包含窗口所有数据的可迭代集合(Iterable)，还可以拿到窗口 (Window)本身的信息。WindowFunction 接口在源码中实现如下:

         4. ```java
            public interface WindowFunction<IN, OUT, KEY, W extends Window> extends Function, Serializable {
            void apply(KEY key, W window, Iterable<IN> input, Collector<OUT> out) throws Exception;
            }
            ```

            1. 当窗口到达结束时间需要触发计算时，就会调用这里的 apply 方法。我们可以从 input 集 合中取出窗口收集的数据，结合 key 和 window 信息，通过收集器(Collector)输出结果。这 里 Collector 的用法，与 FlatMapFunction 中相同。不过我们也看到了，WindowFunction 能提供的上下文信息较少，也没有更高级的功能。 事实上，它的作用可以被 ProcessWindowFunction 全覆盖，所以之后可能会逐渐弃用。一般在 实际应用，直接使用 ProcessWindowFunction 就可以了。	

      2. 处理窗口函数(**ProcessWindowFunction**)

         1. ProcessWindowFunction 是 Window API 中最底层的通用窗口函数接口。之所以说它“最底层”，是因为除了可以拿到窗口中的所有数据之外，ProcessWindowFunction 还可以获取到一个“上下文对象”(Context)。这个上下文对象非常强大，不仅能够获取窗口信息，还可以访问当 前的时间和状态信息。这里的时间就包括了处理时间(processing time)和事件时间水位线(event time watermark)。这就使得 ProcessWindowFunction 更加灵活、功能更加丰富。

         2. 作为一个全窗口函数， ProcessWindowFunction 同样需要将所有数据缓存下来、等到窗口触发计算时才使用。它其实 就是一个增强版的 WindowFunction。

         3. 具体使用跟 WindowFunction 非常类似，我们可以基于 WindowedStream 调用.process()方 法，传入一个 ProcessWindowFunction 的实现类。

         4. ```java
            public class UvCountByWindowExample {
               public static void main(String[] args) throws Exception {
            StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
                   env.setParallelism(1);
            SingleOutputStreamOperator<Event> stream = env.addSource(new ClickSource())
                         .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forBound
            edOutOfOrderness(Duration.ZERO)
                                .withTimestampAssigner(new
            SerializableTimestampAssigner<Event>() {
            @Override
            public long extractTimestamp(Event element, long
               return element.timestamp;
            }
            }));
            // 将数据全部发往同一分区，按窗口统计 UV
                    stream.keyBy(data -> true)
                         .window(TumblingEventTimeWindows.of(Time.seconds(10)))
                         .process(new UvCountByWindow())
                         .print();
                   env.execute();
               }
            // 自定义窗口处理函数
            public static class UvCountByWindow extends ProcessWindowFunction<Event,
            String, Boolean, TimeWindow>{
                      @Override
            public void process(Boolean aBoolean, Context context, Iterable<Event> elements, Collector<String> out) throws Exception {
            HashSet<String> userSet = new HashSet<>(); // 遍历所有数据，放到 Set 里去重
            for (Event event: elements){
                              userSet.add(event.user);
                         }
            // 结合窗口信息，包装输出内容
                         Long start = context.window().getStart();
                         Long end = context.window().getEnd();
            out.collect(" 窗 口 : " + new Timestamp(start) + " ~ " + new Timestamp(end)
            + " 的独立访客数量是:" + userSet.size());
            }
            161
             } }
            ```

         5. 这里我们使用的是事件时间语义。定义 10 秒钟的滚动事件窗口后，直接使用 ProcessWindowFunction 来定义处理的逻辑。我们可以创建一个 HashSet，将窗口所有数据的 userId 写入实现去重，最终得到 HashSet 的元素个数就是 UV 值。

            当然，这里我们并没有用到上下文中其他信息，所以其实没有必要使用 ProcessWindowFunction。全窗口函数因为运行效率较低，很少直接单独使用，往往会和增量 聚合函数结合在一起，共同实现窗口的处理计算。

      3. **增量聚合和全窗口函数的结合使用**

         1. 增量聚合函数处理计算会更高效。举一个最简单的例子，对一组数据求和。大量的数据连 续不断到来，全窗口函数只是把它们收集缓存起来，并没有处理;到了窗口要关闭、输出结果 的时候，再遍历所有数据依次叠加，得到最终结果。而如果我们采用增量聚合的方式，那么只 需要保存一个当前和的状态，每个数据到来时就会做一次加法，更新状态;到了要输出结果的 时候，只要将当前状态直接拿出来就可以了。增量聚合相当于把计算量“均摊”到了窗口收集 数据的过程中，自然就会比全窗口聚合更加高效、输出更加实时。

         2. 而全窗口函数的优势在于􏰀供了更多的信息，可以认为是更加“通用”的窗口操作。它只 负责收集数据、提供上下文相关信息，把所有的原材料都准备好，至于拿来做什么我们完全可 以任意发挥。这就使得窗口计算更加灵活，功能更加强大。

         3. 我们之前在调用 WindowedStream 的.reduce()和.aggregate()方法时，只是简单地直接传入 了一个 ReduceFunction 或 AggregateFunction 进行增量聚合。除此之外，其实还可以传入第二 个参数:一个全窗口函数，可以是 WindowFunction 或者 ProcessWindowFunction。

         4. ```java
            // ReduceFunction 与 WindowFunction 结合
            public <R> SingleOutputStreamOperator<R> reduce(
                   ReduceFunction<T> reduceFunction, WindowFunction<T, R, K, W> function)
            // ReduceFunction 与 ProcessWindowFunction 结合
            public <R> SingleOutputStreamOperator<R> reduce(
            ReduceFunction<T> reduceFunction, ProcessWindowFunction<T, R, K, W>
            function)
            // AggregateFunction 与 WindowFunction 结合
            public <ACC, V, R> SingleOutputStreamOperator<R> aggregate(
            162AggregateFunction<T, ACC, V> aggFunction, WindowFunction<V, R, K, W> windowFunction)
            // AggregateFunction 与 ProcessWindowFunction 结合
            public <ACC, V, R> SingleOutputStreamOperator<R> aggregate(
                   AggregateFunction<T, ACC, V> aggFunction,
                   ProcessWindowFunction<V, R, K, W> windowFunction)
            ```

         5. ```java
            public class UrlViewCountExample {
               public static void main(String[] args) throws Exception {
            StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
                   env.setParallelism(1);
            SingleOutputStreamOperator<Event> stream = env.addSource(new ClickSource())
                         .assignTimestampsAndWatermarks(WatermarkStrategy.<Event>forMonot
            onousTimestamps()
            163                     .withTimestampAssigner(new
            SerializableTimestampAssigner<Event>() {
            recordTimestamp) {
            @Override
            public long extractTimestamp(Event element, long
                   return element.timestamp;
               }
            }));
             // 需要按照 url 分组，开滑动窗口统计 stream.keyBy(data -> data.url)
                         .window(SlidingEventTimeWindows.of(Time.seconds(10),
            Time.seconds(5)))
            // 同时传入增量聚合函数和全窗口函数
            .aggregate(new UrlViewCountAgg(), new UrlViewCountResult()) .print();
                   env.execute();
               }
            // 自定义增量聚合函数，来一条数据就加一
            public static class UrlViewCountAgg implements AggregateFunction<Event, Long,
            Long> {
                   @Override
                   public Long createAccumulator() {
             return 0L; }
            @Override
            public Long add(Event value, Long accumulator) {
               return accumulator + 1;
            }
            @Override
            164
            public Long getResult(Long accumulator) {
               return accumulator;
            }
            @Override
            public Long merge(Long a, Long b) {
               return null;
            }
            }
            // 自定义窗口处理函数，只需要包装窗口信息
            public static class UrlViewCountResult extends ProcessWindowFunction<Long,
            UrlViewCount, String, TimeWindow> {
            @Override
            public void process(String url, Context context, Iterable<Long> elements, Collector<UrlViewCount> out) throws Exception {
            end)); }
            }
            // 结合窗口信息，包装输出内容
            Long start = context.window().getStart();
            Long end = context.window().getEnd();
            // 迭代器中只有一个元素，就是增量聚合函数的计算结果
            out.collect(new UrlViewCount(url, elements.iterator().next(), start,
            }
            ```

### 其他API

**1. 触发器(Trigger)**

1. 触发器主要是用来控制窗口什么时候触发计算。所谓的“触发计算”，本质上就是执行窗 口函数，所以可以认为是计算得到结果并输出的过程

2. 基于 WindowedStream 调用.trigger()方法，就可以传入一个自定义的窗口触发器(Trigger)。

3. ```java
   stream.keyBy(...)
         .window(...)
         .trigger(new MyTrigger())
   ```

4. Trigger 是窗口算子的内部属性，每个窗口分配器(WindowAssigner)都会对应一个默认 的触发器;对于 Flink 内置的窗口类型，它们的触发器都已经做了实现。例如，所有事件时间 窗口，默认的触发器都是 EventTimeTrigger;类似还有 ProcessingTimeTrigger 和 CountTrigger。 所以一般情况下是不需要自定义触发器的，不过我们依然有必要了解它的原理。

5. Trigger 是一个抽象类，自定义时必须实现下面四个抽象方法:

   1. onElement():窗口中每到来一个元素，都会调用这个方法。
   2. onEventTime():当注册的事件时间定时器触发时，将调用这个方法。
   3. onProcessingTime ():当注册的处理时间定时器触发时，将调用这个方法。
   4. clear():当窗口关闭销毁时，调用这个方法。一般用来清除自定义的状态。

6. 可以看到，除了 clear()比较像生命周期方法，其他三个方法其实都是对􏰂种事件的响应。 onElement()是对流中数据元素到来的响应;而另两个则是对时间的响应。这几个方法的参数中 都有一个“触发器上下文”(TriggerContext)对象，可以用来注册定时器回调(callback)。这 里用到的“定时器”(Timer)，其实就是我们设定的一个“闹钟”，代表未来某个时间点会执行 的事件;当时间进展到设定的值时，就会执行定义好的操作。很明显，对于时间窗口(TimeWindow)而言，就应该是在窗口的结束时间设定了一个定时器，这样到时间就可以触发 窗口的计算输出了。关于定时器的内容，我们在后面讲解处理函数(process function)时还会提到。

   1. 这三个方法返回类型都是 TriggerResult，这是一个枚举类型(enum)， 其中定义了对窗口进行操作的四种类型。

      1. CONTINUE(继续):什么都不做
      2. FIRE(触发):触发计算，输出结果
      3. PURGE(清除):清空窗口中的所有数据，销毁窗口
      4. FIRE_AND_PURGE(触发并清除):触发计算输出结果，并清除窗口

   2. ```java
      public class TriggerExample {
         public static void main(String[] args) throws Exception {
      StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
             env.setParallelism(1);
             env
      .addSource(new ClickSource())
                   .assignTimestampsAndWatermarks(
                          WatermarkStrategy.<Event>forMonotonousTimestamps()
                          .withTimestampAssigner(new
      SerializableTimestampAssigner<Event>() {
      }) )
      @Override
      public long extractTimestamp(Event event, long l) {
         return event.timestamp;
      }
                   .keyBy(r -> r.url)
                   .window(TumblingEventTimeWindows.of(Time.seconds(10)))
                   .trigger(new MyTrigger())
                   .process(new WindowResult())
                   .print();
             env.execute();
         }
      public static class WindowResult extends ProcessWindowFunction<Event, UrlViewCount, String, TimeWindow> {
      @Override
      public void process(String s, Context context, Iterable<Event> iterable, Collector<UrlViewCount> collector) throws Exception {
                collector.collect(
                       new UrlViewCount(
      ) );
      } }
      s,
      // 获取迭代器中的元素个数 iterable.spliterator().getExactSizeIfKnown(), context.window().getStart(), context.window().getEnd()
      171public static class MyTrigger extends Trigger<Event, TimeWindow> {
             @Override
      public TriggerResult onElement(Event event, long l, TimeWindow timeWindow, TriggerContext triggerContext) throws Exception {
                ValueState<Boolean>                  isFirstEvent                  =
      triggerContext.getPartitionedState(
      Types.BOOLEAN)
                );
      new ValueStateDescriptor<Boolean>("first-event", if (isFirstEvent.value() == null) {
      i + 1000L) {
      for (long i = timeWindow.getStart(); i < timeWindow.getEnd(); i =
         triggerContext.registerEventTimeTimer(i);
      }
                   isFirstEvent.update(true);
                }
                return TriggerResult.CONTINUE;
             }
      @Override
      public TriggerResult onEventTime(long l, TimeWindow timeWindow, TriggerContext triggerContext) throws Exception {
                return TriggerResult.FIRE;
             }
      @Override
      public TriggerResult onProcessingTime(long l, TimeWindow timeWindow, TriggerContext triggerContext) throws Exception {
                return TriggerResult.CONTINUE;
             }
      @Override
      public void clear(TimeWindow timeWindow, TriggerContext triggerContext)
      throws Exception {
                ValueState<Boolean>                  isFirstEvent                  =
      triggerContext.getPartitionedState(
      new ValueStateDescriptor<Boolean>("first-event",
      Types.BOOLEAN)
                );
                isFirstEvent.clear();
             }
      } }
      ```

2. **移除器(Evictor)**

   1. 移除器主要用来定义移除􏰂些数据的逻辑。基于 WindowedStream 调用.evictor()方法，就 可以传入一个自定义的移除器(Evictor)。Evictor 是一个接口，不同的窗口类型都有各自预实 现的移除器。

   2. ```java
      stream.keyBy(...)
            .window(...)
            .evictor(new MyEvictor())
      ```

   3. Evictor 接口定义了两个方法:

      1. evictBefore():定义执行窗口函数之前的移除数据操作
      2. evictAfter():定义执行窗口函数之后的以处数据操作

      默认情况下，预实现的移除器都是在执行窗口函数(window fucntions)之前移除数据的。

3. **允许延迟(Allowed Lateness)**

   1. 基于 WindowedStream 调用.allowedLateness()方法，传入一个 Time 类型的延迟时间，就可

       以表示允许这段时间内的延迟数据。

      1. ```
         stream.keyBy(...)
               .window(TumblingEventTimeWindows.of(Time.hours(1)))
               .allowedLateness(Time.minutes(1))
         ```

      				2.  从这里我们就可以看到，窗口的触发计算(Fire)和清除(Purge)操作确实可以分开。不过在默认情况下，允许的延迟是 0，这样一旦水位线到达了窗口结束时间就会触发计算并清除 窗口，两个操作看起来就是同时发生了。当窗口被清除(关闭)之后，再来的数据就会被丢弃。

4. **将迟到的数据放入侧输出流**

   1. 基于 WindowedStream 调用.sideOutputLateData() 方法，就可以实现这个功能。方法需要 传入一个“输出标签”(OutputTag)，用来标记分支的迟到数据流。因为保存的就是流中的原 始数据，所以 OutputTag 的类型与流中数据类型相同。

      1. ```java
         DataStream<Event> stream = env.addSource(...);
         OutputTag<Event> outputTag = new OutputTag<Event>("late") {};
         stream.keyBy(...)
               .window(TumblingEventTimeWindows.of(Time.hours(1)))
              .sideOutputLateData(outputTag)
         ```

### 窗口的生命周期

1. 窗口的创建

   1. 窗口的类型和基本信息由窗口分配器(window assigners)指定，但窗口不会预先创建好，

      而是由数据驱动创建。当第一个应该属于这个窗口的数据元素到达时，就会创建对应的窗口。

2. 窗口计算的触发

3. 窗口的销毁


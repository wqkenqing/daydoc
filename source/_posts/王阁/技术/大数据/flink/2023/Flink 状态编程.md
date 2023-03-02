title:  Flink状态编程
date:  2023年 3月 1日
tags: [flink、状态、编程]
password: 7FKBKZrTTTPG2LnC

---

 <!--more-->

# 状态编程

## 1、托管状态

1. 托管状态(Managed State)
2. 原始状态(Raw State)

Flink 的状态有两种:托管状态(Managed State)和原始状态(Raw State)。

托管状态就是 由 Flink 统一管理的，状态的存储访问、故障恢复和重组等一系列问题都由 Flink 实现，我们只要调接口就可以;而原始状态则是自定义的，相当于就是开辟了一块内存，需要我们自己管理，实现状态的序列化和故障恢复。

托管状态是由 Flink 的运行时(Runtime)来托管的;在配置容错机制后，状 态会自动持久化保存，并在发生故障时自动恢复。当应用发生横向扩展时，状态也会自动地重 组分配到所有的子任务实例上。对于具体的状态内容，Flink 也提供了

1. 值状态(ValueState)
2.  列表状态(ListState)
3. 映射状态(MapState)
4. 聚合状态(AggregateState)等多种结构，内部 支持各种数据类型。聚合、窗口等算子中内置的状态，就都是托管状态;我们也可以在富函数 类(RichFunction)中通过上下文来自定义状态，这些也都是托管状态。



托管状态分为两类:算子状态和按键分区状态。

(1)算子状态(Operator State)

算子状态可以用在所有算子上，使用的时候其实就跟一个本地变量没什么区别——因为本 地变量的作用域也是当前任务实例。在使用时，我们还需进一步实现 CheckpointedFunction 接 口。

(2)按键分区状态(Keyed State)

状态是根据输入流中定义的键(key)来维护和访问的，所以只能定义在按键分区流(KeyedStream)中，也就 keyBy 之后才可以使用

所以即使是 map、filter 这样无状态的基本转换算子，我们也可以通过富函数类给它们“追 加”Keyed State，或者实现 CheckpointedFunction 接口来定义 Operator State;从这个角度讲， Flink 中所有的算子都可以是有状态的，不愧是“有状态的流处理”。



## 按键分区状态(Keyed State)

我们还可以通过富函数类(Rich Function)对转换算子进行扩展、实现自定义功能， 比如 RichMapFunction、RichFilterFunction。在富函数中，我们可以调用.getRuntimeContext() 获取当前的运行时上下文(RuntimeContext)，进而获取到访问状态的句柄;这种富函数中自 定义的状态也是 Keyed State



### 支持的结构类型

1. 值状态(ValueState)

```java
public interface ValueState<T> extends State {
   T value() throws IOException;
   void update(T value) throws IOException;
}
```

这里的 T 是泛型，表示状态的数据内容可以是任何具体的数据类型。如果想要保存一个 长整型值作为状态，那么类型就是 ValueState<Long>。我们可以在代码中读写值状态，实现对于状态的访问和更新。

1. T value():获取当前状态的值;
2. update(Tvalue):对状态进行更新，传入的参数value就是要覆写的状态值。

在具体使用时，为了让运行时上下文清楚到底是哪个状态，我们还需要创建一个“状态描述器”(StateDescriptor)来提供状态的基本信息。例如源码中，ValueState 的状态描述器构造 方法如下:

```java
public ValueStateDescriptor(String name, Class<T> typeClass) {
   super(name, typeClass, null);
}
```

2. **列表状态(ListState)**

将需要保存的数据，以列表(List)的形式组织起来。在 ListState<T>接口中同样有一个 类型参数 T，表示列表中数据的类型。ListState 也提供了一系列的方法来操作状态，使用方式 与一般的 List 非常相似。

1. Iterable<T>get():获取当前的列表状态，返回的是一个可迭代类型Iterable<T>;
2. update(List<T>values):传入一个列表values，直接对状态进行覆盖;
3. add(Tvalue):在状态列表中添加一个元素value;
4. addAll(List<T>values):向列表中添加多个元素，以列表values形式传入。

类似地，ListState 的状态􏰂述器就叫作 ListStateDescriptor，用法跟 ValueStateDescriptor完全一致。

3. **映射状态(MapState)**

把一些键值对(key-value)作为状态整体保存起来，可以认为就是一组 key-value 映射的 列表。对应的 MapState<UK, UV>接口中，就会有 UK、UV 两个泛型，分别表示保存的 key 和 value 的类型。同样，MapState 提供了操作映射状态的方法，

1. ![CleanShot 2023-03-01 at 16.47.40@2x](http://img.wqkenqing.ren/typora_img/CleanShot%202023-03-01%20at%2016.47.40@2x.png)

4. 归约状态(ReducingState)
5. 聚合状态(AggregatingState)



## 算子状态(Operator State)

算子状态(Operator State)就是一个算子并行实例上定义的状态，作用范围被限定为当前 算子任务。算子状态跟数据的 key 无关，所以不同 key 的数据只要被分发到同一个并行子任务， 就会访问到同一个 Operator State。

算子状态的实际应用场景不如 Keyed State 多，一般用在 Source 或 Sink 等与外部系统连接 的算子上，或者完全没有 key 定义的场景。比如 Flink 的 Kafka 连接器中，就用到了算子状态。 在我们给 Source 算子设置并行度后，Kafka 消费者的每一个并行实例，都会为对应的主题(topic)分区维护一个偏移量， 作为算子状态保存起来。这在保证 Flink 应用“精确一次” (exactly-once)状态一致性时非常有用。关于状态一致性的内容，我们会在第十章详细展开。 当算子的并行度发生变化时，算子状态也支持在并行的算子任务实例之间做重组分配。根

据状态的类型不同，重组分配的方案也会不同。

**状态类型**

主要有三种:

1. ListState

   1. 与 Keyed State 中的列表状态的区别是:在算子状态的上下文中，不会按键(key)分别处 理状态，所以每一个并行子任务上只会保留一个“列表”(list)，也就是当前并行子任务上所 有状态项的集合。列表中的状态项就是可以重新分配的最细粒度，彼此之间完全独立

   2. 算子状态中不会存在“键组”(key group)这样的结构，所以为了方便重组分配，就把它 直接定义成了“列表”(list)。这也就解释了，为什么算子状态中没有最简单的值状态

      (ValueState)。

2. UnionListState 

   1. 与 ListState 类似，联合列表状态也会将状态表示为一个列表。它与常规列表状态的区别 在于，算子并行度进行缩放调整时对于状态的分配方式不同。

3. 和 BroadcastState。

   1. 广播状态(BroadcastState)
      1. 因为广播状态在每个并行子任务上的实例都一样，所以在并行度调整的时候就比较简单， 只要复制一份到新的并行任务就可以实现扩展;而对于并行度缩小的情况，可以将多余的并行 子任务连同状态直接砍掉——因为状态都是复制出来的，并不会丢失。
      2. 在底层，广播状态是以类似映射结构(map)的键值对(key-value)来保存的，必须基于 261一个“广播流”(BroadcastStream)来创建

而对于 Operator State 来说就会有所不同。因为不存在 key，所有数据发往哪个分区是不可 预测的;也就是说，当发生故障重启之后，我们不能保证􏰂个数据跟之前一样，进入到同一个 并行子任务、访问同一个状态。所以 Flink 无法直接判断该怎样保存和恢复状态，而是􏰀供了 接口，让我们根据业务需求自行设计状态的快照保存(snapshot)和恢复(restore)逻辑



1. **CheckpointedFunction 接口**

   1. 在 Flink 中，对状态进行持久化保存的快照机制叫作“检查点”(Checkpoint)。于是使用 算子状态时，就需要对检查点的相关操作进行定义，实现一个 CheckpointedFunction 接口

   

   ```java
   public interface CheckpointedFunction {
   // 保存状态快照到检查点时，调用这个方法
      void snapshotState(FunctionSnapshotContext context) throws Exception
   // 初始化状态时调用这个方法，也会在恢复状态时调用
   void initializeState(FunctionInitializationContext context) throws Exception;
   }
   ```

   每次应用保存检查点做快照时，都会调用.snapshotState()方法，将状态进行外部持久化。

    而在算子任务进行初始化时，会调用. initializeState()方法。这又有两种情况:一种是整个应用 第一次运行，这时状态会被初始化为一个默认值(default value);另一种是应用重启时，从检 查点(checkpoint)或者保存点(savepoint)中读取之前状态的快照，并赋给本地状态。所以， 接口中的.snapshotState()方法定义了检查点的快照保存逻辑，而. initializeState()方法不仅定义 了初始化逻辑，也定义了恢复逻辑。

   这里需要注意，CheckpointedFunction 接口中的两个方法，分别传入了一个上下文(context) 作为参数。不同的是，.snapshotState()方法拿到的是快照的上下文 FunctionSnapshotContext， 它可以􏰀供检查点的相关信息，不过无法获取状态句柄;而. initializeState()方法拿到的是 FunctionInitializationContext，这是函数类进行初始化时的上下文，是真正的“运行时上下文”。 FunctionInitializationContext 中􏰀供了“算子状态存储”(OperatorStateStore)和“按键分区状态 存储(” KeyedStateStore)，在这两个存储对象中可以非常方便地获取当前任务实例中的Operator State 和 Keyed State

   ```
   ListStateDescriptor<String> descriptor =
             new ListStateDescriptor<>(
                "buffered-elements",
                Types.of(String));
   ListState<String> checkpointedState = context.getOperatorStateStore().getListState(descriptor);
   ```

   ```
   对于不同类型的算子状态，需要调用不同的获取状态对象的接口，对应地也就会使用不同 的状态分配重组算法。比如获取列表状态时，调用.getListState() 会使用最简单的 平均分割重 组(even-split redistribution)算法;而获取联合列表状态时，调用的是.getUnionListState() ， 对应就会使用联合重组(union redistribution) 算法
   ```

   ## 广播状态(Broadcast State)



```
MapStateDescriptor<String, Rule> ruleStateDescriptor = new MapStateDescriptor<>(...);
BroadcastStream<Rule> ruleBroadcastStream = ruleStream
                    .broadcast(ruleStateDescriptor);
DataStream<String> output = stream
              .connect(ruleBroadcastStream)
              .process( new BroadcastProcessFunction<>() {...} );
```

这里我们定义了一个“规则流”ruleStream，里面的数据表示了数据流 stream 处理的规则， 规则的数据类型定义为 Rule。于是需要先定义一个 MapStateDescriptor 来􏰁述广播状态，然后 传入 ruleStream.broadcast()得到广播流，接着用 stream 和广播流进行连接。这里状态􏰁述器中 的 key 类型为 String，就是为了区分不同的状态值而给定的 key 的名称。对于广播连接流调用 .process() 方法，可以传入“广播处理函数” KeyedBroadcastProcessFunction 或者 BroadcastProcessFunction 来进行处理计算。广播处理函数 里面有两个方法.processElement()和.processBroadcastElement()

```java
public abstract class BroadcastProcessFunction<IN1, IN2, OUT> extends BaseBroadcastProcessFunction {
...
public abstract void processElement(IN1 value, ReadOnlyContext ctx, Collector<OUT> out) throws Exception;
public abstract void processBroadcastElement(IN2 value, Context ctx, Collector<OUT> out) throws Exception;
... }
```

这里的.processElement()方法，处理的是正常数据流，第一个参数 value 就是当前到来的流 数据;而.processBroadcastElement()方法就相当于是用来处理广播流的，它的第一个参数 value 就是广播流中的规则或者配置数据。两个方法第二个参数都是一个上下文 ctx，都可以通过调 用.getBroadcastState()方法获取到当前的广播状态;区别在于，.processElement()方法里的上下 文是“只读”的(ReadOnly)，因此获取到的广播状态也只能读取不能更改; 而.processBroadcastElement()方法里的 Context 则没有限制，可以根据当前广播流中的数据更新 状态。

```java
Rule rule = ctx.getBroadcastState( new MapStateDescriptor<>("rules", Types.String, Types.POJO(Rule.class))).get("my rule");
```

通过调用 ctx.getBroadcastState()方法，传入一个 MapStateDescriptor，就可以得到当前的叫 作“rules”的广播状态;调用它的.get()方法，就可以取出其中“my rule”对应的值进行计算处理。

```java
public class BroadcastStateExample {
   public static void main(String[] args) throws Exception {
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
       env.setParallelism(1);
// 读取用户行为事件流
DataStreamSource<Action> actionStream = env.fromElements(
             new Action("Alice", "login"),
             new Action("Alice", "pay"),
269 );
new Action("Bob", "login"),
new Action("Bob", "buy")
// 定义行为模式流，代表了要检测的标准 DataStreamSource<Pattern> patternStream = env
       .fromElements(
 );
new Pattern("login", "pay"),
new Pattern("login", "buy")
// 定义广播状态的描述器，创建广播流
MapStateDescriptor<Void, Pattern> bcStateDescriptor = new
MapStateDescriptor<>(
             "patterns", Types.VOID, Types.POJO(Pattern.class));
BroadcastStream<Pattern> bcPatterns = patternStream.broadcast(bcStateDescriptor);
// 将事件流和广播流连接起来，进行处理
DataStream<Tuple2<String, Pattern>> matches = actionStream
             .keyBy(data -> data.userId)
             .connect(bcPatterns)
           .process(new PatternEvaluator());
   matches.print();
   env.execute();
}
public static class PatternEvaluator
 extends KeyedBroadcastProcessFunction<String, Action, Pattern, Tuple2<String, Pattern>> {
// 定义一个值状态，保存上一次用户行为 ValueState<String> prevActionState;
@Override
        public void open(Configuration conf) {
          prevActionState = getRuntimeContext().getState(
                 new ValueStateDescriptor<>("lastAction", Types.STRING));
}
       @Override
       public void processBroadcastElement(
             Pattern pattern,
             Context ctx,
             Collector<Tuple2<String, Pattern>> out) throws Exception {
          BroadcastState<Void, Pattern> bcState = ctx.getBroadcastState(
new MapStateDescriptor<>("patterns", Types.VOID, Types.POJO(Pattern.class)));
 Exception {
// 将广播状态更新为当前的 pattern
   bcState.put(null, pattern);
}
@Override
public void processElement(Action action, ReadOnlyContext ctx,
Collector<Tuple2<String, Pattern>> out) throws Pattern pattern = ctx.getBroadcastState(
 new MapStateDescriptor<>("patterns", Types.VOID, Types.POJO(Pattern.class))).get(null);
          String prevAction = prevActionState.value();
          if (pattern != null && prevAction != null) {
// 如果前后两次行为都符合模式定义，输出一组匹配
if (pattern.action1.equals(prevAction) && pattern.action2.equals(action.action)) {
              out.collect(new Tuple2<>(ctx.getCurrentKey(), pattern));
          }
}
// 更新状态 prevActionState.update(action.action);
} }
// 定义用户行为事件 POJO 类 public static class Action {
   public String userId;
   public String action;
   public Action() {
 }
public Action(String userId, String action) {
   this.userId = userId;
   this.action = action;
}
@Override

} }
public String toString() {
   return "Action{" +
"userId=" + userId +
", action='" + action + '\'' +
'}';
// 定义行为模式 POJO 类，包含先后发生的两个行为 public static class Pattern {
   public String action1;
   public String action2;
   public Pattern() {
   }
   public Pattern(String action1, String action2) {
       this.action1 = action1;
       this.action2 = action2;
}
@Override
}
} }
public String toString() {
   return "Pattern{" +
"action1='" + action1 + '\'' +
", action2='" + action2 + '\'' +
'}';

```


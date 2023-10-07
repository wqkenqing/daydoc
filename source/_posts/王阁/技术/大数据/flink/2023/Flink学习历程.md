title:  flink学习历程
date:  2023年 2月22日
tags: []
password: 7FKBKZrTTTPG2LnC

---

记录flink的学习历程，1、是加强记忆 2、是做为资料留存 3、 为其它初学者提供帮助

 <!--more-->

# flink 学习历程

## 1、背景

flink 发展势头凶猛，应用场景广，之前学习过flink，但都浅尝则止，这次系统性学习一下flink，并应用。

## 2、 学习路线

回顾我的学习的心路历程，学习flink，我先是学习资料的收集，制定学习路线。从自身时间和效率上来考虑，我选择了看书+看源码+和示例demo的方式。

学习资源我使用了

1. flink实战派
2. flink超神文档
3. 剑指大数据-Flink学习精要(java版)

源码这边储备了一些相关项目的源码，但总的来说效果不好，这里就不列出了。

文中会在相应的模块中附一些我自己的源码，不足之处，大佬们指正。

然后用到的一些工具和相关环境

编程语言：

1. java8
2. python3

用到的组件与版本

1. flink1.12.4

2. cdh6.3.2等相关组件

3. ... 

   其它工具

   1. iterm
   2. chatgpt（用来直接一对一搜索demo和一些问题解决，比较高效，但使用中也出现了一些问题，后可以附一篇chatgpt的使用心得）

   ---

   ### 内容大框

   1. flink 执行环境
   2. flink 运行模式
   3. flink source 
   4. flink transformation (basic api )
   5. flink time and window
   6. flink process function
   7. flink 多流转换
   8. flink 状态编程
   9. flink 容错机制

   

   ---

   后续待学习的还有

   1. flink table and sql
   2. flink 运维
   3. flink cep
   4. flink cdc

   等

   ---

   ### 2.2 flink程序的基础结构

   一个普通的flink程序基本上会由

   1. 获取执行环境 (execution environment)
   2. 读取数据源 (source)
   3. 定义基于数据的转换操作 (transformation)
   4. 定义计算结果的输出位置 (sink)
   5. 触发程序执行 (execute)

   等结构组成

   本文也会先以这些为主体脉络来行文

   

   

   ##  3、 flink 执行环境

   ### 3.1 获取环境

   flink运行环境主要有三种,创建运行环境的方法主要有三种静态方法，代表不同的含义

   1. **getExecutionEnvironment**

      1. 这种方式好处就是它是“智能”的检测现在的运行模式，自动按相应模式来执行程序

      ```java
      StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
      ```

      

   2. **createLocalEnvironment**

      1. 返回一个本地环境，可以在调用时传入一个参数，指定默认的并行度；如果不传入，则默认的并行度就是本地的cpu核心数。

         ```
         StreamExecutionEnvironment localEnv = StreamExecutionEnvironment.createLocalEnvironment();
         ```

         

   3. **createRemoteEnvironment**

      1. 这个方法返回集群执行环境。需要在调用时指定 JobManager 的主机名和端口号，并指定 要在集群中运行的 Jar 包。

         ```
         StreamExecutionEnvironment remoteEnv = StreamExecutionEnvironment
                .createRemoteEnvironment(
         "jm-host", // JobManager 主机名
         port, // JobManager 进程端口号 "path/jarFile.jar" // 提交给 JobManager 的 JAR 包
         );
         ```

         ### 3.2 执行模式

         分为批处理和流处理环境

         ```
         // 批处理环境
         ExecutionEnvironment batchEnv = ExecutionEnvironment.getExecutionEnvironment(); // 流处理环境
         StreamExecutionEnvironment                        env                        =
         StreamExecutionEnvironment.getExecutionEnvironment();
         ```

         批处理场景现在很少。另外从flink1.12开始，不用在代码中特别指出执行模式。

         可以在运行时，通过参数控制。 可以支持不同的“执行模式”(execution mode)，通过这一设置从而就可以让一段Flink在流处理和批处理之间切换。

         1. console command

         ```
         bin/flink run -Dexecution.runtime-mode=BATCH ...
         ```

         2. code config

         ```
         StreamExecutionEnvironment                        env                        =
         StreamExecutionEnvironment.getExecutionEnvironment();
         env.setRuntimeMode(RuntimeExecutionMode.BATCH);
         ```

         ### 3.3 触发程序执行

         之前学习spark时一样，即程序提交后，内部相关程序会进行解析，执行，形成相应的任务执行链

         但相关函数与算子并未执行，只有数据进入后，事件趋动执行，但程序要先执行起来。

         ```
         env.execute();
         ```

         

         

         

         

         ## 4、Flink Source算子

         [Flink source ](./FlinkSource.md)
         
         
         
         ## 5、Flink Basic API
         
         1. [flink trasnsform](./flink_transform.md)
         2. [flink_time_window](./Flink_Time_Window.md)
         
         2. [flink process function](./Flink_Process_Function.md)
         
         
         
         ## 6、Flink多流转换
         
         
         
         
         
         
         
         
         
         
         
         
   
   
   
   
   
   

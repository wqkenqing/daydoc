title: Flinkcdc 
date: 2024-03-25 14:49:28 
tags: [flink]
categories: [专题]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

1. 什么是flinkcdc?

```
CDC（Change Data Capture）是一种用于捕获和处理数据源中的变化的技术。它允许实时地监视数据库或数据流中发生的数据变动，并将这些变动抽取出来，以便进行进一步的处理和分析。

传统上，数据源的变化通常通过周期性地轮询整个数据集进行检查来实现。但是，这种轮询的方式效率低下且不能实时反应变化。而 CDC 技术则通过在数据源上设置一种机制，使得变化的数据可以被实时捕获并传递给下游处理系统，从而实现了实时的数据变动监控。

Flink 作为一个强大的流式计算引擎，提供了内置的 CDC 功能，能够连接到各种数据源（如数据库、消息队列等），捕获其中的数据变化，并进行灵活的实时处理和分析。

```

2. flinkcdc 用来干什么
3. flink cdc的应用

### 参考链接

1. [flinkcdc](https://blog.csdn.net/qq_50954361/article/details/129486467?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-3-129486467-blog-132557693.235^v43^pc_blog_bottom_relevance_base4&spm=1001.2101.3001.4242.2&utm_relevant_index=4)

---

在火山ecs建一个mysql实例

---


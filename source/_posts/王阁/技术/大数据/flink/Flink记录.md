`flink相关记录`

## yarn启动


```js
Usage:
   Required
     -n,--container <arg>   Number of YARN container to allocate (=Number of Task Managers)
   Optional
     -D <arg>                        Dynamic properties
     -d,--detached                   Start detached
     -jm,--jobManagerMemory <arg>    Memory for JobManager Container with optional unit (default: MB)
     -nm,--name                      Set a custom name for the application on YARN
     -q,--query                      Display available YARN resources (memory, cores)
     -qu,--queue <arg>               Specify YARN queue.
     -s,--slots <arg>                Number of slots per TaskManager
     -tm,--taskManagerMemory <arg>   Memory per TaskManager Container with optional unit (default: MB)
     -z,--zookeeperNamespace <arg>   Namespace to create the Zookeeper sub-paths for HA mode
```

yarn-session.sh -n 8 -jm 2048 -tm 4096 -d
参数解释：
```
//-n 2 表示指定两个容器
// -jm 1024 表示jobmanager 1024M内存
// -tm 1024表示taskmanager 1024M内存
//-d 任务后台运行
//-nm,--name  YARN上为一个自定义的应用设置一个名字
//-q,--query  显示yarn中可用的资源 (内存, cpu核数)
//-z,--zookeeperNamespace <arg>   针对HA模式在zookeeper上创建NameSpace
//-id,--applicationId <yarnAppId>   YARN集群上的任务id，附着到一个后台运行的yarn session中
```
**命令**:

` yarn-session.sh -n 10 -tm 8192 -s 32`
` yarn-session.sh -n 2 -tm 2048 -s 2`
` yarn-session.sh -n 1 -tm 1024 -s 2`

yarn-session.sh -n 1 -tm 1024 -s 2
yarn-session.sh -n 2 -tm 4096 -jm  4096

yarn-session.sh -id application_1563854073510_0006

flink run -m yarn-cluster -yn 2 -yjm 4096 -ytm  4096


2020年 01月 13日 星期一 16:39:12

yarn-session.sh -n 2 -tm 4096 -jm  4096

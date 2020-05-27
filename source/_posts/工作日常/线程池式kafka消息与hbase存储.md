```

多线程下kafka与hbase的数据同步

```

java线程池使用

1. ThreadFactory
2. ThreadPoolExecutor
3. ExecutorService



eg1
```java
ThreadFactory namedThreadFactory = new ThreadFactoryBuilder().setNameFormat("upload-thread-%d").build();
```

eg2
``` java
public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
     return new ThreadPoolExecutor(nThreads, nThreads,
             0L, TimeUnit.MILLISECONDS,
             new LinkedBlockingQueue<Runnable>(),
             threadFactory);
 }

```

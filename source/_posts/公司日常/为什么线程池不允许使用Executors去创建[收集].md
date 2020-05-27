```

一般来讲
线程池不允许使用Executors去创建,而是通过ThreadPoolExecutor,因为后者可以更加明确的指明线程执行的策略,和资源的规划.

```

用Executors的具体弊端.

## newFixedThreadPool && newSingleThreadExecutor

主要问题是堆积的请求处理队列可能会耗费非常大的内存，甚至OOM。


## newCachedThreadPool和newScheduledThreadPool

主要问题是线程数最大数是Integer.MAX_VALUE，可能会创建数量非常多的线程，甚至OOM

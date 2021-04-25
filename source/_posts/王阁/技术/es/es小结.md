```
针对es的一些操作小结

```

es主要的重点在于查询,所以针对es的一些查询进行小结.

es的查询分类

主要有以下




elasticsearch term 匹配索引值, macth匹配文本内容
所以对text 类,用term会匹配不到 需要用match or match_phrase;


settings的设置

```
//静态设置：只能在索引创建时或者在状态为 closed index（闭合的索引）上设置

index.number_of_shards //主分片数，默认为5.只能在创建索引时设置，不能修改

index.shard.check_on_startup //是否应在索引打开前检查分片是否损坏，当检查到分片损坏将禁止分片被打开
   false //默认值
   checksum //检查物理损坏
   true //检查物理和逻辑损坏，这将消耗大量内存和CPU
   fix //检查物理和逻辑损坏。有损坏的分片将被集群自动删除，这可能导致数据丢失

index.routing_partition_size //自定义路由值可以转发的目的分片数。默认为 1，只能在索引创建时设置。此值必须小于index.number_of_shards

index.codec //默认使用LZ4压缩方式存储数据，也可以设置为 best_compression，它使用 DEFLATE 方式以牺牲字段存储性能为代价来获得更高的压缩比例。


```

```

index.number_of_replicas //每个主分片的副本数。默认为 1。

index.auto_expand_replicas //基于可用节点的数量自动分配副本数量,默认为 false（即禁用此功能）

index.refresh_interval //执行刷新操作的频率，这使得索引的最近更改可以被搜索。默认为 1s。可以设置为 -1 以禁用刷新。

index.max_result_window //用于索引搜索的 from+size 的最大值。默认为 10000

index.max_rescore_window // 在搜索此索引中 rescore 的 window_size 的最大值

index.blocks.read_only //设置为 true 使索引和索引元数据为只读，false 为允许写入和元数据更改。

index.blocks.read // 设置为 true 可禁用对索引的读取操作

index.blocks.write //设置为 true 可禁用对索引的写入操作。

index.blocks.metadata // 设置为 true 可禁用索引元数据的读取和写入。

index.max_refresh_listeners //索引的每个分片上可用的最大刷新侦听器数


```

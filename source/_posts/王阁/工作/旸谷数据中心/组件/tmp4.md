<yanggu> <!-- 集群名字，自定义 -->
        <shard> <!-- 定义一个分片 -->
            <!-- Optional. Shard weight when writing data. Default: 1. -->
            <weight>3</weight>
            <!-- Optional. Whether to write data to just one of the replicas. Default: false (write data to all replicas). -->
            <internal_replication>true</internal_replication>
            <replica> <!-- 这个分片的副本存在在哪些机器上 -->
                <host>ck01</host>
                <port>9002</port>
            </replica>
           <replica> <!-- 这个分片的副本存在在哪些机器上 -->
                <host>ck02</host>
                <port>9002</port>
            </replica>
	    <replica> <!-- 这个分片的副本存在在哪些机器上 -->
                <host>ck03</host>
                <port>9002</port>
            </replica> 
        </shard>
      <!--  
        <shard>
            <weight>2</weight>
            <internal_replication>true</internal_replication>
            <replica>
                <host>172.20.1.39</host>
                <port>9000</port>
            </replica>
            <replica>
                <host>172.20.1.246</host>
                <port>9000</port>
            </replica>
        </shard>
        -->
    </yangu>
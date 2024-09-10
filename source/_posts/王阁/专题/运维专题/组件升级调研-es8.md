### 要升级的组件有

> jdk升级17,对应组件也要升级。



---

**elasticsearch8**



节点

```
192.168.10.100 namenode
namenode2
datanode1
```



```
192.168.10.100
192.168.10.104
192.168.10.101
```

```
["192.168.10.100:9300","192.168.10.104:9300","192.168.10.101:9300"]
```

### es01

```
#集群的名称
cluster.name: yg-es8
#节点名称,其余两个节点分别为node-2 和node-3
node.name: esnode-1
#指定该节点是否有资格被选举成为master节点，默认是true，es是默认集群中的第一台机器为master，如果这台机挂了就会重新选举master
node.master: true
#允许该节点存储数据(默认开启)
node.data: true
#索引数据的存储路径
#path.data: /data/colony/es/data
#日志文件的存储路径
#path.logs: /data/colony/es/logs
#设置为true来锁住内存。因为内存交换到磁盘对服务器性能来说是致命的，当jvm开始swapping时es的效率会降低，所以要保证它不swap
bootstrap.memory_lock: no
#绑定的ip地址
network.host: 192.168.10.100
#network.publish_host: 192.168.10.100
#设置对外服务的http端口，默认为9200
http.port: 9200
# 设置节点间交互的tcp端口,默认是9300
transport.tcp.port: 9300
#Elasticsearch将绑定到可用的环回地址，并将扫描端口9300到9305以尝试连接到运行在同一台服务器上的其他节点。
#这提供了自动集群体验，而无需进行任何配置。数组设置或逗号分隔的设置。每个值的形式应该是host:port或host
#（如果没有设置，port默认设置会transport.profiles.default.port 回落到transport.tcp.port）。
#请注意，IPv6主机必须放在括号内。默认为127.0.0.1, [::1]
discovery.seed_hosts: ["192.168.10.100:9300","192.168.10.104:9300","192.168.10.101:9300"]
#如果没有这种设置,遭受网络故障的集群就有可能将集群分成两个独立的集群 - 分裂的大脑 - 这将导致数据丢失
cluster.initial_master_nodes: ["192.168.10.100:9300"]

# 允许跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
xpack.ml.enabled: false
# path.repo: ["/data/snapshot"]
```

**es02**

```
#集群的名称
cluster.name: yg-es8
#节点名称,其余两个节点分别为node-2 和node-3
node.name: esnode-1
#指定该节点是否有资格被选举成为master节点，默认是true，es是默认集群中的第一台机器为master，如果这台机挂了就会重新选举master
node.master: true
#允许该节点存储数据(默认开启)
node.data: true
#索引数据的存储路径
#path.data: /data/colony/es/data
#日志文件的存储路径
#path.logs: /data/colony/es/logs
#设置为true来锁住内存。因为内存交换到磁盘对服务器性能来说是致命的，当jvm开始swapping时es的效率会降低，所以要保证它不swap
bootstrap.memory_lock: no
#绑定的ip地址
network.host: 192.168.10.104
#network.publish_host: 192.168.10.100
#设置对外服务的http端口，默认为9200
http.port: 9200
# 设置节点间交互的tcp端口,默认是9300
transport.tcp.port: 9300
#Elasticsearch将绑定到可用的环回地址，并将扫描端口9300到9305以尝试连接到运行在同一台服务器上的其他节点。
#这提供了自动集群体验，而无需进行任何配置。数组设置或逗号分隔的设置。每个值的形式应该是host:port或host
#（如果没有设置，port默认设置会transport.profiles.default.port 回落到transport.tcp.port）。
#请注意，IPv6主机必须放在括号内。默认为127.0.0.1, [::1]
discovery.seed_hosts: ["192.168.10.100:9300","192.168.10.104:9300","192.168.10.101:9300"]
#如果没有这种设置,遭受网络故障的集群就有可能将集群分成两个独立的集群 - 分裂的大脑 - 这将导致数据丢失
cluster.initial_master_nodes: ["192.168.10.100:9300"]

# 允许跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
xpack.ml.enabled: false
# path.repo: ["/data/snapshot"]
```

es03

```
#集群的名称
cluster.name: yg-es8
#节点名称,其余两个节点分别为node-2 和node-3
node.name: esnode-1
#指定该节点是否有资格被选举成为master节点，默认是true，es是默认集群中的第一台机器为master，如果这台机挂了就会重新选举master
node.master: true
#允许该节点存储数据(默认开启)
node.data: true
#索引数据的存储路径
#path.data: /data/colony/es/data
#日志文件的存储路径
#path.logs: /data/colony/es/logs
#设置为true来锁住内存。因为内存交换到磁盘对服务器性能来说是致命的，当jvm开始swapping时es的效率会降低，所以要保证它不swap
bootstrap.memory_lock: no
#绑定的ip地址
network.host: 192.168.10.101
#network.publish_host: 192.168.10.100
#设置对外服务的http端口，默认为9200
http.port: 9200
# 设置节点间交互的tcp端口,默认是9300
transport.tcp.port: 9300
#Elasticsearch将绑定到可用的环回地址，并将扫描端口9300到9305以尝试连接到运行在同一台服务器上的其他节点。
#这提供了自动集群体验，而无需进行任何配置。数组设置或逗号分隔的设置。每个值的形式应该是host:port或host
#（如果没有设置，port默认设置会transport.profiles.default.port 回落到transport.tcp.port）。
#请注意，IPv6主机必须放在括号内。默认为127.0.0.1, [::1]
discovery.seed_hosts: ["192.168.10.100:9300","192.168.10.104:9300","192.168.10.101:9300"]
#如果没有这种设置,遭受网络故障的集群就有可能将集群分成两个独立的集群 - 分裂的大脑 - 这将导致数据丢失
cluster.initial_master_nodes: ["192.168.10.100:9300"]

# 允许跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
xpack.ml.enabled: false
# path.repo: ["/data/snapshot"]
```













```
version: '3'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: es02
    network_mode: host
    environment:
      - ELASTIC_USERNAME=elastic
      - ELASTIC_PASSWORD=Sz5LxoCJs_zLp
      - CERTS_DIR=/usr/share/elasticsearch/config/certificates
      - node.name=app1
      - cluster.name=es-czbx-cluster
      - discovery.seed_hosts=namenode,datanode2,namenode2
      - cluster.initial_master_nodes=namenode,datanode2,namenode2
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.certificate_authorities=/usr/share/elasticsearch/config/certificates/ca.crt
      - xpack.security.transport.ssl.certificate=/usr/share/elasticsearch/config/certificates/es.crt
      - xpack.security.transport.ssl.key=/usr/share/elasticsearch/config/certificates/es.key
      - "ES_JAVA_OPTS=-Xms4g -Xmx6g"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - /data/es8/es_data:/usr/share/elasticsearch/data
      - /data/es8/es_cert:/usr/share/elasticsearch/config/certificates
      - /data/es8/es_plugin:/usr/share/elasticsearch/plugins/
```



```
version: '3'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: es01
    network_mode: host
    environment:
      - ELASTIC_USERNAME=elastic
      - ELASTIC_PASSWORD=Sz5LxoCJs_zLp
      - CERTS_DIR=/usr/share/elasticsearch/config/certificates
      - node.name=namenode
      - cluster.name=yg-es8-cluster
      - discovery.seed_hosts=namenode,kafka01,namenode2
      - cluster.initial_master_nodes=namenode,kafka01,namenode2
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.certificate_authorities=/usr/share/elasticsearch/config/certificates/ca.crt
      - xpack.security.transport.ssl.certificate=/usr/share/elasticsearch/config/certificates/es.crt
      - xpack.security.transport.ssl.key=/usr/share/elasticsearch/config/certificates/es.key
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - /data/es8/es_data:/usr/share/elasticsearch/data
      - /data/es8/es_cert:/usr/share/elasticsearch/config/certificates
      - /data/es8/es_plugin:/usr/share/elasticsearch/plugins/
```



```
version: '3'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: es02
    network_mode: host
    environment:
      - ELASTIC_USERNAME=elastic
      - ELASTIC_PASSWORD=Sz5LxoCJs_zLp
      - CERTS_DIR=/usr/share/elasticsearch/config/certificates
      - node.name=namenode2
      - cluster.name=yg-es8-cluster
      - discovery.seed_hosts=namenode,kafka01,namenode2
      - cluster.initial_master_nodes=namenode,kafka01,namenode2
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.certificate_authorities=/usr/share/elasticsearch/config/certificates/ca.crt
      - xpack.security.transport.ssl.certificate=/usr/share/elasticsearch/config/certificates/es.crt
      - xpack.security.transport.ssl.key=/usr/share/elasticsearch/config/certificates/es.key
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - /data/es8/es_data:/usr/share/elasticsearch/data
      - /data/es8/es_cert:/usr/share/elasticsearch/config/certificates
      - /data/es8/es_plugin:/usr/share/elasticsearch/plugins/
```

```

version: '3'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: es03
    network_mode: host
    environment:
      - ELASTIC_USERNAME=elastic
      - ELASTIC_PASSWORD=Sz5LxoCJs_zLp
      - CERTS_DIR=/usr/share/elasticsearch/config/certificates
      - node.name=calculation01
      - cluster.name=yg-es8-cluster
      - discovery.seed_hosts=namenode,calculation01,namenode2
      - cluster.initial_master_nodes=namenode,kafka01,namenode2
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.certificate_authorities=/usr/share/elasticsearch/config/certificates/ca.crt
      - xpack.security.transport.ssl.certificate=/usr/share/elasticsearch/config/certificates/es.crt
      - xpack.security.transport.ssl.key=/usr/share/elasticsearch/config/certificates/es.key
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - /data/es8/es_data:/usr/share/elasticsearch/data
      - /data/es8/es_cert:/usr/share/elasticsearch/config/certificates
      - /data/es8/es_plugin:/usr/share/elasticsearch/plugins/
```

```

curl -u elastic:your_elastic_password -X POST "http://localhost:9200/_security/role/my_admin_role" -H 'Content-Type: application/json' -d'
{
  "cluster": ["all"],
  "indices": [
    {
      "names": ["*"],
      "privileges": ["all"]
    }
  ]
}'

```

```
curl -u elastic:Sz5LxoCJs_zLp -X POST "http://localhost:9200/_security/user/ygadmin" -H 'Content-Type: application/json' -d'
{
  "password": "Sz5LxoCJs_zLp",
  "roles": ["my_admin_role"],
  "full_name": "Yg Admin",
  "email": "ygadmin@example.com",
  "enabled": true
}'

```

```
curl -u elastic:Sz5LxoCJs_zLp -X PUT "http://localhost:9200/_security/role/my_admin_role" -H 'Content-Type: application/json' -d'
{
  "cluster": ["all"],
  "indices": [
    {
      "names": ["*"],
      "privileges": ["all"]
    },
    {
      "names": [".kibana*"],
      "privileges": ["all"]
    }
  ]
}'

```

```
curl -u ygadmin:Sz5LxoCJs_zLp -X GET "http://localhost:9200/_cluster/health?pretty"

```

```
curl -u elastic:Sz5LxoCJs_zLp -X PUT "http://namenode:9200/_security/user/ygadmin" -H 'Content-Type: application/json' -d'
{
  "password": "Sz5LxoCJs_zLp",
  "roles": ["my_admin_role"],
  "full_name": "Yg Admin",
  "email": "ygadmin@example.com",
  "enabled": true
}'

```

```
curl -u elastic:Sz5LxoCJs_zLp -X GET "http://localhost:9200/_security/user/ygadmin?pretty"

```





```
curl -u ygadmin:Sz5LxoCJs_zLp -X PUT "http://localhost:9200/_security/role/my_admin_role" -H 'Content-Type: application/json' -d'
{
  "cluster": ["all"],
  "indices": [
  
    {
      "names": [".kibana*"],
      "privileges": ["all"]
    }
  ]
}'

```

```
 curl -u ygadmin:Sz5LxoCJs_zLp -X DELETE "http://localhost:9200/_security/role/my_admin_role"
```

```
curl -u elastic:Sz5LxoCJs_zLp -X -DELETE "http://localhost:9200/_security/user/ygadmin" 

```

```
curl -u elastic:Sz5LxoCJs_zLp -X GET "http://localhost:9200/_security/user/ygadmin?pretty"

```



```
curl -u elastic:Sz5LxoCJs_zLp -X DELETE "http://localhost:9200/_security/user/ygadmin"

```

```
curl -u elastic:Sz5LxoCJs_zLp -X GET "http://localhost:9200/_security/user/ygadmin?pretty"

```

```
curl -u elastic:Sz5LxoCJs_zLp -X POST "http://localhost:9200/_security/service/elastic/kibana/ygadmin" -H 'Content-Type: application/json'

```

```
curl -u elastic:Sz5LxoCJs_zLp -X POST "http://localhost:9200/_security/role/my_admin_role" -H 'Content-Type: application/json' -d'
{
  "cluster": ["all"],
  "indices": [
    {
      "names": [".kibana", "*"],
      "privileges": ["all"]
    }
  ],
  "applications": [],
  "run_as": [],
  "metadata": {},
  "transient_metadata": {
    "enabled": true
  }
}'

```

```
curl -u elastic:Sz5LxoCJs_zLp -X DELETE "http://localhost:9200/_security/role/my_admin_role"

```

```
curl -u elastic:Sz5LxoCJs_zLp -X POST "http://localhost:9200/_security/user/ygadmin" -H 'Content-Type: application/json' -d'
{
  "password" : "new_user_password",
  "roles" : ["my_admin_role"],
  "full_name" : "Yg Admin",
  "email" : "ygadmin@example.com",
  "metadata" : {}
}'

```

```
curl -u ygadmin:Sz5LxoCJs_zLp -X POST "http://localhost:9200/_security/api_key" -H 'Content-Type: application/json' -d'
{
  "name": "my_api_key",
  "role_descriptors": {
    "my_admin_role": {
      "cluster": ["all"],
      "index": [
        {
          "names": ["*"],
          "privileges": ["all"]
        }
      ]
    }
  }
}'

```

```
curl -X POST -u elastic:Sz5LxoCJs_zLp "http://localhost:9200/_security/service/elastic/kibana/credential/token/ygadmin?pretty"
```

```
{
  "created" : true,
  "token" : {
    "name" : "ygadmin",
    "value" : "AAEAAWVsYXN0aWMva2liYW5hL3lnYWRtaW46ak5wMDAzcEhRVWlTcGk0M2YwZFN3dw"
  }
}
```


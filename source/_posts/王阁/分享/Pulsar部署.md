### Pulsar安装部署



```
pulsar initialize-cluster-metadata \
  --cluster yanggu-pulsar \
  --zookeeper 192.168.10.217:2181 \
  --configuration-store 192.168.10.217:2181 \
  --web-service-url http://192.168.10.217:8080,192.168.10.218:8080,192.168.10.219:8080 \
  --broker-service-url pulsar://192.168.10.217:6650,192.168.10.218:6650,192.168.10.219:6650
```


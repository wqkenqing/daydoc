# 配置X-Pack
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-headers: Authorization
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true





```
cluster.initial_master_nodes: ["es01","es02","es03"]
http.cors.allow-headers: Authorization
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

```
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: /opt/cloudera/parcels/ELASTICSEARCH-0.0.5.elasticsearch.p0.5/config/elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: /opt/cloudera/parcels/ELASTICSEARCH-0.0.5.elasticsearch.p0.5/config/elastic-certificates.p12
```


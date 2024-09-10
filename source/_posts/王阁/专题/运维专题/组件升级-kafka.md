

```
version: '3.3'
services:
  kafka:
    image: 'bitnami/kafka:3.7.0'
    container_name: kafka
    restart: always
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
    environment:
      - TZ=Asia/Shanghai
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://namenode:9092,EXTERNAL://namenode:9094
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
    networks:
      - app-tier
    ports:
      - '9092:9092'
      - '9094:9094'
    volumes:
      - /data/colony/kafka3.0:/bitnami/kafka
networks:
  app-tier:
    name: app-tier
    driver: bridge
    #external: tru
```



---

kafka-manager

---

```
version: '3'
 
services:
  kafka-manager:
    image: scjtqs/kafka-manager:latest
    restart: always
    hostname: kafka-manager
    container_name: kafka-manager
    ports:
      - 9000:9002
    external_links:  # 连接本compose文件以外的container
      - kafka
    environment:
      KAFKA_BROKERS: kafka9092
      KM_ARGS: -Djava.net.preferIPv4Stack=true
    networks:
      - app-manager
networks:
   app-manager:
      name: app-manager
      driver: bridge
```

```
version: '3'

services:
  kafka-manager:
    image: scjtqs/kafka-manager:latest
    restart: always
    hostname: kafka-manager
    container_name: kafka-manager
    ports:
      - "9000:9002"
    environment:
      KAFKA_BROKERS: "kafka:9092"  # 确保 Kafka 地址格式正确
      KM_ARGS: "-Djava.net.preferIPv4Stack=true"
    networks:
      - app-manager

networks:
  app-manager:
    driver: bridge
    external: true

```


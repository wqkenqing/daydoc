# EMQ-X

### emq-x 单节点部署

```
{
  "registry-mirrors": [
      "https://hub-mirror.c.163.com/",
      "https://dockerproxy.com/"
  ]
}
```

```
version: '3'

services:
  emqx1:
    image: docker.io/emqx/emqx
    environment:
    - "EMQX_NAME=emqx"
    - "EMQX_HOST=node1.emqx.io"
    - "EMQX_CLUSTER__DISCOVERY=static"
    - "EMQX_CLUSTER__STATIC__SEEDS=emqx@node1.emqx.io, emqx@node2.emqx.io"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    networks:
      emqx-bridge:
        aliases:
        - node1.emqx.io

  emqx2:
    image: docker.io/emqx/emqx
    environment:
    - "EMQX_NAME=emqx"
    - "EMQX_HOST=node2.emqx.io"
    - "EMQX_CLUSTER__DISCOVERY=static"
    - "EMQX_CLUSTER__STATIC__SEEDS=emqx@node1.emqx.io, emqx@node2.emqx.io"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    networks:
      emqx-bridge:
        aliases:
        - node2.emqx.io

networks:
  emqx-bridge:
    driver: bridge



```

```
services:
  emqx:
    image: registry.lisong.pub:28500/hub/library/emqx:5.0
    container_name: emqx
    ports:
      - "1883:1883"  
      - "18083:18083"  
#      - "18081:8081"  
#      - "18883:8883"  
#      - "18084:8084"  
    environment:
      - EMQX_NAME=emqx
      - EMQX_HOST=node1
      - EMQX_NODE__COOKIE=secretcookie  # Replace this with a secure value
      - EMQX_LOADED_PLUGINS=emqx_management,emqx_dashboard,emqx_auth_username  # Load necessary plugins
      - EMQX_AUTH__USER__1__USERNAME=sunrise_dev  # Set default MQTT username
      - EMQX_AUTH__USER__1__PASSWORD=yg123456  # Set default MQTT password
    restart: always
```

```
version: '3'

services:
  miannan_emqx:
    image: registry.lisong.pub:28500/hub/library/emqx:5.0
    restart: always  # 添加自启动
    environment:
    - "EMQX_NAME=emqx"
    - "EMQX_HOST=miannan.emqx.io"
    - "EMQX_LOADED_PLUGINS=emqx_management,emqx_dashboard,emqx_auth_username  # Load necessary plugins"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    network_mode: host  # 使用宿主机网络

```

```
version: '3'

services:
  miannan_emqx:
    image: registry.lisong.pub:28500/hub/library/emqx:5.0
    restart: always  # 添加自启动
    environment:
    - "EMQX_NAME=emqx"
    - "EMQX_HOST=miannan.emqx.io"
    - "EMQX_LOADED_PLUGINS=emqx_management,emqx_dashboard,emqx_auth_username"  # Load necessary plugins
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    network_mode: host  # 使用宿主机网络
    volumes:
      - /data/services/mqtt/conf/data:/opt/emqx/data  # 添加卷映射
      - /data/services/mqtt/conf/etc:/opt/emqx/etc

```


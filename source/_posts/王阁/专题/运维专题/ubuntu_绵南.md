ip: 192.168.8.79

user: ubuntu

passwd: Yg123456

---

```
version: '3'

services:
  miannan_emqx:
    image: emqx/emqx
    restart: always  # 添加自启动
    environment:
    - "EMQX_NAME=emqx"
    - "EMQX_HOST=miannan.emqx.io"
    - "EMQX_CLUSTER__DISCOVERY=static"
    - "EMQX_CLUSTER__STATIC__SEEDS=miannan@node1.emqx.io"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    networks:
      - miannan_network

networks:
  miannan_network:
    external: true
```

```
export https_proxy=http://192.168.10.5:7890 http_proxy=http://192.168.10.5:7890 all_proxy=socks5://192.168.10.5:7890
```

```
ALTER USER default IDENTIFIED BY 'Yg123456';
```

```
PASSWORD=$(base64 < /dev/urandom | head -c8); echo "Yg123456"; echo -n "Yg123456" | sha256sum | tr -d '-'
```

```
116
```


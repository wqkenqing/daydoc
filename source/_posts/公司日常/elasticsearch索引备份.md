
```

POST _reindex
{
  "source": {
    "index": "hy_traffic_baidu_five_minute",
    "size": 10000
  },
  "dest": {
    "index": "hy_traffic_baidu_five_minute_new",
    "routing": "=cat"
  }
}

```


https://blog.csdn.net/ctwy291314/article/details/82734667


Reindex api


https://segmentfault.com/a/1190000017044200

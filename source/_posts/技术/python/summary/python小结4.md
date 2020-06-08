title:  python小结4
date:  2020-06-02
tags:[python,connect]
---
python 常见的connect and operate 

 <!--more-->

 # python 小结4

 ## python connect redis

通过pip install redis 在python3中安装redis的包

```python

pool =redis.ConnectionPool(host='jd_cloud', port=6380, db=0, password='test123')
r = redis.Redis(connection_pool=pool)

```


## python connect kafka

### kafka producer

### kafka consumer 

#### 多种consumer

## python 文本处理



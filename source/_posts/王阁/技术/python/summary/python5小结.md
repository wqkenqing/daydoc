title:  python小结5
date:  2020-06-04
tags: [python,json,xml,poi]


---
csv, json ,poi处理
 <!--more-->

 ## csv
 ```python
 import csv

 ```
 主要用到的方式

 * csv.reader()
 * csv.writer()

读csv和写csv

## json

```python
import json


##针对对象
## 将python对象编码成json字符串, 返回json串
json.dumps()
## 将已编码的json串解码为python对象，返回python对应的数据类型
json.loads()

##针对文件的操作
json.dump()
json.load()


# 写入 JSON 数据
with open('data.json', 'w') as f:
    json.dump(data, f)
 
# 读取数据
with open('data.json', 'r') as f:
    data = json.load(f)
    
```

## elasticsearch

```python 
import 

```







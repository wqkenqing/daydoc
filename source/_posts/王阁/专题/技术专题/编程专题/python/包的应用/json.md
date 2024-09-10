# Python3 JSON 数据解析

[json用法](https://docs.python.org/zh-cn/3.7/library/json.html)

Python3 中可以使用 json 模块来对 JSON 数据进行编解码，它包含了两个函数：

- **json.dumps():** 对数据进行编码。
- **json.loads():** 对数据进行解码。

![img](http://img.wqkenqing.ren/typora_img/json-dumps-loads.png)

| JSON          | Python |
| ------------- | ------ |
| object        | dict   |
| array         | list   |
| string        | str    |
| number (int)  | int    |
| number (real) | float  |
| true          | True   |
| false         | False  |
| null          | None   |

#### load和loads

```
import json

dict = '{"name": "Tom", "age": 23}'   # 将字符串还原为dict
data1 = json.loads(dict)
print(data1, type(data1))

with open("test.json", "r", encoding='utf-8') as f:
    data2 = json.loads(f.read())    # load的传入参数为字符串类型
    print(data2, type(data2))
    f.seek(0)                       # 将文件游标移动到文件开头位置
    data3 = json.load(f)
    print(data3, type(data3))
```

#### dump和dumps

```
import json

# dumps可以格式化所有的基本数据类型为字符串
data1 = json.dumps([])         # 列表
print(data1, type(data1))
data2 = json.dumps(2)          # 数字
print(data2, type(data2))
data3 = json.dumps('3')        # 字符串
print(data3, type(data3))
dict = {"name": "Tom", "age": 23}   # 字典
data4 = json.dumps(dict)
print(data4, type(data4))

with open("test.json", "w", encoding='utf-8') as f:
    # indent 超级好用，格式化保存字典，默认为None，小于0为零个空格
    f.write(json.dumps(dict, indent=4))
    json.dump(dict, f, indent=4)  # 传入文件描述符，和dumps一样的结果

```

总结：
```
json.dumps 将 Python 对象编码成 JSON 字符串
json.loads 将已编码的 JSON 字符串解码为 Python 对象
json.dump和json.load,需要传入文件描述符，加上文件操作。
JSON内部的格式要注意，一个好的格式能够方便读取，可以用indent格式化。
```




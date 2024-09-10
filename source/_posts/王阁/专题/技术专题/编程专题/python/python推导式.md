# Python 推导式

Python 推导式是一种独特的数据处理方式，可以从一个数据序列构建另一个新的数据序列的结构体。

Python 支持各种数据结构的推导式：

- 列表(list)推导式
- 字典(dict)推导式
- 集合(set)推导式
- 元组(tuple)推导式

---

## 列表推导式

```
[表达式 for 变量 in 列表] 
[out_exp_res for out_exp in input_list]

或者 

[表达式 for 变量 in 列表 if 条件]
[out_exp_res for out_exp in input_list if condition]
```

- out_exp_res：列表生成元素表达式，可以是有返回值的函数。
- for out_exp in input_list：迭代 input_list 将 out_exp 传入到 out_exp_res 表达式中。
- if condition：条件语句，可以过滤列表中不符合条件的值。

![CleanShot 2024-05-20 at 16.26.18@2x](https://kuiqwang.oss-cn-chengdu.aliyuncs.com/blog/CleanShot%202024-05-20%20at%2016.26.18@2x.png)

![CleanShot 2024-05-20 at 16.26.39@2x](https://kuiqwang.oss-cn-chengdu.aliyuncs.com/blog/CleanShot%202024-05-20%20at%2016.26.39@2x.png)

---

![CleanShot 2024-05-20 at 16.31.18@2x](https://kuiqwang.oss-cn-chengdu.aliyuncs.com/blog/CleanShot%202024-05-20%20at%2016.31.18@2x.png)

## 字典推导式

```
{ key_expr: value_expr for value in collection }

或

{ key_expr: value_expr for value in collection if condition }
```

使用字符串及其长度创建字典：

![CleanShot 2024-05-20 at 16.34.17@2x](https://kuiqwang.oss-cn-chengdu.aliyuncs.com/blog/CleanShot%202024-05-20%20at%2016.34.17@2x.png)

## 集合推导式

```
{ expression for item in Sequence }
或
{ expression for item in Sequence if conditional }
```

## 元组推导式（生成器表达式）

```
(expression for item in Sequence )
或
(expression for item in Sequence if conditional )
```

元组推导式可以利用 range 区间、元组、列表、字典和集合等数据类型，快速生成一个满足指定需求的元组。

元组推导式和列表推导式的用法也完全相同，只是元组推导式是用 **()** 圆括号将各部分括起来，而列表推导式用的是中括号 **[]**，另外元组推导式返回的结果是一个生成器对象。
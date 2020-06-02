title:  python小结3
date: 2020-05-29
tags: [python]

---

 <!--more-->

 # python小结3

## 模块





## 面向对象
### 类与实例

python类的声()明会在类名上加
os.rmdir()

eg

```python

class Student(object):
    pass
```

构造函数
```python
def __init__(self,field1,field2):
    pass
```

### 访问控制

python中 私有属性是通过 __来标识,用__标识后则表示该属性是这个类的私有属性,则意味着直接通过一般的*.__是难以访问到的.

如果是_的形式,则也是声明将这个认作是私有变量的属性,但却是可以直接通过*._*的形式进行访问的.


`
注意:__的属性并不是完全不能用实例直接访问,如Student类为例通过student._Stuent__name的形式也能直接访问

从这里来看,这一点是不太符合面向对象编程的精神的,也就是说python解释器不会从根本上防止你乱搞,取用哪种编程规范主要还是要靠自觉

`

### 继承与多态

总得来讲与java类似.但因为python是动态语言,所以它符合"鸭子类型"的特点,即在多态使用时,只要具有同样的方法,即可接收调用.

### 获取对象信息

通过types模块下的type()方法来获取对象类型

通过isinstance()来判断是否是这个类,可用于测试继承,也可通过逗号分隔,测试是不是这些类其中之一
通过dir()获取一个对象的所有属性和方法

### 实例属性与类属性

python 是动态语言,所以可以在创建实例后再赋值

eg:
```python

student=Stuent()
student.score=90

```
即这score是后续才赋值上去的.

这就是实例属性

而本身类需要绑定一些属性呢,这就可以直接定义在class中,即类属性.

```python
class Student(object):
    name='ken'
    age=18

```
## 面向对象进阶

### 使用__slots__

因为动态语言的特性,python实例在创建后还能再绑定方法与属性. 这里如果我们想要约束只绑定某些属性时可以通过

__slots__(a,b)的形式来操作.


#


注意:该类若被子类继承,在子类未定义__slots__时,子类实例是不会生效的.


### @property

类似java getter

@feild.setter

### 多重继承
因为python是动态语言,所以能够继承多个类,但需要考虑下设计理念,即扩展继承时,扩展继承的类可以命名为**Runnable,与 XXMixIn

### 定制类的方法
__init__
__iter__
__str__

等方法,这些方法统一后面来整理

### 枚举类

### 元类有些类似反射

后面再定向研究


## 错误与调试

try...except...finally..

## 文件读写

### 读文件
要以读文件的模式打开一个文件对象，使用Python内置的open()函数，传入文件名和标示符：

file open 最后需要file.close 

可以通过with open("path",'') as f : 的写法来简写,这样写不用写f.close()

open('path','rb') //这样写才是读文件

读时,f.read()会将文件全量写到内存里去,所以小文件这么简写还能接受,但若文件较大,内存会有较大压力.

f.read(size),则是一次读取内容的大小.

f.readlines()则是读成list的形式.

open('path','wb')//这样获取的文件操作实例是写对象

f.write("content")

同样也可以用with的写法来获取对象

`前者写对象的获取的实例,若文件存在,则会覆盖该文件`

open('path','wba')这样的写法是续写文件


### 内存数据操作(StringIO ByteIO)


### 操作文件和目录
os.path.join
os.path
os.path.exists()

os.mkdir()
os.rmdir()

os.path.abspath()
## 常用包

datetime.datetime

即datetime包下的datetime类

``` python
import datetime.datetime
or 
from datetime import datetime
```

### 获取当前时间

datetime.now()

### 获取指定的时间

dt=datetime(2020,05,23,12,32)

`转成timestamp`
dt.timestamp()

`timestamp to datetime`

datetime.fromtimestamp(t)

`转成格林制式时间`
datetime.utcfromtimestamp(t)

`str转成datetime`



## collections
### namedtuple

### deque ("双向列表")

### defaultdict

使用dict时，如果引用的Key不存在，就会抛出KeyError。如果希望key不存在时，返回一个默认值，就可以用defaultdict：


### OrderedDict

注意，OrderedDict的Key会按照插入的顺序排列，不是Key本身排序：


### ChainMap(再研究)

### Counter

Counter实际上也是dict的一个子类，上面的结果可以看出每个字符出现的次数。


## sqlite



```
import sqlite3


con = sqlite3.connect("demo.db")


def s():
    curs = con.cursor()
    sql = (f"create table demo("
           f"d_id int(32),"
           f"d_name varchar(50),"
           f"d_no varchar(50))")
    curs.execute(sql)
    con.commit()
```

## mysql 

### mysql-connector

```
def m_connect():
    config = {
        "host": "scm-server",
        "user": "scm",
        "password": "scm",
        "database": "douyin"
    }
    connection = mysql.connector.connect(**config)
    cur = connection.cursor()
    sql = "select * from douyin_work"
    cur.execute(sql)
    res = cur.fetchall()
    print(res[0][0])
    pass
```

### sqlalchemy

不同数据库和API链接数据库的操作格式：

```
MySQL-Python
    mysql+mysqldb://<user>:<password>@<host>[:<port>]/<dbname>
 
pymysql
    mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
 
MySQL-Connector
    mysql+mysqlconnector://<user>:<password>@<host>[:<port>]/<dbname>
 
cx_Oracle
    oracle+cx_oracle://user:pass@host:port/dbname[?key=value&key=value...]
 
更多详见：http://docs.sqlalchemy.org/en/latest/dialects/index.html
```



```
def sql_1():
    engine = sa.create_engine('mysql+mysqlconnector://scm:scm@scm-server/douyin')
    res=engine.execute("select * from douyin_work")
    print(res.fetchone())
```


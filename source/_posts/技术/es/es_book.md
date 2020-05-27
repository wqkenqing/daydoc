`根据ElasticSearch book来进行一些归纳`

大致可以将内容分为两在块

1. crud相关操作
2. es服务端运行的内容

前者作为一个开发者会常常用到,后者则是有对服务端有一定维护权限的人,可以需要了解.

所以我这里先从crud相关操作内容开始.

这里先假设是单节点

http://node1:9200



主要内容来自官网

[es7.1](https://www.elastic.co/guide/en/elasticsearch/reference/7.1/index.html)



## 





[TOC]



## 说明

es7.x能够自动匹配字段类型.所以官网建议,index的自定义mapping设置,在以下几种情况下才进行

1. 区别分文本与精确字符值(keyword ,text)
2. 配置具体的语言解析器
3. 优化字字段的部份匹配
4. date格式化
5. 一些如geo_point之类,无法自动匹配的字段类型

Q:若想同时使用text and keyword

A:通过配置解析器来实现

### T:怎么配置解析器来实现



### search and analysize

REST APIs

1. structured queries
2. full text queries
3. complex queries



search

1. individual terms
2. phrase searches
3. similarity searches
4. prefix searches

## 索引

## search

```
GET /indexName/_search

{

}
```



the response

1. `took` – how long it took Elasticsearch to run the query, in milliseconds
2. `timed_out` – whether or not the search request timed out
3. `_shards` – how many shards were searched and a breakdown of how many shards succeeded, failed, or were skipped.
4. `max_score` – the score of the most relevant document found
5. `hits.total.value` - how many matching documents were found



### query

#### match_all

匹配所有

#### match 

匹配单个检索词,即是把text中的内容进行切词.并按单个进行匹配.

#### match_phrase



#### bool

1. must
2. must_not
3. should

#### 

1. range
2. 




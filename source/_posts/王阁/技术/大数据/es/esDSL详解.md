title:  elasticsearch dsl 详解
date: 2020-06-16
tags: [dsl,elasticsearch]

---
 <!--more-->

 # DSL

 dsl the full name is 
`Domain Specific Language`

it is divided to two parts 

Leaf query clauses:

particular query such as :term, match,range


Compound query clauses:

Compound query clauses wrap other leaf or compound queries and are used to combine multiple queries in a logical fashion (such as the bool or dis_max query), or to alter their behaviour (such as the constant_score query).


 ## Match all query

全文查询，用于对分词的字段进行搜索。会用查询字段的分词器对查询的文本进行分词生成查询。可用于短语查询、模糊查询、前缀查询、临近查询等查询场景

`query_all`

```
GET /_search
{
    "query": {
        "match_all": {}
    }
}

```

## Full text queries

### match 
### match_phrase

对句子,进行短语查询 

### match_phrase_prefix
### multi_match
### common terms 
### query_string 
### simple_query_string 
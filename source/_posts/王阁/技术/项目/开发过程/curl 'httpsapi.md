```
curl 'https://api.notion.com/v1/users' \
  -H 'Authorization: Bearer "secret_zfm2jh7s9oLGLGPDaZikI3SkN1xxV9TtHVbp1trM4nj"' \
  -H "Notion-Version: 2022-06-28"
```

```
curl 'https://api.notion.com/v1/users' \
  -H 'Authorization: Bearer '"secret_zfm2jh7s9oLGLGPDaZikI3SkN1xxV9TtHVbp1trM4nj"'' \
  -H "Notion-Version: 2022-06-28"
```

```
curl 'https://api.notion.com/v1/pages/Python-655a71827c5d47c787b160ddef220eaf' \
  -H 'Notion-Version: 2022-06-28' \
  -H 'Authorization: Bearer '"secret_zfm2jh7s9oLGLGPDaZikI3SkN1xxV9TtHVbp1trM4nj"''
```

```
curl 'https://api.notion.com/v1/users/me' \
  -H 'Authorization: Bearer '"secret_zfm2jh7s9oLGLGPDaZikI3SkN1xxV9TtHVbp1trM4nj"'' \
  -H "Notion-Version: 2022-06-28" \
```

```
curl 'https://api.notion.com/v1/pages/0c1e8114feb246a6946d357f9f2073e4' \
  -H 'Notion-Version: 2022-06-28' \
  -H 'Authorization: Bearer '"secret_zfm2jh7s9oLGLGPDaZikI3SkN1xxV9TtHVbp1trM4nj"''
```





现有流程是：

1. 业主提供文件

2. 我们收到文件进行分析

3. 摘取文件内容，选择我们需要的字段。

4. 将摘取出的字段与我们大屏用应层的字段信息进行匹配

5. 完成导入

   ---

   期望流程是：

   1. 我们提供导入标准模版
   2. 业主按标准模版摘录导入文件
   3. 将整理好的标准数据文件导入

   ---

   

   

   接口采集现有流程:

   1. 业主提供采集接口协议文档
   2. 分析采集文档或与对方开发人员进行沟通
   3. 开发与调试
   4. 发布服务，开始采集

   

接口采集期望流程:

1. 我们提供标准的采集文档，约定相关规则
2. 对方按规定供相应的采集服务接口
3. 对接与调度
4. 发布服务，开始采集
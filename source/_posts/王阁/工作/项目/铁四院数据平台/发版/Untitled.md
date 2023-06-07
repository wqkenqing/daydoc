```

kubectl get pod pre-sxsddsj-main-64574bb98f-bz2hj -o yaml | kubectl replace --force -f -
```





```
应用 sxsddsj-auth-center 没有更新，跳过
应用 sxsddsj-file-server 更新，版本变更 7331 -> 11168
执行 kubectl set image deployments/pre-sxsddsj-file-server app=registry.lisong.pub:28500/sxsddsj/sxsddsj-file-server:v11168
deployment.apps/pre-sxsddsj-file-server image updated
应用 sxsddsj-main 更新，版本变更 11025 -> 11193
执行 kubectl set image deployments/pre-sxsddsj-main app=registry.lisong.pub:28500/sxsddsj/main:v11193
deployment.apps/pre-sxsddsj-main image updated

应用 sxsddsj_web 更新，版本变更 11036 -> 11198
执行 kubectl set image deployments/pre-sxsddsj-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_web:v11198
deployment.apps/pre-sxsddsj-web image updated
应用 sxsddsj_big_screen 更新，版本变更 10931 -> 11163
执行 kubectl set image deployments/pre-sxsddsj-big-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_big_screen:v11163
deployment.apps/pre-sxsddsj-big-web image updated
```





```
 kubectl set image deployments/pre-sxsddsj-big-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_big_screen:v11270
```



```
kubectl set image deployments/pre-sxsddsj-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_web:v11269
```





```
kubectl get pod  pre-sxsddsj-data-center-clickhouse-85cccd4465-79kzc -o yaml | kubectl replace --force -f -
```









```
应用 sxsddsj-auth-center 更新，版本变更 11034 -> 11098
执行 kubectl set image deployments/pre-sxsddsj-auth-center app=registry.lisong.pub:28500/sxsddsj/auth-center:v11098
deployment.apps/pre-sxsddsj-auth-center image updated
```

```
kubectl set image deployments/pre-sxsddsj-file-system app=registry.lisong.pub:28500/sxsddsj/pre-sxsddsj-file-system:v11137
```

```
kubectl get pod pre-sxsddsj-file-system-7597c5c767-ddbnh -o yaml | kubectl replace --force -f -
```







```
 kubectl set image deployments/pre-sxsddsj-main app=registry.lisong.pub:28500/sxsddsj/main:v11251
```

```

kubectl set image deployments/pre-sxsddsj-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_web:v11253 
```





```
kubectl set image deployments/pre-sxsddsj-web webapp=registry.lisong.pub:28500/sxsddsj-fe/sxsddsj_web:v11262 
```





```
docker run  -d -p 9000:9000  --name myminio -e "MINIO_ROOT_USER=minioadmin" -e "MINIO_ROOT_PASSWORD=minioadmin" -v /home/wangserver/minIO:/data minio/minio server /data

```


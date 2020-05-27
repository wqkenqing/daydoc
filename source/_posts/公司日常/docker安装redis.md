docker run -p 6379:6379 -v $PWD/data:/data  -d redis:3.2 redis-server --appendonly yes
43f7a65ec7f8bd64eb1c5d82bc4fb60e5eb31915979c4e7821759aac3b62f330



docker run -p 6379:6379 -v /docker/redis/data:/data  -d redis:3.2 redis-server --appendonly yes
43f7a65ec7f8bd64eb1c5d82bc4fb60e5eb31915979c4e7821759aac3b62f330


docker run -d --privileged=true --restart=unless-stopped  -p 6379:6379 -v /docker/redis/conf/redis.conf:/etc/redis/redis.conf -v /docker/redis/data:/data --name redis redis:latest redis-server /etc/redis/redis.conf --appendonly yes

docker run -d --privileged=true --restart=unless-stopped  -p 6379:6379 -v /root/docker/redis/conf/redis.conf:/etc/redis/redis.conf -v //root/docker/redis/data:/data --name redis redis:latest redis-server /etc/redis/redis.conf --appendonly yes

docker run -d --privileged=true --restart=unless-stopped  -p 6380:6379 -v /root/docker/redis/conf/redis.conf:/etc/redis/redis.conf -v /root/docker/redis/data2:/data --name redis1 redis:latest redis-server /etc/redis/redis.conf --appendonly yes

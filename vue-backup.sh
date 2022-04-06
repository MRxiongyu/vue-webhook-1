#! /bin/bash
cd /usr/projects/vue-backup || exit
echo '清空代码'
git reset --hard origin/main
git clean -f
echo '拉取代码'
git pull origin main
echo '构建docker容器'
docker build -t vue-backup:0.0.1 .
echo '删除旧容器'
docker stop vue-backup-container
docker rm vue-backup-container
echo '创建容器'
docker container run -p 3000:3000 vue-backup-container -d vue-backup:0.0.1



#! /bin/bash
cd /usr/projects/vue-web || exit
echo '清空代码'
git reset --hard origin/main
git clean -f
echo '拉取代码'
git pull origin main
echo '下载node_module'
npm install
echo '构建前端代码'
npm run build
echo '构建docker容器'
docker build -t vue-web:0.0.1 .
echo '删除旧容器'
docker stop vue-web-container
docker rm vue-web-container
echo '创建容器'
docker container run -p 80:80 --name vue-web-container -d vue-web:0.0.1



#!/usr/bin/env bash
rm -rf dist/*

npm run build-dev

echo "删除远程文件..."
ssh root@39.98.232.64 "rm -rf /opt/web/deploy/static/sinan-admin/*"
echo "删除远程文件完成"

echo "拷贝文件到远程服务器..."
scp -r dist/* root@39.98.232.64:/opt/web/deploy/static/sinan-admin
echo "拷贝文件到远程服务器完成"

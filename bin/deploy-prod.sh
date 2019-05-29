#!/usr/bin/env bash

rm -rf dist/*
npm run build-product

echo "删除远程文件..."
ssh root@47.111.12.191  "rm -rf /usr/local/nginx/bops/*"
echo "删除远程文件完成"

echo "拷贝文件到远程服务器..."
scp -r dist/* root@47.111.12.191:/usr/local/nginx/bops/
echo "拷贝文件到远程服务器完成"

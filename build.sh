#!/bin/bash
target="~/workspace/xiaxianlin.github.io/components/"
echo '删除构建文件'
rm -rf build
echo '删除目标文件'
rm -rf ~/workspace/xiaxianlin.github.io/components
mkdir ~/workspace/xiaxianlin.github.io/components
echo '开始打包'
npm run build
echo 'move index.html'
cp index.html ~/workspace/xiaxianlin.github.io/components
echo 'move static fold'
cp -r static ~/workspace/xiaxianlin.github.io/components
echo 'move build fold'
cp -r build ~/workspace/xiaxianlin.github.io/components
echo 'upload to github'
cd ~/workspace/xiaxianlin.github.io/
git add .
git commit -m 'upload components'
git push origin master
echo 'url: http://xiaxianlin.github.io/components'

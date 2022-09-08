#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add .
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io  填写你刚刚创建的仓库地址
# git remote add origin https://github.com/sanyuan0704/my_blog.git
# git remote add origin https://github.com/1120507206/zcblog.git

# git push -f origin  master:master
# git push -f git@github.com:1120507206/zcblog.git master:gh-pages
# git@github.com:1120507206/zcblog.git
git push -f git@github.com:1120507206/zcblog.git master:gh-pages
cd ..

tcb hosting:deploy public -e blog-9g8lgnuke4603ff9



#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e


# push_addr=`git@github.com:1120507206/zcblog.git` # git提交地址，也可以手动设置，比如：push_addr=git@github.com:xugaoyi/vuepress-theme-vdoing.git
# commit_info=`git describe --all --always --long`
# dist_path=docs/.vuepress/dist # 打包生成的文件夹路径
# push_branch=gh-pages # 推送的分支

# # 生成静态文件
# npm run build

# # 进入生成的文件夹
# cd $dist_path

# git init
# git add -A
# git commit -m "deploy, $commit_info"
# git push -f $push_addr HEAD:$push_branch

# cd -
# rm -rf $dist_path

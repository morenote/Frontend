# 概述

MoreNote的前端项目

# 开发
```
fork this
git clone this
```
## 安装node.js
```shell
cd Frontend #进入工作文件夹
node -v # 查看 Node.js 当前版本
npm install -g pnpm #安装pnpm
pnpm config set registry https://registry.npmmirror.com/ #设置淘宝镜像（可选）
yarn global add @angular/cli #安装Angular Cli
pnpm install 安装依赖
```
## IDE选择
我个人使用了WebStorm2022版本

也可以使用VS Code 作为开发工具

## 编译运行
```shell
ng s -o --port 3201 #调试
pnpm run ng-high-memory build #编译
```

## 关于后端

### mock
本项目还未实现mock
### 直接使用远程后端
如果不涉及到与后端联调，可以使用服务器的api端口
设置浏览器的localStorage，增加baseURL=https://www.morenote.top
### 本地搭建模拟
设置浏览器的localStorage，增加debug=1
在本地浏览器运行后端服务，搭建方法请查阅[Server搭建文档](https://github.com/morenote/Server/tree/master/Documents)

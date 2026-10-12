# Tlias 智能学习辅助系统

基于 **Vue 3 + Vite + Element Plus** 构建的后台管理系统前端项目，用于智能学习辅助平台的班级学员管理、系统信息维护及数据统计分析。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.2 | 渐进式 JavaScript 框架 |
| Vite | ^3.0 | 前端构建工具 |
| Element Plus | ^2.4 | Vue 3 桌面端组件库 |
| Vue Router | ^4.1 | 官方路由管理器 |
| Axios | ^1.7 | HTTP 请求库 |
| ESLint + Prettier | - | 代码规范与格式化 |

## 功能模块

```
├── 首页                          # 系统首页/仪表盘
├── 班级学员管理
│   ├── 班级管理                   # 班级信息 CRUD
│   └── 学员管理                   # 学员信息 CRUD
├── 系统信息管理
│   ├── 部门管理                   # 部门信息 CRUD
│   └── 员工管理                   # 员工信息 CRUD
├── 数据统计管理
│   ├── 员工信息统计                # 员工维度数据统计
│   ├── 学员信息统计                # 学员维度数据统计
│   └── 日志信息统计                # 操作日志统计
└── 登录                          # 用户登录
```

## 项目结构

```
vue-tlias-management/
├── public/                       # 静态资源（不经过编译）
├── src/
│   ├── api/                      # 接口请求封装
│   │   ├── dept.js               # 部门相关接口
│   │   └── emp.js                # 员工相关接口
│   ├── assets/                   # 静态资源（图片、样式等）
│   ├── router/                   # 路由配置
│   │   └── index.js
│   ├── utils/                    # 工具函数
│   │   └── request.js            # Axios 请求封装
│   ├── views/                    # 页面组件
│   │   ├── clazz/                # 班级管理
│   │   ├── dept/                 # 部门管理
│   │   ├── emp/                  # 员工管理
│   │   ├── index/                # 首页
│   │   ├── layout/               # 布局框架
│   │   ├── log/                  # 日志统计
│   │   ├── login/                # 登录页
│   │   ├── report/               # 数据统计
│   │   └── stu/                  # 学员管理
│   ├── App.vue                   # 根组件
│   └── main.js                   # 入口文件
├── index.html                    # Vite 入口 HTML
├── vite.config.js                # Vite 配置文件
├── package.json
├── .eslintrc.cjs                 # ESLint 配置
└── .prettierrc.json              # Prettier 配置
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```sh
npm install
```

### 启动开发服务器

```sh
npm run dev
```

启动后浏览器访问终端提示的本地地址（默认 `http://localhost:5173`）。

### 构建生产版本

```sh
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```sh
npm run preview
```

### 代码检查

```sh
npm run lint
```

## 后端接口

开发环境下通过 Vite 代理将 `/api` 前缀的请求转发至后端服务：

- 代理目标：`http://localhost:8080`
- 配置位置：[vite.config.js](vite.config.js)

## IDE 推荐

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
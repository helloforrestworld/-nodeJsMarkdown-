# node.js笔记

标签（空格分隔）： 笔记整理

---

在此输入正文

# 搭建基础
## nvm node版本管理工具
```javascript
    nvm use 4.4.0
    npm install gulp-cli -g
    
    nvm list available 有效的node版本
    
    nvm install latest
    
    nvm instal  版本号
    
    nvm install stable
    
    nvm install stable defalut
```

## 权限问题

在Linux系统下，使用NodeJS监听80或443端口提供HTTP(S)服务时需要root权限
需要 sudo node server.js


## 模块
1.核心模块 node运行前加载 存储在内存中
2.文件模块 用户编写的js模块 或者node模块(二进制)

所有模块在执行过程中只初始化一次

## 模块路径解析规则
1.内置模块 如果传递给require函数的是NodeJS内置模块名称，不做路径解析，直接返回内部模块的导出对象，例如require('fs')。
2.假设执行/home/user/hello.js时 require('foo/bar'),会尝试以下路径
```javascript
    '/home/user/node_modules/foo/bar'
    'home/node_modules/foo/bar'
    'node_modules/foo/bar'
```
3.设定NODE_PATH环境变量
NodeJS允许通过NODE_PATH环境变量来指定额外的模块搜索路径
```javascript
    // 注意 多个路径linix 下用 ：分隔 windows下则使用;
    NODE_PATH=/home/user/lib:/home/lib
```
从项目的根位置递归搜寻 node_modules 目录，直到文件系统根目录的 node_modules，如果还没有查找到指定模块的话，就会去 NODE_PATH中注册的路径中查找。

## 包(package)
由多个子模块组成的大模块称做包，并把所有子模块放在同一个目录里。
```javascript
// cat 为一个模块 main.js作为入口文件 
- /home/user/lib/
    - cat/
        head.js
        body.js
        main.js
// require('/home/user/lib/cat/main')
```
但是将main入口文件名出现在路径中并不是很简洁
当加载模块的名字是index.js时可以省略 require('/home/user/lib/cat/index') 等价于 require('/home/user/lib/cat');
所以简化的方式就是 创建一个index.js

package.json可以自定义入口模块的文件名和存放位置
```javascript
    // package.json
    {
        "name": "cat",
        "main": "./lib/main.js"
    }
    
    // 目录结构
    - /home/user/lib/
    - cat/
        + doc/
        - lib/
            head.js
            body.js
            main.js
        + tests/
        package.json
```
如此一来，就同样可以使用require('/home/user/lib/cat')的方式加载模块。NodeJS会根据包目录下的package.json找到入口模块所在位置
## 命令行程序
在Windows下依赖的是.cmd文件
假设当前脚本路径A:\github\nodejs\node-echo.js
那么在当前目录新建一个cmd文件，内容为
```cmd
    @node "A:\github\nodejs\node-echo.js" %*
```
然后环境配置中指定A:\github\nodejs, 完成后就可以在任意位置执行node-echo命令
在Linux下则可以把js当作shell脚本运行
1.js文件开头加上 #! /usr/bin/env node 标记脚本解析器
2.然后赋予node-echo.js文件执行权限
```javascript
    $ chmod +x A:\github\nodejs\node-echo.js
```
3.最后在PATH环境变量指定的某个目录下,如/usr/local/bin下边创建一个软链文件，文件名与我们希望使用的终端命令同名，命令如下：
```javascript
    $ sudo ln -s A:\github\nodejs\node-echo.js /usr/local/bin/node-echo
```
## 工程目录
```
- /home/user/workspace/node-echo/   # 工程目录
    - bin/                          # 存放命令行相关代码
        node-echo
    + doc/                          # 存放文档
    - lib/                          # 存放API相关代码
        echo.js
    - node_modules/                 # 存放三方包
        + argv/
    + tests/                        # 存放测试用例
    package.json                    # 元数据文件
    README.md                       # 说明文件
```
## NPM
版本号 语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。
+ 如果只是修复bug，需要更新Z位。
+ 如果是新增了功能，但是向下兼容，需要更新Y位。
+ 如果有大变动，向下不兼容，需要更新X位。

# 文件操作
## 拷贝
### 小文件拷贝
```javascript
    var fs = require('fs');
    
    function copy(src, dst) { // 读取和写入
        fs.writeFileSync(dst, fs.readFileSync(src));
    }
    
    function main(argv) {
        copy(argv[0], argv[1]);
    }
    
    main(process.argv.slice(2));
```
### 大文件拷贝
像之前那样一次性从磁盘读取到内存,再从内存写入磁盘,如果文件过大，内存会被撑满
```javascript
    var fs = require('fs');
    
    function copy(src, dst) {
        fs.createReadStream(src).pipe(fs.createWriteStream(dst));
    }
    
    function main(argv) {
        copy(argv[0], argv[1]);
    }
    
    main(process.argv.slice(2));
```
createReadStream创建只读数据流，createWriteStream创建只写数据流, pipe()连接起来
## API
### Buffer(数据块/缓冲器)
JS语言本身没有二进制数据， Node提供Buffer构造函数操作二进制数据
#### buffer创建
```javascript
    let buf = new Buffer([0x92, 0x21, 0x21]) // 每个字节用16进制表示
    let buf = new Buffer('hello', 'utf-8') // 也可以通过字符串转换创建
    let buf = new Buffer(5) // 声明长度为5的buffer
    
    // 也可以直接修改某个字节
    buf[0] = 0x99
    
    let str = buf.toString('utf-8) // 转换为字符串
```
slice方法的问题
与字符串不同的时字符串修改返回的是新的字符串, buffer修改则是修改本身
```javascript
    let buf = new Buffer([0x92, 0x21, 0x21, 0x44])
    let buf1 = buf.slice(2)
    let buf1[0] = 0x99
    console.log(buf, buf1)
    // <Buffer 0x92, 0x21, 0x99, 0x44 >
    // <Buffer 0x99, 0x44 >
    // slice像是返回了指向原Buffer中间的某个位置的指针
```
#### buffer复制
声明一个新的buffer, 调用buffer.copy
```javascript
    let bin = new Buffer([0x92, 0x21, 0x21, 0x44])
    let newBin = new Buffer(bin.length)
    bin.copy(newBin)
```
### stream(数据流)
对二进制数据的抽象，可以读取/生成 一部分  的同时 写入/处理 一部分
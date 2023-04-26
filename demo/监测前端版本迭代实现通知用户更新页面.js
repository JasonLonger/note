## 背景
日常开发项目中，我们一般会分三个环境：`1️⃣测试环境、2️⃣预发布环境、3️⃣正式环境`

作为每天不是在写`BUG`就是在改`BUG`路上的前端攻城狮(～￣▽￣)～表示会每天经常进行测试服代码`更新迭代`，每周固定时间进行正式服`发版`(•_•)。

## 存在问题✍：

当我们前端频繁进行版本迭代的时候，使用webpack对迭代项目进行打包时会配置`chunkhash`对JS和CSS文件进行缓存控制，但项目的`index.html`在迭代更新过程中会被`浏览器缓存`。

---
**浏览器缓存❗**

浏览器缓存分两种：`强制缓存`和`协商缓存`，具体可以自行搜索了解，网上教程丰富，这里不过多阐述。

浏览器缓存是`前端优化`重要方向，主要带来三方面便利：

   1. 减少冗余的数据传输，节省带宽；

   2. 减轻服务器的请求负担，有缓存就减少服务器`请求量`，尤其是对于一些访问量大的网站这点还是很重要的；

   3. 资源从缓存中读取，无需向服务器发送请求再等待返回，加快了客户端的访问速度，`降低首屏加载`时间。

---

这么看来浏览器缓存确实`好处多多`，但当我们频繁进行版本迭代时，也会存在以下问题：

发版后，用户在不进行`强制刷新页面操作`，浏览器依旧使用`旧缓存index.html`文件，造成一些问题：
    
  1. 没有及时获取到我们更新的资源，出现信息差，影响用户使用。
  
  2. 向服务器端请求了`上个版本`chunkhash的JS和CSS文件时，页面404（上个版本`chunkhash`的js和css在版本更新时已替换删除了）等。
  
`所以，如何在版本更新通知正在浏览页面的用户是个提高用户体验不错的优化。`
 
## 解决方案
#### 1️⃣解决思路（默认Vue项目情况，React思路类似）
  1. 使用webpack插件（`hash-webpack-plugin、build-hash-webpack-plugin`），打包生成一个版本`hash文件`，存入localStorage。
  
  2. 引入websocket，[心跳测试](https://juejin.cn/post/7023637905629249543)断开情况下请求当前版本`hash文件`。
`这里也可以后端获取代码更新进而通知前端，触发时机根据具体场景评估，用心跳测试方法可以完全归于前端优化。`
  
  3. 获取当前localStorage hash值对比，不同则通知提醒用户“检测到系统更新，请保存当前工作内容后刷新页面”。
`这里通知方式与文案可以根据具体需求进行调整，你也可以强制更新之类。`

#### 2️⃣项目代码
使用hash-webpack-plugin进行生成hash文件

```
// vue.config.js

const HashPlugin = require('hash-webpack-plugin') // 引入插件
...
mmodule.exports = {
    chainWebpack: config => {
        config
            .plugin('hash')
            .use(HashPlugin, [{
                // hash文件名
                fileName: 'version.json', 
                // 路径根据自身打包路径进行配置，这里影响到后面hash文件请求路径
                path: process.env.VUE_APP_outputDir + '/static'
            }])
    }
    ...
    configureWebpack: {
        plugins: [ // 配置插件
            new HashPlugin({ 
                // hash文件名
                fileName: 'version.json', 
                // 路径根据自身打包路径进行配置，这里影响到后面hash文件请求路径
                path: process.env.VUE_APP_outputDir + '/static'
            })
        ]
    }
    ...
}

```
---

```
// src/views/index.vue

methods: {
    // 校验版本hash值
    async checkVersionHash() {
        try {
            const { data } = await this.$http.get(`./static/version.json?t=${new Date().getTime()}`)
            // 加入时间戳避免被浏览器缓存
            const oldHash = localStorage.getItem('__VERSION')
            if (oldHash && data !== oldHash) {
                Notification({
                    title: '提示',
                    type: 'warning',
                    message: '发现新版本，请保存工作进度后手动刷新页面',
                    position: 'top-left'
                })
            } else {
                localStorage.setItem('__VERSION', data)
            }
        } catch (err) {
            console.log(err)
        }
    },
    // 连接socket
    async connectSocket () {
        const href = location.href
        let baseUrl = ''
        
        // socket请求不走axios拦截，故需要进行环境区分
        if (href.indexOf('正式服域名前缀')) {  // 正式服
            baseUrl = '正式服域名前缀'
        } else if (href.indexOf('预发布服域名前缀')) { // 预发布服
            baseUrl = '预发布服域名前缀'
        } else { // 测试服环境
            baseUrl = '测试域名前缀'
        }
        
        const that = this
        // 兼容https协议情况
        const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
        const ws = new WebSocket('${protocol}://${baseUrl}/xxx')
        await this.checkVersionHash() // 调用校验方法
        
        ws.open = () => {
            that.send('connect success')
        }
        
        ws.onmessage = e => {
            // 心跳测试
            clearInterval(that.Timer)
            // 如果一定时间（和后端约定的时间，后端回传时间要小于定时器时间）
            // 没有调用clearInterval,则触发定时器执行重连
            that.Timer = setInterval(() => {
                that.connectSocket()
            }, 20000)
        }
    }
},
mounted () { this.connectSocket() }
```

## 注意点

**本地请求JSON路径配置问题**

请求本地Hash Json时候，本地开发地址和线上地址是不同的，这里得根据不同项目打包路径配，一般基于线上服务器相对路径进行配置。

**例如：**

项目打包后，打包路径位于`../be/static`

Hash Json生成在`../be/static/static/version.json`

那么这时候配置请求url就需要基于根目录配，根目录即`../be/static`，即`与index.html同级`，那么请求路径即：`'./static/version.json'`

**websock路径配置问题**

1. 需要区分环境，不同环境域名前缀不同，这点要注意
2. 需要区分https还是http，对应wss或者ws，https后端需要额外做配置才行。


#### 补充
假如有需求需要存前端实现版本更新通知功能，则可以考虑利用定时器，但单纯定时器可能对性能有消耗，这里可以考虑将定时器丢到`web worker`里面做，可参考大佬阮一峰[文章](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)


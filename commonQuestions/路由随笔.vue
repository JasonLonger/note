✨单页面：服务只有一个index.html静态文件，前端生成丢到服务器上，这个过程经历部署阶段，所有操作都在这个html中进行
✨路由：通过一定机制，监听用户的行为动作，从而让页面局部或全部作出对应变化，即通过浏览器提供的方法或者对象及其方法进行监听，进而渲染不同模块；
  例如hash模式，是利用浏览器hashchange方法监听hash变化（#后面就是hash值）
  history模式则是HTML5提供的history全局对象里面的pushState和replaceState实现改变URL而不刷新页面
✨实现方式：hash模式（带#，比较丑那个），history模式
✨hash模式：利用浏览器hashchange方式监听hash值变化
window.addEventListener('hashchange', this.refresh, false)
getUrlPath(url) {
    // 获取hash
    return url.indexOf('#') >= 0 ? url.slice(url.indexOf('#') + 1) : '/'
}
refresh(event) {
    // URL hash发生变化的时候，拿到当前hash
    let newHash = ''
    let oldHash = null
    if (evnet.newURL) {
         oldHash = this.getUrlPath(event.oldURL || '')
         newHash = this.getUrlPath(event.newURL || '')           
    } else {
        newHash = this.getUrlPath(window.location.hash)
    }
    // 相关切换模块操作
}

✨总结：
  hash模式所有的工作都在前端进行，不需要后端服务配合
  hash模式的实现方式通过监听url的hash部分（#后面）变化，从而做出对应的渲染逻辑
  hash模式下，URL中会带有#，不美观

✨history模式：利用HTML5提供的history全局对象里面的相关方法：pushState和replaceState
✨监听原理：利用popState（HTML5新增的用来控制浏览器历史记录的API）监听改变Url的动作，但是pushState和replaceState是没办法触发popState，所以需要通过apply改写达到触发效果

let _wr = function(type) {
   let orig = history[type]
   return function() {
      let rv = orig.apply(this, arguments)
      let e = new Event(type)
      e.arguments = arguments
// EventTarget 的 dispatchEvent() 方法会向一个指定的事件目标派发一个 Event，
// 并以合适的顺序（同步地）调用所有受影响的 EventListener
      window.dispatchEvent(e)
      return rv
   }
}

 history.pushState = _wr('pushState')
 history.replaceState = _wr('replaceState')

✨重点：
  hash模式是不需要后端服务的，history模式需要，没刷新时候，通过pushState改变URL，刷新后，就会报404
  ✨简单理解就是浏览器会把整个地址当做一个静态资源路径访问，刷新后发现服务器没有对应路径，就会报404

  没刷新时，只是通过pushState改变URL，不刷新页面
    http://192.168.30.161:5500/ === http://192.168.30.161:5500/index.html // 默认访问路径下的index.html文件，没毛病
    http://192.168.30.161:5500/home === http://192.168.30.161:5500/index.html // 仍然访问路径下的index.html文件，没毛病...
    http://192.168.30.161:5500/mine === http://192.168.30.161:5500/index.html // 所有的路由都是访问路径下的index.html，没毛病

  一旦在某个路由下刷新页面的时候，想当于去该路径下寻找可访问的静态资源index.html，无果，报错
      http://192.168.30.161:5500/mine === http://192.168.30.161:5500/mine/index.html文件，出问题了，服务器上并没有这个资源，404
所以一般情况下，我们都需要配置下nginx，代理请求路径，告诉服务器，当我们访问的路径资源不存在的时候，默认指向静态资源index.html

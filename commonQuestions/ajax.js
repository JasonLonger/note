// 使用Promise封装Ajax
function ajax(method, url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadyStateChange = function() {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(xhr.statusText)
      }
    }
    xhr.open(method, url, true) // 第三个参数默认为true,是否异步
    xhr.send(data)
  }) 
}

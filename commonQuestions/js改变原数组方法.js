在前端 JavaScript 中，有许多方法可以用于操作数组，其中一些方法会改变原始数组，而另一些方法则不会改变原始数组。下面是一些常用的方法：
改变数组的方法(也是Vue响应式能够被监听的数组变化方法)：
  push()：将一个或多个元素添加到数组的末尾。
  pop()：删除数组的最后一个元素。
  shift()：删除数组的第一个元素。
  unshift()：将一个或多个元素添加到数组的开头。
  splice()：从数组中添加或删除元素。
  sort()：对数组进行排序。
  reverse()：反转
不改变数组的方法：
  slice()：返回数组的一部分。
  concat()：将两个或多个数组合并为一个新数组。
  join()：将数组中的所有元素连接成一个字符串。
  indexOf()：返回数组中某个元素的第一个匹配项的索引。
  lastIndexOf()：返回数组中某个元素的最后一个匹配项的索引。
  forEach()：对数组中的每个元素执行一个函数。
  map()：对数组中的每个元素执行一个函数，并返回一个新的数组。
  filter()：根据条件筛选数组中的元素，并返回一个新的数组。
  reduce()：将数组中的所有元素归约为一个值，并返回该值。
  find()：返回满足给定条件的第一个元素的值。
  findIndex()：返回满足给定条件的第一个元素的索引。
需要注意的是，虽然这些方法中的大多数不会改变原始数组，但它们可能会返回一个新的数组或字符串，而不是修改原始数组本身。

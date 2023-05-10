✨冒泡排序算法
🔥实现思路：
比较相邻的两个元素，如果前一个元素大于后一个元素，则交换这两个元素的位置，直到整个序列都有序为止。
每一轮会将当前未排序数列中最大的数移动到数列末尾。

👏实现1
function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        const temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
      }
    }
  }
  return arr
}

🔥时间复杂度：O(n^2)
👏注意不适合大规模数据排序

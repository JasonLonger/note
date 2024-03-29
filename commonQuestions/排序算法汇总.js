✅冒泡排序算法
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


✅插入排序（Insertion Sort）是一种简单直观的排序算法，它的基本思想是将待排序的数据分成已排序和未排序两部分;
每次将未排序的部分中的最小（或最大）元素插入到已排序部分的适当位置，直到未排序部分为空，排序完成。

实际中我们玩扑克牌时，就用了插入排序的思想


✨代码
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i] // 抽牌
    let j = i - 1
    
    while(j >= 0 && arr[j] > current) { // 找牌，没找到大于抽牌的时间，就往后挪，直到发现前面牌大于抽牌，或者没牌了
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = current // 将抽牌插入
  }
  return arr
}

在这个实现中，我们首先遍历整个数组，将每个元素存储在 current 变量中。然后，我们从 i-1 开始向前遍历数组，并将当前元素存储在 j 变量中。
在内部循环中，我们将 arr[j] 与 current 进行比较，如果 arr[j] 大于 current，则将 arr[j] 向右移动一个位置，并将 j 的值减 1。这样，我们就可以将 current 插入到正确的位置。
最后，我们将 current 插入到 arr[j+1] 的位置，即将已排序部分的末尾插入到未排序部分的开头。

✨时间复杂度：O(n^2) 空间复杂度:O(1)

✨总结：用打扑克方式理解就好

✅选择排序（Selection Sort）是一种简单直观的排序算法，它的基本思想是每次从未排序的部分中找到最小（或最大）的元素，将其放到已排序部分的末尾。

✨以下是使用 JavaScript 实现选择排序方法：
function selectionSort(arr) {  
  for (let i = 0; i < arr.length - 1; i++) {  
    let minIndex = i;  
    for (let j = i + 1; j < arr.length; j++) {  
      if (arr[j] < arr[minIndex]) {  
        minIndex = j;  
      }  
    }  
    if (minIndex !== i) {  
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];  
    }  
  }  
  return arr;  
}
在这个实现中，我们使用两个嵌套的循环来遍历未排序的部分。外层循环从第一个元素开始，到倒数第二个元素结束，因为最后一个元素已经排好序了。
内层循环从当前元素的下一个元素开始，到未排序部分的末尾结束，因为每次找到的最小元素都应该放在已排序部分的末尾。

✨时间复杂度： O(n^2)

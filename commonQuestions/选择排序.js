✨选择排序（Selection Sort）是一种简单直观的排序算法，它的基本思想是每次从未排序的部分中找到最小（或最大）的元素，将其放到已排序部分的末尾。

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

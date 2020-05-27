```
improve skill

```

## sort


### bubble sort

explain:

the neighbouring number are used to compare ,if the left number is smaller than right number .so change the right number's postion into the left number's left postion;

the effction is that the biggest or smallest always move into the head or tail postion;


``` java

public void bubbleSort(){
  Array array =new Array();
  int length= array.length
  for (int i = 0; i < size; i++) {
         for (int j = 1; j < size - i; j++) {
             if (array[j] > array[j - 1]) {
                 int tmp = array[j];
                 array[j] = array[j - 1];
                 array[j - 1] = tmp;
             }
         }
     }
}

```

### insert sort


explain:

just think the left part is sorted ,then compare the right number with the sorted . and move the number to the place
which is belong to it .

``` java
public void insertSort() {
        for (int i = 0; i < size - 1; i++) {
            int temp = array[i+1]; // 22
            for (int j = i; j >=0; j--) {
                if (temp < array[j]) { //
                    array[j + 1]=array[j];
                    array[j] = temp; //
                }
            }
        }
        System.out.println(JSONObject.toJSONString(array));
    }

```

###  section sort

explain :

always find the max or min number in the last parts and put the numebr to the tail of sorted number group ;

``` java
public void sectionSort() {

    //always find the max or min number in the last parts
    for (int i = 0; i < size; i++) {
        int minindex = i;
        for (int j = i; j <size; j++) {
            if (array[j] > array[minindex]) {
                minindex = j;
            }
        }
        int temp = array[minindex];
        array[minindex] = array[i];
        array[i] = temp;
    }
    System.out.println(JSONObject.toJSONString(array));
}

```


### shell sort


我们来看下希尔排序的基本步骤，在此我们选择增量gap=length/2，缩小增量继续以gap = gap/2的方式，这种增量选择我们可以用一个序列来表示，{n/2,(n/2)/2...1}，称为增量序列。希尔排序的增量序列的选择与证明是个数学难题，我们选择的这个增量序列是比较常用的，也是希尔建议的增量，称为希尔增量，但其实这个增量序列不是最优的。此处我们做示例使用希尔增量。

先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，具体算法描述：

选择一个增量序列t1，t2，…，tk，其中ti>tj，tk=1；
按增量序列个数k，对序列进行k 趟排序；
每趟排序，根据对应的增量ti，将待排序列分割成若干长度为m 的子序列，分别对各子表进行直接插入排序。仅增量因子为1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

int len = array.length;
      int temp, gap = len / 2;
      while (gap > 0) {
          for (int i = gap; i < len; i++) {
              temp = array[i];
              int preIndex = i - gap;
              while (preIndex >= 0 && array[preIndex] > temp) {
                  array[preIndex + gap] = array[preIndex];
                  preIndex -= gap;
              }
              array[preIndex + gap] = temp;
          }
          gap /= 2;
      }
      return array;

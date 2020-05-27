4, 52, 2, 2, 22, 21


if (array.length == 0)
           return array;
       int current;
       for (int i = 0; i < array.length - 1; i++) {
           current = array[i + 1];    52   2
           int preIndex = i;  0 1
           while (preIndex >= 0 && current < array[preIndex]) {
                current=2  pre=52

               array[preIndex + 1] = array[preIndex];

                4 2 52

                2 4 52

                2 4 2 52

                2 2 4 52 

               preIndex--;
           }
           array[preIndex + 1] = current;  4 52



       }
       return array;

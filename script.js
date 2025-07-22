
    let array = [];
    let delay = 51;

    function generateArray() {
      const size = document.getElementById("arraySize").value;
      array = [];
      const container = document.getElementById("array-container");
      container.innerHTML = "";
      for (let i = 0; i < size; i++) {
        const val = Math.floor(Math.random() * 300) + 10;
        array.push(val);
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${val}px`;
        container.appendChild(bar);
      }
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function swap(i, j) {
      const bars = document.getElementsByClassName("bar");
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[j].style.height = `${array[j]}px`;
    }

    async function runSort() {
      const algo = document.getElementById("algorithm").value;
      if (algo === "quickSort") await quickSort(0, array.length - 1);
      else if (algo === "mergeSort") await mergeSort(0, array.length - 1);
      else await window[algo]();
    }

    async function bubbleSort() {
      const bars = document.getElementsByClassName("bar");
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          bars[j].style.backgroundColor = "red";
          bars[j + 1].style.backgroundColor = "red";
          await sleep(delay);
          if (array[j] > array[j + 1]) await swap(j, j + 1);
          bars[j].style.backgroundColor = "teal";
          bars[j + 1].style.backgroundColor = "teal";
        }
      }
    }

    async function insertionSort() {
      const bars = document.getElementsByClassName("bar");
      for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          bars[j + 1].style.height = `${array[j + 1]}px`;
          j--;
          await sleep(delay);
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
      }
    }

    async function selectionSort() {
      const bars = document.getElementsByClassName("bar");
      for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
          bars[j].style.backgroundColor = "red";
          await sleep(delay);
          if (array[j] < array[minIdx]) minIdx = j;
          bars[j].style.backgroundColor = "teal";
        }
        await swap(i, minIdx);
      }
    }

    async function quickSort(low, high) {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
      }
    }

    async function partition(low, high) {
      const pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
          i++;
          await swap(i, j);
          await sleep(delay);
        }
      }
      await swap(i + 1, high);
      return i + 1;
    }

    async function mergeSort(left, right) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
      }
    }

    async function merge(l, m, r) {
      const left = array.slice(l, m + 1);
      const right = array.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      const bars = document.getElementsByClassName("bar");
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          array[k] = left[i];
          bars[k].style.height = `${left[i]}px`;
          i++;
        } else {
          array[k] = right[j];
          bars[k].style.height = `${right[j]}px`;
          j++;
        }
        k++;
        await sleep(delay);
      }
      while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        i++; k++;
        await sleep(delay);
      }
      while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        j++; k++;
        await sleep(delay);
      }
    }

    async function heapSort() {
      const n = array.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
      for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        await heapify(i, 0);
      }
    }

    async function heapify(n, i) {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && array[l] > array[largest]) largest = l;
      if (r < n && array[r] > array[largest]) largest = r;
      if (largest !== i) {
        await swap(i, largest);
        await heapify(n, largest);
      }
    }

    async function countingSort() {
      const max = Math.max(...array);
      const count = new Array(max + 1).fill(0);
      const output = new Array(array.length);

      for (let i = 0; i < array.length; i++) count[array[i]]++;
      for (let i = 1; i <= max; i++) count[i] += count[i - 1];
      for (let i = array.length - 1; i >= 0; i--) {
        output[--count[array[i]]] = array[i];
      }
      const bars = document.getElementsByClassName("bar");
      for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        bars[i].style.height = `${array[i]}px`;
        await sleep(delay);
      }
    }

    async function radixSort() {
      const getMax = Math.max(...array);
      for (let exp = 1; Math.floor(getMax / exp) > 0; exp *= 10) {
        await countingSortExp(exp);
      }
    }

    async function countingSortExp(exp) {
      const output = new Array(array.length).fill(0);
      const count = new Array(10).fill(0);
      for (let i = 0; i < array.length; i++) count[Math.floor(array[i] / exp) % 10]++;
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = array.length - 1; i >= 0; i--) {
        const index = Math.floor(array[i] / exp) % 10;
        output[--count[index]] = array[i];
      }
      const bars = document.getElementsByClassName("bar");
      for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        bars[i].style.height = `${array[i]}px`;
        await sleep(delay);
      }
    }

    async function bucketSort() {
      let bucketCount = Math.floor(Math.sqrt(array.length));
      let max = Math.max(...array);
      let min = Math.min(...array);
      let buckets = Array.from({ length: bucketCount }, () => []);

      for (let i = 0; i < array.length; i++) {
        let idx = Math.floor(((array[i] - min) / (max - min + 1)) * bucketCount);
        buckets[idx].push(array[i]);
      }

      let k = 0;
      const bars = document.getElementsByClassName("bar");
      for (let i = 0; i < buckets.length; i++) {
        buckets[i].sort((a, b) => a - b);
        for (let j = 0; j < buckets[i].length; j++) {
          array[k] = buckets[i][j];
          bars[k].style.height = `${array[k]}px`;
          await sleep(delay);
          k++;
        }
      }
    }

    window.onload = generateArray;

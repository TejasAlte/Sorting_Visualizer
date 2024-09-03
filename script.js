const arrayContainer = document.getElementById('array-container');
const generateButton = document.getElementById('generate');
const startButton = document.getElementById('start');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeSlider = document.getElementById('arraySize');

let array = [];
let animations = [];
let isSorting = false;

// Generate a new array
function generateArray(size = 50) {
    array = [];
    arrayContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 500) + 10;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${Math.floor(800 / size)}px`;
        arrayContainer.appendChild(bar);
    }
}

// Update the array container based on the current array
function updateArray() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = `${array[i]}px`;
    }
}

// Utility function to swap two elements in the array
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// Sleep function for animation delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sorting Algorithms
async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight the bars being compared
            highlightBars([j, j + 1], 'active');
            await sleep(50);
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                updateArray();
                await sleep(50);
            }
            unhighlightBars([j, j + 1], 'active');
        }
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        highlightBars([i], 'pivot');
        for (let j = i + 1; j < n; j++) {
            highlightBars([j], 'active');
            await sleep(50);
            if (array[j] < array[minIdx]) {
                unhighlightBars([minIdx], 'pivot');
                minIdx = j;
                highlightBars([minIdx], 'pivot');
            }
            unhighlightBars([j], 'active');
        }
        if (minIdx !== i) {
            swap(array, i, minIdx);
            updateArray();
            await sleep(50);
        }
        unhighlightBars([i, minIdx], 'pivot');
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        highlightBars([i], 'active');
        await sleep(50);
        while (j >= 0 && array[j] > key) {
            highlightBars([j], 'active');
            array[j + 1] = array[j];
            updateArray();
            await sleep(50);
            unhighlightBars([j], 'active');
            j = j - 1;
        }
        array[j + 1] = key;
        updateArray();
        await sleep(50);
        unhighlightBars([i], 'active');
    }
}

async function quickSortHelper(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    highlightBars([high], 'pivot');
    let i = low - 1;
    for (let j = low; j < high; j++) {
        highlightBars([j], 'active');
        await sleep(50);
        if (array[j] < pivot) {
            i++;
            swap(array, i, j);
            updateArray();
            await sleep(50);
        }
        unhighlightBars([j], 'active');
    }
    swap(array, i + 1, high);
    updateArray();
    unhighlightBars([high], 'pivot');
    await sleep(50);
    return i + 1;
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
}

// Highlight bars with a specific class
function highlightBars(indices, className) {
    const bars = document.getElementsByClassName('array-bar');
    indices.forEach(index => {
        bars[index].classList.add(className);
    });
}

// Unhighlight bars by removing a specific class
function unhighlightBars(indices, className) {
    const bars = document.getElementsByClassName('array-bar');
    indices.forEach(index => {
        bars[index].classList.remove(className);
    });
}

// Start sorting based on selected algorithm
async function startSort() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);
    const algorithm = algorithmSelect.value;
    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'quick':
            await quickSort();
            break;
        default:
            break;
    }
    isSorting = false;
    disableControls(false);
}

// Disable or enable controls during sorting
function disableControls(flag) {
    generateButton.disabled = flag;
    startButton.disabled = flag;
    algorithmSelect.disabled = flag;
    arraySizeSlider.disabled = flag;
}

// Event Listeners
generateButton.addEventListener('click', () => {
    if (isSorting) return;
    const size = parseInt(arraySizeSlider.value);
    generateArray(size);
});

startButton.addEventListener('click', startSort);

// Initialize the array on page load
window.onload = () => {
    generateArray(parseInt(arraySizeSlider.value));
};

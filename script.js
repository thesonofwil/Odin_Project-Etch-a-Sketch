const container = document.querySelector("#container");
const gridLinesBtn = document.querySelector("#gridLinesBtn");
const rgbBtn = document.querySelector("#rgbBtn");
const eraseBtn = document.querySelector("#eraseBtn");
const clearBtn = document.querySelector("#clearBtn");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");

const defaultSize = 16;
const toggledOnColor = "#c9e5f2";
const blankColor = "#FFFFFF";
let mouseDown = 0;
let gridLinesOn = 0;
let rgbMode = 0;
let eraseMode = 0;
let currColor = colorPicker.value;

makeGrid(defaultSize, defaultSize);

/**
 * Add functionality to button to toggle grid lines on/off
 */
gridLinesBtn.addEventListener("click", () => {
  gridLinesOn = gridLinesOn ? 0 : 1; // Sets gridLinesOn on/off on each click
  gridLinesBtn.style.backgroundColor = gridLinesOn ? `${toggledOnColor}` : null; // Color button to show it is toggled
  toggleGridLines();
});

/**
 * Toggle 'Prettify' button on/off to fill cells with random colors
 */
rgbBtn.addEventListener("click", () => {
  rgbMode = rgbMode ? 0 : 1; // Sets rgbMode on/off on each click
  rgbBtn.style.backgroundColor = rgbMode ? `${toggledOnColor}` : null; // Color button to show it is toggled

  if (rgbMode) {
    eraseBtn.style.backgroundColor = null;
    eraseMode = 0;
  }
});

/**
 * Toggle 'Eraser' button on/off to eraes cells that have been colored in
 */
eraseBtn.addEventListener("click", () => {
  eraseMode = eraseMode ? 0 : 1; // Sets rgbMode on/off on each click
  eraseBtn.style.backgroundColor = eraseMode ? `${toggledOnColor}` : null; // Color button to show it is toggled

  // Turn off any coloring modes
  if (eraseMode) {
    rgbBtn.style.backgroundColor = null;
    rgbMode = 0;
  }
});

/**
 * Reset entire grid to default color of white
 */
clearBtn.addEventListener("click", () => {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((cell) => {
    cell.style.backgroundColor = `${blankColor}`;
  });

  // Turn off eraser
  eraseBtn.style.backgroundColor = null;
  eraseMode = 0;
});

/**
 * Retrieve and store color value according to user's input
 */
colorPicker.addEventListener("input", () => {
  currColor = colorPicker.value;

  // Turn off Prettify if selecting a new color
  if (rgbMode) {
    rgbBtn.style.backgroundColor = null;
    rgbMode = 0;
  }
});

/**
 * Dynamically adjust grid size as slider is changed by user
 */
sizeSlider.oninput = function () {
  const sizeElement = document.getElementById("gridSize");
  const size = sizeSlider.value;
  sizeElement.textContent = `${size} × ${size}`;
  container.innerHTML = ""; // clears grid
  makeGrid(size, size);
  toggleGridLines();
};

/**
 * Creates a grid with a size that the user defines. Each cell of the grid becomes an item that is
 * appended to the grid container
 *
 * @param {int} rows number of rows to create
 * @param {int} cols number of columns to create
 */
function makeGrid(rows, cols) {
  // Check dimensions are acceptable inputs. Default if not.
  if (Number.isInteger(Number(rows)) && typeof Number.isInteger(Number(cols))) {
    if (rows <= 0 || rows > 100) {
      rows = defaultSize;
    }

    if (cols <= 0 || cols > 100) {
      cols = defaultSize;
    }
  } else {
    rows = defaultSize;
    cols = defaultSize;
  }

  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);

  for (let i = 0; i < rows * cols; i++) {
    let cell = document.createElement("div");
    // cell.innerText = i + 1;
    container.appendChild(cell).className = "grid-item";
  }

  // Add event listeners to color cells if holding mosue down
  container.addEventListener("mousedown", function () {
    mouseDown = 1;
  });
  container.addEventListener("mouseup", function () {
    mouseDown = 0;
  });

  addColor();
}
/**
 * Changes color of each cell in grid when hovering over it
 */
function addColor() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((cell) => {
    // click to color individual cells
    cell.addEventListener("mousedown", () => {
      if (rgbMode) {
        const randColor = getRandomColor();
        cell.style.backgroundColor = `${randColor}`;
      } else if (eraseMode) {
        cell.style.backgroundColor = `${blankColor}`;
      } else {
        cell.style.backgroundColor = `${currColor}`;
      }
    });

    // hold click and drag mouse to color cells
    cell.addEventListener("mouseover", () => {
      if (mouseDown) {
        if (rgbMode) {
          const randColor = getRandomColor();
          cell.style.backgroundColor = `${randColor}`;
        } else if (eraseMode) {
          cell.style.backgroundColor = `${blankColor}`;
        } else {
          cell.style.backgroundColor = `${currColor}`;
        }
      }
    });
  });
}

/**
 * Generates a random color in hex
 *
 * @returns hex value of color
 */
function getRandomColor() {
  const hex = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + hex.slice(0, 6);
}

/**
 * Toggles grid lines on/off
 */
function toggleGridLines() {
  const gridItems = document.querySelectorAll(".grid-item");

  if (gridLinesOn) {
    gridItems.forEach((cell) => {
      cell.style.border = "thin solid #303030";
    });
  } else {
    gridItems.forEach((cell) => {
      cell.style.border = null;
    });
  }
}

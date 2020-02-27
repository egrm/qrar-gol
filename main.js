// img
  const golCanvas = document.querySelector("#gol-canvas");
  golCanvas.hidden = true;

// const extractImageDataFromImg = imgEl => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");

//   canvas.width = imgEl.width;
//   canvas.height = imgEl.height;
//   context.drawImage(imgEl, 0, 0);
//   return context.getImageData(0, 0, imgEl.width, imgEl.height);
// };

// const img = window.document.getElementById("qr-img");
// const img = document.getElementById("big-qr-img");

// const imageData = extractImageDataFromImg(img);

// const code = jsQR(imageData.data, imageData.width, imageData.height, {
//   inversionAttempts: "dontInvert"
// });

let golInterval;

function mountGoL(code) {
  const matrix = code.matrix;

  matrix.coordsToIndex = function(x, y) {
    if (x < 0 || y < 0) return -1;

    const index = y * this.width + x;
    return index;
  };

  matrix.getByCoords = function(x, y) {
    const index = this.coordsToIndex(x, y);
    const value = this.data[index];

    return value;
  };

  matrix.updateCell = function(x, y, value) {
    this.data[this.coordsToIndex(x, y)] = value;
  };

  matrix.nextGen = function() {
    const newData = [...this.data];

    const updateCell = (col, row, value) => {
      newData[this.coordsToIndex(col, row)] = value;
    };

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const livingNeighbors = [
          this.getByCoords(col + 1, row),
          this.getByCoords(col - 1, row),
          this.getByCoords(col, row + 1),
          this.getByCoords(col, row - 1),
          this.getByCoords(col - 1, row - 1),
          this.getByCoords(col + 1, row + 1),
          this.getByCoords(col + 1, row - 1),
          this.getByCoords(col - 1, row + 1)
        ].filter(Boolean);

        const livingNeighborsCount = livingNeighbors.length;

        const cell = this.getByCoords(col, row);

        if (livingNeighborsCount < 2 || livingNeighborsCount > 3) {
          updateCell(col, row, 0);
        } else if (livingNeighborsCount === 3) {
          updateCell(col, row, 1);
        }
      }
    }

    this.data = newData;
  };

  const ctx = golCanvas.getContext("2d");

  function renderMatrix(matrix) {
    ctx.clearRect(0, 0, golCanvas.width, golCanvas.height);

    const cellHeight = golCanvas.height / matrix.height;
    const cellWidth = golCanvas.width / matrix.width;

    for (let row = 0; row < matrix.height; row++) {
      for (let col = 0; col < matrix.width; col++) {
        if (!matrix.getByCoords(col, row)) continue;

        ctx.beginPath();

        ctx.fillStyle = "black";
        ctx.rect(cellWidth * col, cellHeight * row, cellWidth, cellHeight);
        ctx.fill();

        ctx.closePath();
      }
    }
  }

  renderMatrix(matrix);
  golCanvas.hidden = false;

  golInterval = setInterval(() => {
    renderMatrix(matrix);
    matrix.nextGen();
  }, 150);
}

function dismountGoL() {
  clearInterval(golInterval)
  golCanvas.hidden = true;
}

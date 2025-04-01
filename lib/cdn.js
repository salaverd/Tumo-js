// Define canvas and context globally
let canvas, ctx;
let currentAngle = 90;
let currentX, currentY;
let col;
let canvasBackupImage;
let currentWidth;

function checkCanvas() {
  if (!canvas || !ctx) {
    console.warn("Canvas or 2D context not initialized.");

    return;
  }
}

function backupCanvasAddTumoid(x = currentX, y = currentY) {
  canvasBackupImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const clrs = ["#df1111", "#46d4b3", "#1438df", "#45a403", "#e8f601"];

  var w = 10;
  var h = 15;
  ctx.lineWidth = 1;
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(-(currentAngle + 90) * (Math.PI / 180));
  ctx.translate(-x, -y);
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = random(clrs);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.lineWidth = currentWidth;
}

function restoreCanvas() {
  ctx.putImageData(canvasBackupImage, 0, 0);
}

/**
 * Creates a working canvas. (Ստեղծում է կանվաս)
 * @param {number} width - Width of the canvas. (Կանվասի երկարությունը)
 * @param {number} height - Height of the canvas. (Կանվաս բարձրությունը)
 */
function createCanvas(width, height) {
  if (typeof width !== "number" || typeof height !== "number") {
    console.warn(
      "Invalid dimensions. Width and height must be numerical values."
    );

    return;
  }

  if (width <= 0 || height <= 0) {
    console.warn(
      "Invalid dimensions. Width and height must be positive numerical values."
    );

    return;
  }

  // Create a canvas element
  canvas = document.createElement("canvas");
  let co = document.createElement("div");

  // Set canvas size to the specified width and height
  canvas.width = width;
  canvas.height = height;
  currentX = canvas.width / 2;
  currentY = canvas.height / 2;

  let text = document.createTextNode("X:" + currentX + " Y:" + currentY);
  co.appendChild(text);
  document.body.appendChild(co);
  document.body.appendChild(canvas);

  // Get the 2D drawing context
  ctx = canvas.getContext("2d", { willReadFrequently: true });

  // Style the canvas using JavaScript
  canvas.style.border = "1px solid #000";
  canvas.style.position = "absolute";
  canvas.style.top = "150";
  canvas.style.left = "150";

  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

  canvas.addEventListener("mousemove", function (event) {
    coords = canvas.relMouseCoords(event);
    canvasX = coords.x;
    canvasY = coords.y;
    co.innerHTML = "X:" + canvasX + " Y:" + canvasY;
  });

  backupCanvasAddTumoid();
}

/**
 * Draws a straight line. (Գծում է ուղիղ գիծ)
 * @param {number} length - Length of a line. (Գծի երկարությունը)
 */
function drawLine(length) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(length, "length"))
    return;

  const radianAngle = (currentAngle * Math.PI) / 180;
  const newX = currentX + length * Math.cos(radianAngle);
  const newY = currentY - length * Math.sin(radianAngle); // Note the negative sign for the Y-axis

  let outOfBounds = false;
  if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
    outOfBounds = true;
  }

  if (outOfBounds) {
    console.warn("Warning: The line passed the margin of the canvas.");
  }

  const boundedX = Math.max(0, Math.min(newX, canvas.width));
  const boundedY = Math.max(0, Math.min(newY, canvas.height));

  restoreCanvas();

  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
  ctx.lineTo(newX, newY);
  ctx.closePath();
  ctx.stroke();

  currentX = boundedX;
  currentY = boundedY;

  ctx.restore();
  backupCanvasAddTumoid();
}

/**
 * Changes direction to left. (Փոխում է ուղղությունը դեպի ձախ)
 * @param {number} angle - Angle to turn. (Թեքվելու անկյան չափը)
 */
function left(angle) {
  if (checkCanvas()) {
    return;
  }

  if (typeof angle !== "number" || angle >= 360) {
    console.warn(
      "Invalid angle. Angle must be a numerical value and below 360."
    );

    return;
  }

  restoreCanvas();

  currentAngle = (currentAngle + angle + 360) % 360;

  backupCanvasAddTumoid();
}

/**
 * Changes direction to right. (Փոխում է ուղղությունը դեպի աջ)
 * @param {number} angle - Angle to turn. (Թեքվելու անկյան չափը)
 */
function right(angle) {
  if (checkCanvas()) {
    return;
  }

  if (typeof angle !== "number" || angle >= 360) {
    console.warn(
      "Invalid angle. Angle must be a numerical value and below 360."
    );

    return;
  }

  restoreCanvas();

  currentAngle = (currentAngle - angle) % 360;

  backupCanvasAddTumoid();
}

/**
 * Draws a rectangle. (Գծում է ուղղանկյուն)
 * @param {number} width - Width of the rectangle. (Ուղղանկյան երկարությունը)
 * @param {number} height - Height of the rectangle. (Ուղղանկյան բարձրությունը)
 */

function drawRectangle(width, height) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(width, "width"))
    return;

  if (height !== undefined) {
    if (!validate(height, "height"))
      return;
  } else {
    height = width;
  }
  restoreCanvas();

  ctx.save(); // Save the current canvas state

  ctx.translate(currentX, currentY); // Translate to the current position
  ctx.rotate(-currentAngle * Math.PI / 180); // Rotate the canvas by currentAngle

  ctx.beginPath();
  ctx.rect(0, 0, width, height); // Draw the rectangle from the new origin
  ctx.closePath();
  ctx.stroke();
  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
    ctx.fillStyle = "#000000"
  }

  ctx.restore(); // Restore the canvas state to undo the translation and rotation

  backupCanvasAddTumoid();

}
/**
 * Changes the position of the pen. (Փոխում է գրիչի դիրքը)
 * @param {number} newX - New X-coordinate. (Նոր X կոորդինատ)
 * @param {number} newY - New Y-coordinate. (Նոր Y կոորդինատ)
 */
function goTo(newX, newY) {
  if (checkCanvas()) {
    return;
  }

  if (typeof newX !== "number" || typeof newY !== "number") {
    console.error("Invalid coordinates. Coordinate must be a numerical value.");

    return;
  }

  if (canvas.width < newX || canvas.height < newY || newX < 0 || newY < 0) {
    console.error("Coordinates are out of canvas.");

    return;
  }

  restoreCanvas();

  currentX = newX;
  currentY = newY;
  ctx.moveTo(newX, newY);

  backupCanvasAddTumoid();
}

/**
 * Draws an ellipse. (Գծում է էլիպս)
 * @param {number} width - Width of the ellipse. (Էլիպսի երկարությունը)
 * @param {number} height - Height of the ellipse. (Էլիպսի բարձրությունը)
 */

function drawEllipse(width, height) {
  if (checkCanvas()) {
    return;
  }
  // If only one parameter is provided, assume it's the radius for both axes (i.e., draw a circle)
  if (arguments.length === 1) {
    height = width;
  }
  // Validate the parameters to ensure they are non-negative numerical values
  if (!validate(width, "width"))
    return;
  if (!validate(height, "height"))
    return;

  restoreCanvas();
  if (ctx) {
    ctx.beginPath();
    ctx.ellipse(currentX, currentY, width, height, (360 - currentAngle - 90) * (Math.PI / 180), 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  } else {
    console.error("Could not retrieve 2D context from canvas.");
  }
  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
    ctx.fillStyle = "#000000"
  }


  backupCanvasAddTumoid();
}
/**
 * Clears the canvas. (Մաքրում է կանվասը)
 */
function erase() {
  if (checkCanvas()) {
    return;
  }

  restoreCanvas();

  // Clear the entire canvas by specifying the rectangle that covers the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentAngle = 90;
  currentX = canvas.width / 2;
  currentY = canvas.height / 2;
  currentWidth = 1
  backupCanvasAddTumoid();
}

/**
 * Calculates a random number. (Հաշվում է պատահական թիվ)
 * @param {number} min - Minimum value for the random number. (Պատահական թվի նվազագույն արժեքը)
 * @param {number} max - Maximum value for the random number. (Պատահական թվի առավելագույն արժեքը)
 * @returns {number} - Random number between min and max. (Պատահական թիվ նվազագույն և առավելագույն արժեքների միջև)
 */
function random(min, max) {
  function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }

  if (Array.isArray(min)) {
    return min[Math.floor(Math.random() * min.length)];
  }

  if (min !== undefined && !isNumber(min)) {
    console.warn("First argument must be a number or an array");

    return;
  }

  if (max !== undefined && !isNumber(max)) {
    console.warn("Second argument must be a number");

    return;
  }

  if (max === undefined) {
    if (min === undefined) {
      return Math.random();
    }

    max = 0;
  }

  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Draws a polygon. (Գծում է բազմանկյուն)
 * @param {number} sideCount - Number of sides in the polygon. (Բազմանկյան կողմերի քանակը)
 * @param {number} length - Length of each side. (Բազմանկյան կողմի երկարությունը)
 */
function drawPolygon(sideCount, length) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(sideCount, "sideCount"))
    return;

  if (!validate(length, "length"))
    return;


  if (sideCount < 3) {
    console.warn("Invalid arguments. Sides count should be 3 or more.");
    return;
  }

  restoreCanvas();
  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
  for (let i = 0; i < sideCount; i++) {
    const radianAngle = (currentAngle * Math.PI) / 180;
    const newX = currentX + length * Math.cos(radianAngle);
    const newY = currentY - length * Math.sin(radianAngle); // Note the negative sign for the Y-axis

    let outOfBounds = false;
    if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
      outOfBounds = true;
    }

    if (outOfBounds) {
      console.warn("Warning: The line passed the margin of the canvas.");
    }

    ctx.lineTo(newX, newY);
    currentX = newX;
    currentY = newY;
    currentAngle = (currentAngle - (360 / sideCount));
  }

  ctx.closePath();

  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
  }

  ctx.stroke();

  backupCanvasAddTumoid();
}


/**
 * Draws a triangle. (Գծում է եռանկյուն)
 * @param {number} length - Length of each side. (Եռանկյան կողմի երկարությունը)
 */
function drawTriangle(length) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(length, "length"))
    return;

  restoreCanvas();
  const heightTriangle = (Math.sqrt(3) / 2) * length;
  const x1 = currentX;
  const y1 = currentY;
  const x2 = x1;
  const y2 = y1 - length;
  const x3 = x1 + heightTriangle;
  const y3 = y1 - length / 2;
  ctx.save();
  ctx.translate(currentX, currentY);
  ctx.rotate((-(currentAngle - 90) * Math.PI) / 180);
  ctx.translate(-currentX, -currentY);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
  }
  backupCanvasAddTumoid();
}
/**
 * Draws a circle. (Գծում է շրջան)
 * @param {...*} clr - Color of the pen. (Որոշում է գրիչի գույնը)
 * Possible values:
 * - A string representing a color name or hex code (e.g., "red", "#ff0000")
 * - Տողի տեսքով գրված գույնը կամ տասնվեցական կոդը (օրինակ՝ "red", "#ff0000")
 * - An array of three numbers representing RGB values (e.g., [255, 0, 0])
 * - Զանգված որը պետք է ունենա երեք թիվ՝ RGB արժեքները նկարագրելու համար (օրինակ՝ [255, 0, 0])
 * - Three separate numbers representing RGB values (e.g., 255, 0, 0)
 * - Երեք առանձին թվեր, որոնք նկարագրում են RGB արժեքները (օրինակ՝ 255, 0, 0)
 */
function color(...clr) {
  if (checkCanvas()) {
    return;
  }
  if (!clr[0]) {
    console.warn("An argument must be passed to the function");
  }
  if (
    Array.isArray(...clr) ||
    (typeof clr[0] === "number" &&
      typeof clr[1] === "number" &&
      typeof clr[2] === "number")
  ) {
    ctx.strokeStyle = `rgb(${clr})`;
    ctx.fillStyle = `rgb(${clr})`;
  } else if (
    typeof clr[0] == "string" &&
    clr[0].startsWith("#") &&
    clr[0].length == 7
  ) {
    ctx.strokeStyle = clr[0];
    ctx.fillStyle = clr[0];
  } else if (typeof clr[0] == "string" && !clr[0].startsWith("#")) {
    ctx.strokeStyle = clr[0];
    ctx.fillStyle = clr[0];
  }
}
/**
 * Shows a grid layout on the canvas. (Ավելացնում է վանդակային դաշտ կանվասի վրա)
 * @param {number} cellSize - Size of cells in the grid. (Դաշտի վանդակի չափը)
 */
function showGrid(cellSize) {
  if (checkCanvas()) {
    return;
  }
  restoreCanvas();

  ctx.globalCompositeOperation = "destination-over";

  // Argument validation
  if (!validate(cellSize, "cellSize"))
    return;

  const width = canvas.width;
  const height = canvas.height;

  // Save the current canvas state
  ctx.save();

  // Set the stroke style for grid lines
  ctx.strokeStyle = "#ccc"; // Color of the grid lines
  ctx.lineWidth = 1; // Optional: Set line width for grid lines

  // Draw the grid lines
  ctx.beginPath();

  // Vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  backupCanvasAddTumoid();
}

function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while ((currentElement = currentElement.offsetParent));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return { x: canvasX, y: canvasY };
}

/**
 * Draws a star. (Գծում է աստղ)
 * @param {number} points - Number of points in the star. (Աստղի կողմերի քանակը)
 * @param {number} size - Size of the star. (Աստղի չափը)
 */
function drawStar(points, size) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(points, "points"))
    return;
  if (!validate(size, "size"))
    return;


  if (points < 4) {
    console.warn("Invalid arguments. Points should be more than 4.");

    return;
  }

  restoreCanvas();

  const outerRadius = size;
  const innerRadius = size / 2;
  const angleStep = Math.PI / points;

  const currentAngleInRadians = (currentAngle - 90) * (Math.PI / 180);

  const initialAngle = -Math.PI / 2 + currentAngleInRadians;
  const x = currentX - Math.cos(initialAngle) * outerRadius;

  const y = currentY - Math.sin(initialAngle) * outerRadius;

  let firstOuterPointX, firstOuterPointY;

  ctx.beginPath();

  for (let i = 0; i < 2 * points + 1; i++) {
    const angle = initialAngle + i * angleStep;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const xPos = x + Math.cos(angle) * r;
    const yPos = y + Math.sin(angle) * r;
    if (i === 0) {
      ctx.moveTo(xPos, yPos);
      firstOuterPointX = xPos;
      firstOuterPointY = yPos;
    } else {
      ctx.lineTo(xPos, yPos);
    }
  }

  ctx.closePath();
  ctx.stroke();

  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
    ctx.fillStyle = "#000000";
  }

  // Draw the triangle at the first outer point of the star
  backupCanvasAddTumoid(firstOuterPointX, firstOuterPointY);
}

/**
 * Changes pen width. (Փոխում է գրիչի լայնությունը)
 * @param {number} w - Width of the pen. (Գրիչի լայնությունը)
 */
function width(w) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(w, "width"))
    return;

  ctx.lineWidth = w;
  currentWidth = w;
}

/**
 * Rotates the pen. (Փոխում է գրիչի ուղղությունը)
 * @param {number} degree - Degree to positionate. (Ուղղության անկյունը)
 */
function rotate(degree) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(degree, "degree"))
    return;

  restoreCanvas();

  currentAngle = (90 - degree) % 360;

  backupCanvasAddTumoid();
}

/**
 * Chooses shapes fill color. (Որոշում է պատկերի ներկման գույնը)
 * @param {...*} clr - Color of the shape. (Պատկերի ներկման գույնը)
 * Possible values:
 * - A string representing a color name or hex code (e.g., "red", "#ff0000")
 * - Տողի տեսքով գրված գույնը կամ տասնվեցական կոդը (օրինակ՝ "red", "#ff0000")
 * - An array of three numbers representing RGB values (e.g., [255, 0, 0])
 * - Զանգված որը պետք է ունենա երեք թիվ՝ RGB արժեքները նկարագրելու համար (օրինակ՝ [255, 0, 0])
 * - Three separate numbers representing RGB values (e.g., 255, 0, 0)
 * - Երեք առանձին թվեր, որոնք նկարագրում են RGB արժեքները (օրինակ՝ 255, 0, 0)
 */
function fillColor(...clr) {
  if (checkCanvas()) {
    return;
  }

  let cl;
  let hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

  if (Array.isArray(...clr) && clr.length == 1) {
    cl = clr[0];
  } else if (!Array.isArray(...clr) && clr.length == 3) {
    cl = clr;
  }

  if (
    cl != undefined &&
    typeof cl[0] === "number" &&
    cl[0] <= 255 &&
    cl[0] >= 0 &&
    typeof cl[1] === "number" &&
    cl[1] <= 255 &&
    cl[1] >= 0 &&
    typeof cl[2] === "number" &&
    cl[2] <= 255 &&
    cl[2] >= 0
  ) {
    col = `rgb(${cl})`;
  } else if (typeof clr[0] == "string" && hexRegex.test(clr[0])) {
    col = clr[0];
  } else if (clr.length == 1 && typeof clr[0] == "string") {
    col = clr[0];
  } else {
    console.warn("Invalid color format.");

    return;
  }

  ctx.restore();
}

/**
 * Writes text on the canvas. (Գրում է տեքստ կանվասի վրա)
 * @param {string} str - Text to write. (Տեքստը)
 * @param {number} fontSize - Font size of the text. (Տեքստի չափը)
 * @param {string} fontFamily - Font family of the text. (Տեքստի տառատեսակը)
 */
function text(str, fontSize = 36, fontFamily = "Arial") {
  if (checkCanvas()) {
    return;
  }

  if (typeof str !== "string" || str.length === 0) {
    console.warn("Invalid text. Text must be non empty string.");

    return;
  }

  restoreCanvas();

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "bottom";
  ctx.fillText(str, currentX, currentY);
  currentX += ctx.measureText(str).width;

  backupCanvasAddTumoid();
}

/**
 * Moves the pen without drawing. (Տեղափոխում է գրիչը առանց գրելու)
 * @param {number} length - Length of the movement. (Տեղափոխման երկարությունը)
 */
function move(length) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(length, "length"))
    return;

  const radianAngle = (currentAngle * Math.PI) / 180;
  let newX = currentX + length * Math.cos(radianAngle);
  let newY = currentY - length * Math.sin(radianAngle);

  if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
    console.warn(
      "Out of canvas, increase the canvas size, or change the length."
    );

    return;
  }

  restoreCanvas();

  currentX = newX;
  currentY = newY;

  backupCanvasAddTumoid();
}

/**
 * Creates an animation. (Ստեղծում է անիմացիա)
 * @param {function} func - Function to animate. (Անիմացիան կատարելու ֆունկցիա)
 * @param {number} interval - Interval of the animation. (Անիմացիայի ինտերվալը)
 */
function animate(func, interval) {
  if (checkCanvas()) {
    return;
  }

  let id = setInterval(func, interval);

  return id; // Return the interval ID for possible later cancellation
}


function validate(value, name = "Parameter") {
  if (typeof value !== "number" || value < 0) {
    console.warn(`Invalid ${name}. It must be a non-negative number.`);
    return false;
  }
  return true;
}

//------------- Start of The Strange Functions ------------
/**
 * Draws a "strange" line. (Գծում է տարօրինակ գիծ)
 * @param {number} length - Line's length. (Գծի երկարությունը)
 */
function strangeLine(length) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(length, "length"))
    return;

  const radianAngle = (currentAngle * Math.PI) / 180;
  const newX = currentX + length * Math.cos(radianAngle);
  const newY = currentY - length * Math.sin(radianAngle);

  let outOfBounds = false;
  if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
    outOfBounds = true;
  }

  if (outOfBounds) {
    console.warn("Warning: The line passed the margin of the canvas.");
  }

  const boundedX = Math.max(0, Math.min(newX, canvas.width));
  const boundedY = Math.max(0, Math.min(newY, canvas.height));

  restoreCanvas();
  ctx.save();

  ctx.translate(currentX, currentY);
  ctx.rotate(-currentAngle * Math.PI / 180);

  let l = 0;
  while (l < length) {
    ctx.beginPath();
    let p = random(0, 2);
    let h = random(0, 5);
    ctx.lineWidth = h;
    ctx.moveTo(0, 0);
    ctx.lineTo(p, 0);
    ctx.stroke();
    ctx.translate(p, 0);
    ctx.closePath();
    l += p;
  }

  currentX = boundedX;
  currentY = boundedY;

  ctx.stroke();
  ctx.restore();

  if (col) {
    ctx.fillStyle = col;
    ctx.fill();
    col = undefined;
    ctx.fillStyle = "#000000"
  }
  backupCanvasAddTumoid();
}

/**
 * Draws a "strange" square by filling it with randomly rotated short lines.
 * (Գծում է "տարօրինակ" քառակուսի՝ լցնելով այն պատահականորեն շրջված կարճ գծերով)
 *
 * @param {number} side - The length of the square's sides. (Քառակուսիի կողմի երկարությունը)
 * @param {number} [step=5] - The step size for drawing lines inside the square. (Քայլի չափը՝ քառակուսիի ներսում գծեր գծելու համար)
 */
function strangeSquare(side, step = 5) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(side, "side"))
    return;

  restoreCanvas();

  ctx.save();

  let x1 = currentX;
  let y1 = currentY;
  let x;
  let y;
  for (x = x1; x < x1 + side; x += step) {
    for (y = y1; y > y1 - side; y -= step) {
      goTo(x, y);
      let a = random(0, 359);
      left(a)
      drawLine(5)
      ctx.stroke();
    }
  }
  currentX = x
  currentY = y
  rotate(0)
  ctx.restore();
}

/**
 * Draws a "strange" galaxy by creating randomly rotated short lines in a circular pattern.
 * (Գծում է "տարօրինակ" գալակտիկա՝ պատահական անկյուններով կարճ գծերով)
 *
 * @param {number} radius - The radius of the galaxy's area. (Գալակտիկայի շառավիղը)
 */
function strangeGalaxy(radius) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(radius, "radius"))
    return;

  restoreCanvas();
  let x1 = currentX;
  let y1 = currentY;
  ctx.save();
  for (let i = 0; i < 720; i++) {
    left(2);
    goTo(x1, y1);
    let a = random(0, radius);
    let r = random(0, 359);
    move(a)
    left(r)
    drawLine(5)
  }
  rotate(0)
  ctx.restore();

}

/**
 * Draws a "strange" circle by placing randomly rotated short lines along its circumference.
 * (Գծում է "տարօրինակ" շրջան՝ պատահական անկյուններով կարճ գծերով)
 *
 * @param {number} radius - The radius of the circle. (Շրջանի շառավիղը)
 */
function strangeCircle(radius) {
  if (checkCanvas()) {
    return;
  }

  if (!validate(radius, "radius"))
    return;

  let x1 = currentX;
  let y1 = currentY;
  ctx.save();
  for (let i = 0; i < 360; i++) {
    left(2);
    goTo(x1, y1);
    let a = random(radius - radius / 10, radius);
    let r = random(0, 359);
    move(a)
    left(r)
    drawLine(5)
  }
  rotate(0)
  ctx.restore();
}

//------------- End of The Strange Functions ------------

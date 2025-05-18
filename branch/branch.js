const canvas = document.getElementById('buschCanvas');
const ctx = canvas.getContext('2d');
const initialBranchLength = 100;
const angleVariation = 0.3; // Radian
const lengthReductionFactor = 0.7;
let recursionDepth = 0;
const maxDepth = 10;

function drawBranch(startX, startY, length, angle, depth) {
  if (depth > maxDepth) {
    return;
  }

  const endX = startX + length * Math.cos(angle);
  const endY = startY + length * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const newLength = length * lengthReductionFactor;

  // Verzweigung nach links
  const leftAngle = angle - angleVariation + Math.random() * angleVariation / 2;
  drawBranch(endX, endY, newLength, leftAngle, depth + 1);

  // Verzweigung nach rechts
  const rightAngle = angle + angleVariation - Math.random() * angleVariation / 2;
  drawBranch(endX, endY, newLength, rightAngle, depth + 1);
}

function animateGrowth() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recursionDepth++;
  drawBranch(canvas.width / 2, canvas.height, initialBranchLength, -Math.PI / 2, 0); // Startpunkt unten, wächst nach oben

  if (recursionDepth <= maxDepth) {
    requestAnimationFrame(animateGrowth);
  }
}

// Initialisierung (im HTML muss ein <canvas id="buschCanvas"></canvas> existieren)
canvas.width = 400;
canvas.height = 300;
ctx.strokeStyle = 'green';
animateGrowth();
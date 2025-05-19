const canvas = document.getElementById('buschCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;
ctx.strokeStyle = 'green';

const initialBranchLength = 100;
const angleVariation = 0.8;
const lengthReductionFactor = 0.8;
const maxDepth = 12;

// Jeder Eintrag: {x, y, length, angle, depth}
let growthQueue = [
  {
    x: canvas.width / 2,
    y: canvas.height,
    length: initialBranchLength,
    angle: -Math.PI / 2,
    depth: 0
  }

];

function growStep() {
  // Nimm einen Wachstumspunkt aus der Queue
  const branch = growthQueue.shift();
  if (!branch) return false;

  const {x, y, length, angle, depth} = branch;
  if (depth > maxDepth || length < 2) return true;

  const endX = x + length * Math.cos(angle);
  const endY = y + length * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const newLength = length * lengthReductionFactor;

  // Füge neue Wachstumspunkte für die nächsten Verzweigungen hinzu
  const leftAngle = angle - angleVariation + Math.random() * angleVariation / 4;
  const rightAngle = angle + angleVariation - Math.random() * angleVariation / 2;

  growthQueue.push({
    x: endX,
    y: endY,
    length: newLength,
    angle: leftAngle,
    depth: depth + 1
  });
  growthQueue.push({
    x: endX,
    y: endY,
    length: newLength,
    angle: rightAngle,
    depth: depth + 1
  });

  return true;

   
}

function animateGrowth() {
  // Für langsames Wachstum: nur wenige Schritte pro Frame
  for (let i = 0; i < 12; i++) {
    if (!growStep()) return;
  }
  if (growthQueue.length > 0) {
    requestAnimationFrame(animateGrowth);
  }
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
animateGrowth();
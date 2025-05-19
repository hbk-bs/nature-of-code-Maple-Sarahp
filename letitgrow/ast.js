const canvas = document.getElementById('buschCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;
const startX = canvas.width / 2;
const startY = canvas.height;
const initialLength = 120;
const angle = -Math.PI / 2 + 0.2; // Leichte Neigung nach rechts oben
const curveFactor = 20; // Stärke der Kurve
const branchAngleVariation = 0.4;
const branchLengthFactor = 0.7;
const maxDepth = 8;
const baseColor = 'olive';

function drawCurvedBranch(startX, startY, length, angle, depth) {
  if (depth > maxDepth) {
    return;
  }

  const endX = startX + length * Math.cos(angle);
  const endY = startY + length * Math.sin(angle);
  const controlX1 = startX + length / 3 * Math.cos(angle - Math.PI / 6) * curveFactor;
  const controlY1 = startY + length / 3 * Math.sin(angle - Math.PI / 6) * curveFactor;
  const controlX2 = endX - length / 3 * Math.cos(angle - Math.PI / 6) * curveFactor;
  const controlY2 = endY - length / 3 * Math.sin(angle - Math.PI / 6) * curveFactor;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = Math.max(1, 10 * Math.pow(branchLengthFactor, depth)); // Dicke nimmt mit Tiefe ab
  ctx.stroke();

  // Verzweigungen
  if (depth < maxDepth - 2) { // Weniger Verzweigungen in den tieferen Ebenen
    const leftAngle = angle - branchAngleVariation + Math.random() * branchAngleVariation / 2;
    const rightAngle = angle + branchAngleVariation - Math.random() * branchAngleVariation / 2;
    const newLength = length * branchLengthFactor;
    const branchPointX = startX + length * 0.6 * Math.cos(angle);
    const branchPointY = startY + length * 0.6 * Math.sin(angle);

    drawCurvedBranch(branchPointX, branchPointY, newLength, leftAngle, depth + 1);
    drawCurvedBranch(branchPointX, branchPointY, newLength, rightAngle, depth + 1);
  }
}

// Initialisierung (im HTML muss ein <canvas id="buschCanvas"></canvas> existieren)
drawCurvedBranch(startX, startY, initialLength, angle, 0);
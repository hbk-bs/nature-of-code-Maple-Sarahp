function setup() {
  createCanvas(800, 800);
  background(240);
  stroke(80, 30, 0);
  noLoop();
  drawBranch(width / 2, height, -PI / 2, 120, 12, 10);
}

function drawBranch(x, y, angle, len, thickness, depth) {
  if (len < 6 || thickness < 0.5 || depth <= 0) return;

  // Endpunkt berechnen
  let x2 = x + len * cos(angle);
  let y2 = y + len * sin(angle);

  // Dicke und Farbe setzen
  strokeWeight(thickness);
  stroke(80, 30, 0, map(thickness, 0.5, 12, 80, 200));
  line(x, y, x2, y2);

  // Hauptast wird nach oben dünner und kürzer
  let nextLen = len * random(0.85, 0.93);
  let nextThick = thickness * random(0.7, 0.85);

  // Hauptast weiterzeichnen (gerade nach oben)
  drawBranch(x2, y2, angle + random(-0.07, 0.07), nextLen, nextThick, depth - 1);

  // Seitenäste (Abspaltungen)
  if (depth > 2 && random() < 0.7) {
    let n = floor(random(1, 3)); // 1-2 Abspaltungen
    for (let i = 0; i < n; i++) {
      let branchAngle = angle + random(-PI / 3, PI / 3);
      let branchLen = len * random(0.3, 0.6);
      let branchThick = thickness * random(0.4, 0.7);
      // Seitenast zeichnen
      drawBranch(x2, y2, branchAngle, branchLen, branchThick, depth - 2);
    }
  }
}

function mousePressed() {
  background(240);
  drawBranch(width / 2, height, -PI / 2, 120, 12, 10);
}

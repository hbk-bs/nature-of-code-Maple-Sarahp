{
    const s = (p) => {
        let branches = [];
        let trunk;
        const maxGenerations = 12; // Angepasst
        const initialBranchProb = 0.01; // Sehr geringe anfängliche Verzweigungswahrscheinlichkeit
        const laterBranchProb = 0.05; // Erhöhte Wahrscheinlichkeit für spätere Verzweigungen
        const branchAngleMax = p.radians(35);
        const branchAngleMin = p.radians(10);
        const initialCurveFactor = 0.005; // Faktor für die anfängliche Kurve des Hauptastes

        class Branch {
            constructor(parent, pos, dir, generation) {
                this.parent = parent;
                this.pos = pos.copy();
                this.dir = dir.copy();
                this.generation = generation;
                this.curveOffset = p.random(-initialCurveFactor, initialCurveFactor); // Zufällige anfängliche Kurve

                if (this.generation >= 4) {
                    this.len = p.random(5, 8); // Begrenzte Länge für grüne Äste
                    this.strokeW = p.map(this.generation, 4, maxGenerations, 2, 0.5);
                    this.color = [34, 139, 34, 200]; // grün
                    this.dir = p.createVector(0, 1); // Tendenz nach unten für grüne Äste
                } else {
                    this.len = p.random(8, 15); // Längere braune Äste
                    this.strokeW = p.map(this.generation, 0, 4, 5, 2);
                    this.color = [80, 30, 0, 140]; // braun
                }

                this.growthDelay = this.generation < 2 ? p.floor(p.random(20, 50)) : 0;
            }

            branch(angleSign) {
                if (this.generation >= maxGenerations) return null;
                let angle, newDir = this.dir.copy();

                if (this.generation >= 4) {
                    newDir = p.createVector(0, 1).rotate(p.random(-p.PI / 6, p.PI / 6)); // Leichte seitliche Variation für grüne Äste
                } else {
                    angle = p.random(branchAngleMin, branchAngleMax) * angleSign;
                    newDir.rotate(angle);
                    // Tendenz zur Seite beibehalten
                    if (this.parent && this.parent.dir.x !== 0) {
                        newDir.x += this.parent.dir.x * 0.3;
                        newDir.normalize();
                    }
                    if (newDir.y > 0) newDir.y = -newDir.y; // Immer noch tendenziell nach oben/außen
                }
                return new Branch(this, this.pos, newDir, this.generation + 1);
            }

            grow() {
                if (this.growthDelay > 0) {
                    this.growthDelay--;
                    return true;
                }
                if (this.generation >= maxGenerations) return false;

                // Sanfte Kurve für den Hauptast und frühe Generationen
                if (this.generation < 3) {
                    let curve = p.noise(this.pos.x * 0.01, this.pos.y * 0.01) * 0.01 + this.curveOffset;
                    this.dir.rotate(curve);
                }
                // Organisches Wackeln für braune Äste
                else if (this.generation < 4) {
                    let angleWobble =
                        p.noise(this.pos.x * 0.9, this.pos.y * 0.01, p.frameCount * 0.005) *
                        p.PI * 0.01 - p.PI * 0.005;
                    this.dir.rotate(angleWobble + p.random(-0.05, 0.05));
                }
                // Leichte Kurve für grüne Äste (ab Generation 4)
                else {
                    let curve =
                        p.noise(this.pos.x * 0.05, this.pos.y * 0.05, p.frameCount * 0.01 + this.generation) *
                        0.1 - 0.05;
                    this.dir.rotate(curve);
                }

                let growthStep = this.dir.copy().setMag(this.len);
                let nextPos = p5.Vector.add(this.pos, growthStep);

                p.strokeWeight(this.strokeW);
                p.stroke(...this.color);
                p.line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);

                this.pos = nextPos;

                return !(
                    this.pos.x < 0 ||
                    this.pos.x > p.width ||
                    this.pos.y < 0 ||
                    this.pos.y > p.height
                );
            }
        }

        p.setup = () => {
            p.createCanvas(800, 800);
            p.background(240); // Hellerer Hintergrund
            resetSketch();
        };

        const resetSketch = () => {
            branches = [];
            let startPos = p.createVector(p.width / 2, p.height * 0.9); // Start etwas höher
            let initialDir = p.createVector(0.1, -1).normalize(); // Leichte Neigung nach rechts oben
            trunk = new Branch(null, startPos, initialDir, 0);
            branches.push(trunk);
            p.background(240);
            p.loop();
        };

        p.draw = () => {
            let newBranches = [];

            for (let i = branches.length - 1; i >= 0; i--) {
                let branch = branches[i];
                let stillOnScreen = branch.grow();

                if (!stillOnScreen) {
                    branches.splice(i, 1);
                    continue;
                }

                let currentBranchProb = branch.generation < 2 ? initialBranchProb : laterBranchProb;

                if (p.random(1) < currentBranchProb && branch.generation < maxGenerations) {
                    let angleSign = p.random(1) < 0.5 ? 1 : -1;
                    let newB = branch.branch(angleSign);
                    if (newB) {
                        newBranches.push(newB);
                    }
                    if (p.random(1) < 0.3) {
                        let newB2 = branch.branch(-angleSign);
                        if (newB2) {
                            newBranches.push(newB2);
                        }
                    }
                }
            }

            branches = branches.concat(newBranches);

            if (branches.length === 0) {
                console.log('Simulation abgeschlossen: Keine Branches mehr.');
                p.noLoop();
            }
            if (branches.length > 500) {
                console.log('Simulation gestoppt: Branch-Limit erreicht.');
                p.noLoop();
            }
        };

        p.mousePressed = () => {
            resetSketch();
        };
    };

    new p5(s, 'branching-substrate');
}

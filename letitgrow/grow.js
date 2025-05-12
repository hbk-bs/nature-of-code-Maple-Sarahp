{
    const s = (p) => {
        let branches = [];
        let trunk;
        const maxGenerations = 6; // How many times branches can split
        const branchProb = 0.05; // Erhöhte Wahrscheinlichkeit für Verzweigungen
        const branchAngleMax = p.radians(40); // Größerer maximaler Verzweigungswinkel
        const branchAngleMin = p.radians(15); // Kleinerer minimaler Verzweigungswinkel

        class Branch {
            constructor(parent, pos, dir, generation) {
                this.parent = parent; // Keep track of parent if needed, null for trunk
                this.pos = pos.copy(); // p5.Vector position
                this.dir = dir.copy(); // p5.Vector direction
                this.generation = generation; // How many splits led to this branch
                this.len = p.random(5, 10); // Length of each segment (adjusted for bush)
                this.strokeW = p.map(this.generation, 0, maxGenerations, 5, 1); // Stroke weight
                this.growthDelay = this.generation < 2 ? p.floor(p.random(10, 30)) : 0; // Delay for early generations
            }

            // Creates a new branch instance
            branch(angleSign) {
                if (this.generation >= maxGenerations) return null; // Stop branching if max generations reached

                let angle = p.random(branchAngleMin, branchAngleMax) * angleSign;
                let newDir = this.dir.copy();
                newDir.rotate(angle); // Rotate the direction vector

                // Prevent branches from growing downward
                if (newDir.y > 0) {
                    newDir.y = -newDir.y; // Flip the direction to ensure it doesn't point downward
                }

                return new Branch(this, this.pos, newDir, this.generation + 1);
            }

            // Grows the branch one step
            grow() {
                // Apply delay for early generations
                if (this.growthDelay > 0) {
                    this.growthDelay--;
                    return true; // Skip growth for this frame
                }

                if (this.generation >= maxGenerations) {
                    return false; // Stop growing
                }

                // Slight organic wobble
                let angleWobble =
                    p.noise(this.pos.x * 0.9, this.pos.y * 0.01, p.frameCount * 0.005) *
                    p.PI *
                    0.02 -
                    p.PI * 0.01;
                this.dir.rotate(angleWobble + p.random(-0.1, 0.1)); // Increased random wobble for bush

                // Calculate the next position
                let growthStep = this.dir.copy().setMag(this.len);
                let nextPos = p5.Vector.add(this.pos, growthStep);

                // Draw the line segment for this step
                p.strokeWeight(this.strokeW);
                p.stroke(50, 30, 0, 140); // Brownish color for branches
                p.line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);

                // Update the position for the next frame
                this.pos = nextPos;

                return !(
                    this.pos.x < 0 ||
                    this.pos.x > p.width ||
                    this.pos.y < 0 ||
                    this.pos.y > p.height
                );
            }
        }

        // Setup and draw functions
        p.setup = () => {
            p.createCanvas(700, 700); // Canvas size
            p.background(255);
            p.stroke(50, 30, 0, 140); // Brownish color for branches

            resetSketch(); // Initialize the branches
        };

        const resetSketch = () => {
            branches = []; // Clear existing branches
            let startPos = p.createVector(p.width / 2, p.height); // Start at the bottom center
            let initialDir = p.createVector(0, -1); // Grow upwards initially
            trunk = new Branch(null, startPos, initialDir, 0);
            branches.push(trunk); // Add trunk to the list
            p.background(255); // Clear canvas on reset
            p.loop(); // Ensure the loop is running
        };

        p.draw = () => {
            let newBranches = []; // Temporäres Array für neue Branches

            // Iteriere rückwärts durch die Branches
            for (let i = branches.length - 1; i >= 0; i--) {
                let branch = branches[i];
                let stillOnScreen = branch.grow(); // Wachse den Branch und prüfe, ob er sichtbar bleibt

                if (!stillOnScreen) {
                    branches.splice(i, 1); // Entferne Branch, wenn er außerhalb des Bildschirms ist
                    continue;
                }

                // Prüfe, ob sich dieser Branch verzweigen soll
                if (p.random(1) < branchProb && branch.generation < maxGenerations) {
                    // Zufällige Richtung für die Verzweigung
                    let angleSign = p.random(1) < 0.5 ? 1 : -1;
                    let newB = branch.branch(angleSign); // Erstelle neuen Branch
                    if (newB) {
                        newBranches.push(newB); // Füge neuen Branch hinzu
                    }

                    // Optional: Zweite Verzweigung in die entgegengesetzte Richtung
                    if (p.random(1) < 0.4) { // 40% Chance für eine zweite Verzweigung
                        let newB2 = branch.branch(-angleSign);
                        if (newB2) {
                            newBranches.push(newB2);
                        }
                    }
                }
            }

            // Füge alle neuen Branches zur Hauptliste hinzu
            branches = branches.concat(newBranches);

            // Sicherheitschecks, um die Simulation zu stoppen
            if (branches.length === 0) {
                console.log('Simulation abgeschlossen: Keine Branches mehr.');
                p.noLoop(); // Stoppe die Schleife, wenn keine Branches mehr existieren
            }
            if (branches.length > 500) {
                console.log('Simulation gestoppt: Branch-Limit erreicht.');
                p.noLoop();
            }
        };

        // Reset the sketch when the mouse is pressed
        p.mousePressed = () => {
            // Erstelle einen neuen Branch an der Mausposition
            let mousePos = p.createVector(p.mouseX, p.mouseY); // Mausposition als Startpunkt
            let upwardDir = p.createVector(0, -1); // Richtung nach oben (negative Y-Achse)
            let newBranch = new Branch(null, mousePos, upwardDir, 0); // Neuer Branch mit Generation 0

            branches.push(newBranch); // Füge den neuen Branch zur Liste hinzu
        };
    };

    new p5(s, 'branching-substrate');
}

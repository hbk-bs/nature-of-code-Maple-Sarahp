{
    const s = (p) => {
        let branches = [];
        const numStartBranches = 10;
        const maxGenerations = 10;
        const branchProb = 0.08;
        const branchAngleMax = p.radians(30);
        const branchAngleMin = p.radians(15);

        class Branch {
            constructor(parent, pos, dir, generation) {
                this.parent = parent;
                this.pos = pos.copy();
                this.dir = dir.copy();
                this.generation = generation;
                this.len = p.random(5, 10);
                if (this.generation >= 4) {
                    this.strokeW = p.map(this.generation, 4, maxGenerations, 2, 0.5);
                } else {
                    this.strokeW = p.map(this.generation, 0, 4, 5, 2);
                }
                this.growthDelay = this.generation < 2 ? p.floor(p.random(10, 30)) : 0;
            }

            branch(angleSign) {
                if (this.generation >= maxGenerations) return null;
                let angle, newDir = this.dir.copy();
                if (this.generation >= 4) {
                    angle = p.random(p.radians(30), p.radians(130)) * angleSign;
                    newDir = p.createVector(0, 8);
                    newDir.rotate(angle);
                } else {
                    angle = p.random(branchAngleMin, branchAngleMax) * angleSign;
                    newDir.rotate(angle);
                    if (newDir.y > 0) newDir.y = -newDir.y;
                }
                return new Branch(this, this.pos, newDir, this.generation + 1);
            }

            grow() {
                if (this.growthDelay > 0) {
                    this.growthDelay--;
                    return true;
                }
                if (this.generation >= maxGenerations) return false;
                let angleWobble =
                    p.noise(this.pos.x * 0.9, this.pos.y * 0.01, p.frameCount * 0.005) *
                    p.PI * 0.02 - p.PI * 0.01;
                this.dir.rotate(angleWobble + p.random(-0.1, 0.1));
                let growthStep = this.dir.copy().setMag(this.len);
                let nextPos = p5.Vector.add(this.pos, growthStep);
                p.strokeWeight(this.strokeW);
                p.stroke(50, 30, 0, 130);
                p.line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);
                this.pos = nextPos;
                return !(this.pos.x < 0 || this.pos.x > p.width || this.pos.y < 0 || this.pos.y > p.height);
            }
        }

        p.setup = () => {
            p.createCanvas(700, 700);
            p.background(255);
            p.stroke(80, 30, 0, 140);
            resetSketch();
        };

        function resetSketch() {
            branches = [];
            for (let i = 0; i < numStartBranches; i++) {
                let x = p.random(50, p.width - 50);
                let y = p.height;
                let angle = p.random(-p.PI / 6, p.PI / 6); // leicht nach oben, aber mit Streuung
                let dir = p.createVector(0, -1).rotate(angle);
                let b = new Branch(null, p.createVector(x, y), dir, 0);
                branches.push(b);
            }
            p.background(255);
            p.loop();
        }

        p.draw = () => {
            let newBranches = [];
            for (let i = branches.length - 1; i >= 0; i--) {
                let branch = branches[i];
                let stillOnScreen = branch.grow();
                if (!stillOnScreen) {
                    branches.splice(i, 1);
                    continue;
                }
                if (p.random(1) < branchProb && branch.generation < maxGenerations) {
                    let angleSign = p.random(1) < 0.5 ? 1 : -1;
                    let newB = branch.branch(angleSign);
                    if (newB) newBranches.push(newB);
                    if (p.random(1) < 0.4) {
                        let newB2 = branch.branch(-angleSign);
                        if (newB2) newBranches.push(newB2);
                    }
                }
            }
            branches = branches.concat(newBranches);
            if (branches.length === 0 || branches.length > 500) p.noLoop();
        };

        p.mousePressed = () => {
            resetSketch();
        };
    };

    new p5(s, 'sketch');
}

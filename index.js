{
	const s = (p) => {
		let branches = [];
		let trunk;
		const maxGenerations = 6; // How many times branches can split
		const branchProb = 0.015; // Probability of branching per step (adjust for density)
		const branchAngleMax = p.radians(40); // Max branching angle from parent
		const branchAngleMin = p.radians(10); // Min branching angle from parent

		class Branch {
			constructor(parent, pos, dir, generation) {
				this.parent = parent; // Keep track of parent if needed, null for trunk
				this.pos = pos.copy(); // p5.Vector position
				this.dir = dir.copy(); // p5.Vector direction
				this.generation = generation; // How many splits led to this branch
				this.len = p.random(2, 4); // Length of each segment
				// Map generation to stroke weight - trunk is thickest
				this.strokeW = p.map(this.generation, 0, maxGenerations, 5, 1);
			}

			// Creates a new branch instance
			branch(angleSign) {
				// angleSign determines direction (+1 right, -1 left)
				// Stop branching if max generations reached
				if (this.generation >= maxGenerations) return null;

				// Calculate the rotation angle
				let angle = p.random(branchAngleMin, branchAngleMax) * angleSign;
				let newDir = this.dir.copy();
				newDir.rotate(angle); // Rotate the direction vector

				// Create the new branch starting from the current position
				let newBranch = new Branch(this, this.pos, newDir, this.generation + 1);
				return newBranch;
			}

			// Grows the branch one step
			grow() {
				// Introduce slight organic wobble/variation using noise and random
				// Adjust these multipliers for different effects
				let angleWobble =
					p.noise(this.pos.x * 0.01, this.pos.y * 0.01, p.frameCount * 0.005) *
						p.PI *
						0.02 -
					p.PI * 0.01; // Much smaller wobble
				this.dir.rotate(angleWobble + p.random(-0.01, 0.01)); // Also reduced random wobble

				// Calculate the next position
				let growthStep = this.dir.copy().setMag(this.len);
				let nextPos = p5.Vector.add(this.pos, growthStep);

				// Draw the line segment for this step
				p.strokeWeight(this.strokeW);
				p.line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);

				// Update the position for the next frame
				this.pos = nextPos;

				// Return true if the branch is still within canvas bounds
				return !(
					this.pos.x < 0 ||
					this.pos.x > p.width ||
					this.pos.y < 0 ||
					this.pos.y > p.height
				);
			}
		}

		p.setup = () => {
			p.createCanvas(500, 500); // Increased canvas size
			p.background(255);
			p.stroke(0, 0, 0, 180); // Black with some transparency

			resetSketch(); // Initialize the branches
		};

		const resetSketch = () => {
			branches = []; // Clear existing branches
			// Start the main trunk near the left-middle, growing mostly right
			let startPos = p.createVector(0, (p.height / 4) * 3 + p.random(-50, 50)); // Start near left edge, random Y
			let initialDir = p.createVector(1, p.random(-0.2, 0.2)); // p5.Vector pointing mostly right, slight vertical variation
			trunk = new Branch(null, startPos, initialDir, 0);
			branches.push(trunk); // Add trunk to the list
			p.background(255); // Clear canvas on reset
			p.loop(); // Ensure the loop is running
		};

		p.draw = () => {
			let newBranches = []; // Temporary array for branches created this frame

			// Iterate backwards because we might remove elements (branches going off-screen)
			for (let i = branches.length - 1; i >= 0; i--) {
				let branch = branches[i];
				let stillOnScreen = branch.grow(); // Grow the branch and check if it's still visible

				if (!stillOnScreen) {
					branches.splice(i, 1); // Remove if off-screen
					continue; // Move to the next branch
				}

				// Check if this branch should spawn a new one
				if (p.random(1) < branchProb && branch.generation < maxGenerations) {
					// Randomly decide if the new branch goes left or right
					let angleSign = p.random(1) < 0.7 ? 1 : -1;
					let newB = branch.branch(angleSign); // Create the new branch
					if (newB) {
						newBranches.push(newB); // Add to temp array
					}

					// Optional: Add a chance for a second branch splitting the other way
					if (p.random(1) < 0.4) {
						// 40% chance for a second split
						let newB2 = branch.branch(-angleSign); // Opposite angle sign
						if (newB2) {
							newBranches.push(newB2);
						}
					}
				}
			}

			// Add all newly created branches to the main list
			branches = branches.concat(newBranches);

			// Safety checks to stop the simulation
			if (branches.length === 0) {
				console.log('Simulation complete: No branches left.');
				p.noLoop(); // Stop draw loop if no branches exist
			}
			if (branches.length > 500) {
				// Limit total branches to prevent freezing
				console.log('Simulation stopped: Branch limit reached.');
				p.noLoop();
			}
		};

		// Reset the sketch when the mouse is pressed
		p.mousePressed = () => {
			resetSketch();
		};

		p.mousePressed = () => {
			// Erstelle einen neuen Branch an der Mausposition
			let mousePos = p.createVector(p.mouseX, p.mouseY);
			let randomDir = p.createVector(p.random(-1, 1), p.random(-1, 1)).normalize(); // Zufällige Richtung
			let newBranch = new Branch(null, mousePos, randomDir, 0); // Neuer Branch mit Generation 0

			branches.push(newBranch); // Füge den neuen Branch zur Liste hinzu
		};
	};

	new p5(s, 'branching-substrate');
}

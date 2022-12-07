class Snake {
	constructor() {
		this.resetGame = false;
		this.gameOver = false;
		this.endTime = 0;
		
		this.worm = new Worm();
	}
	
	render() {
		this.renderBackground();
		
		if (!this.gameOver) {
			this.worm.render();
		} else {
			this.renderEnd();
			this.endTime++;
		}
		
		if (this.worm.dead) {
			this.gameOver = true;
		}
	}
	
	renderEnd() {
		background(0,0,0);
		stroke(0);
		strokeWeight(2);
		textSize(21);
		fill(255, 0, 0);
		text("You died with " + (this.worm.count + 1) + " blocks!", width / 2, height / 2 - 25);
		fill(255);
		text("Press any key to reset!", width / 2, height / 2);
	}
	
	reset() {
		if (this.resetGame) {
			return true;
		}
		return false;
	}
	
	press(k, kc) {
		if (this.endTime > 20) {
			this.resetGame = true;
		}
		if (!this.gameOver) {
			this.worm.press(k, kc);
		}
	}
	
	click(x, y) {
		if (this.endTime > 20) {
			this.resetGame = true;
		}
	}
	
	renderBackground() {
		background(211,211,211);
		strokeWeight(3);
		stroke(75, 200, 75);
		noFill();
		rect(width / 2, (height - values.bar) / 2, width - values.margin * 2, height - values.bar - values.margin * 2);
	}
}

class Worm {
	constructor() {
		this.size = (width - values.margin * 2) / values.snakeCols;
		this.pos = createVector(values.margin + this.size / 2, values.margin + this.size / 2);
		this.time = 0;
		this.vel = createVector(1, 0);
		this.inVel = createVector(1, 0);
		this.speed = 5;
		this.blocks = [];
		this.count = 2;
		for (let i = 0; i < this.count; i++) {
			this.blocks[i] = new Block(this.size);
		}
		this.fruit = new Fruit(this.size);
	}
	
	render() {		
		if (this.time % this.speed == 0) {
			for (let i = this.blocks.length - 1; i > 0; i--) {
				this.blocks[i].pos.x = this.blocks[i - 1].pos.x;
				this.blocks[i].pos.y = this.blocks[i - 1].pos.y;
			}
			this.blocks[0].pos.x = this.pos.x;
			this.blocks[0].pos.y = this.pos.y;
			
			this.vel.x = this.inVel.x;
			this.vel.y = this.inVel.y;
			this.pos.x += this.vel.x * this.size;
			this.pos.y += this.vel.y * this.size;
		}
		
		if (this.pos.x > width - values.margin || this.pos.x < values.margin || this.pos.y < values.margin || this.pos.y > height - values.bar - values.margin) {
			this.dead = true;
		}
		
		if (this.near(this.pos, this.fruit.pos)) {
			this.count++;
			this.fruit = new Fruit(this.size);
			this.blocks.push(new Block(this.size));
		}
		
		this.fruit.render();
		
		for (let i = 0; i < this.blocks.length; i++) {
			this.blocks[i].render();
		}
		
		fill(255);
		noStroke();
		rect(this.pos.x, this.pos.y, this.size, this.size, 5);
		
		this.time++;
	}
	
	near(p1, p2) {
		let m = 2;
		if (p1.x > p2.x - m && p1.x < p2.x + m) {
			if (p1.y > p2.y - m && p1.y < p2.y + m) {
				return true;
			}
		}
		return false;
	}

	press(k, kc) {
		if (k == "w" || kc == 38) {
			if (this.vel.y == 0) {
				this.inVel.x = 0;
				this.inVel.y = -1;
			}
		}
		if (k == "a" || kc == 37) {
			if (this.vel.x == 0) {
				this.inVel.x = -1;
				this.inVel.y = 0;
			}
		}
		if (k == "s" || kc == 40) {
			if (this.vel.y == 0) {
				this.inVel.x = 0;
				this.inVel.y = 1;
			}
		}
		if (k == "d" || kc == 39) {
			if (this.vel.x == 0) {
				this.inVel.x = 1;
				this.inVel.y = 0;
			}
		}
	}
}

class Block {
	constructor(s) {
		this.pos = createVector(-width, -height);
		this.size = s;
	}
	
	render() {
		fill(255);
		noStroke();
		rect(this.pos.x, this.pos.y, this.size, this.size, 5);
	}
}

class Fruit {
	constructor(s) {
		let rx = floor(random(values.snakeCols - 0.001));
		let ry = floor(random(floor((height - values.bar - values.margin * 2) / s) - 0.001));
		this.pos = createVector(values.margin + s / 2 + rx * s, values.margin + s / 2 + ry * s);
		this.size = s * 0.75;
	}
	
	render() {
		fill(255, 0, 0);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}
}
var screensize = 600;
var player = {x: 0, y: 0, vx: 0, vy: 0}
var a = 0.1;
var score = 0;
var walls = new Set();
var wallv = 5;
var wallTimeInterval = 1;

function setup() {

	//console.log("score = " + score);
	//console.log("high score = " + document.getElementById("highscore").innerHTML);
	if (score > document.getElementById("highscore").innerHTML) {
		//console.log("updating high score");
		document.getElementById("highscore").innerHTML = score;
	}

	createCanvas(screensize,screensize);
	background(0);

	score = 0
	player.x = width/2;
	player.y = height/2;
	player.vx = 0;
	player.vy = 0;
	a = 1;
	walls = new Set();
	wallv = 10;
	wallTimeInterval = 1;

}

function draw() {

	background(0);

	if (frameCount % 30 == 0) {
		score++;
	}

	//player
	if (keyIsDown(UP_ARROW)) {
		player.vy -= a;
	} else if (keyIsDown(RIGHT_ARROW)) {
		player.vx += a;
	} else if (keyIsDown(DOWN_ARROW)) {
	    player.vy += a;
	} else if (keyIsDown(LEFT_ARROW)) {
		player.vx -= a;
	}

	player.x += player.vx;
	if (player.vx > 3) player.vx = 3;
	if (player.vx < -3) player.vx = -3;
	player.y += player.vy;
	if (player.vy > 3) player.vy = 3;
	if (player.vy < -3) player.vy = -3;
	if (player.x < 0 || player.x > width || player.y < 0 || player.y > height) setup();
	stroke(255);
	fill(255);
	ellipse(player.x, player.y, 10, 10);

	//obstacles
	wallTimeInterval--;
	//console.log(wallTimeInterval);
	if (wallTimeInterval < 0) {
		wallTimeInterval = 240 * (1 + Math.random());
		let rotation = Math.floor(Math.random() * 4);
		console.log("creating wall with rotation " + rotation);
		let x = 0;
		let y = 0;
		let vx = 0;
		let vy = 0;
		switch (rotation) {
			case 0:
				x = screensize;
				y = 0;
				vx = -wallv;
				break;
			case 1:
				x = 0;
				y = 0;
				vy = wallv;
				break;
			case 2:
				x = 0;
				y = 0;
				vx = wallv;
				break;
			case 3:
				x = 0;
				y = screensize;
				vy = wallv;
				break;
		}
		walls.add(new wall(x, y, vx, vy, 100 + Math.floor(Math.random() * (height - 200)) - 100, 200));
	}
	for (let w of walls) {
		w.x += w.vx;
		w.y += w.vy;
		//TODO: delete
		rect(w.x, 0, 20, w.voidHeight);
		rect(w.x, w.voidHeight + w.voidSize, 20, height);
	}

}

function keyPressed() {
	if (keyCode === 82) {
		setup();
	}
}

//obstacles
function wall(x, y, vx, vy, voidHeight, voidSize) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.voidHeight = voidHeight;
	this.voidSize = voidSize;
}

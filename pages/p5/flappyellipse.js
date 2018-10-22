var player = {x: 0, y: 0, vy: 0};
var g;
var jump;
var maxvy;
var score = 0;
var space;
var walls = new Set();
var wallvx;
var highscore = 0;

function wall(x, voidHeight, voidSize) {
	this.x = x;
	this.voidHeight = voidHeight;
	this.voidSize = voidSize;
}

function setup() {

	//console.log("score = " + score);
	//console.log("high score = " + document.getElementById("highscore").innerHTML);
	if (score > highscore) {
		//console.log("updating high score");
		highscore = score;
		document.getElementById("highscore").innerHTML = score;
	}
	for (let w of walls) {
		if (w.x < player.x - 20 && w.x > 0) {	
			score++;
		}
	}

	createCanvas(1800, 600);
	background(0);

	player.x = 100;
	player.y = 300;
	g = 0.3;
	jump = 10;
	maxvy = 10;
	score = 0;
	walls = new Set();
	wallvx = 10;

}

function draw() {

	background(0);

	player.vy += g;
	if (player.vy > maxvy) {
		player.vy = maxvy;
	}
	player.y += player.vy;
	if (player.y < 0 || player.y > height) {
		setup();
	}
	ellipse(player.x, player.y, 20, 10);

	if (frameCount % 120 == 0) {
		walls.add(new wall(width, 100 + Math.floor(Math.random() * (height - 200)) - 100, 200));
	}
	for (let w of walls) {
		w.x -= wallvx;
		if (w.x < 0) {
			score++;
			walls.delete(w);
		} else {
			rect(w.x, 0, 20, w.voidHeight);
			rect(w.x, w.voidHeight + w.voidSize, 20, height);
			if (player.x > w.x && player.x < w.x + 20) {
				if (player.y < w.voidHeight || player.y > w.voidHeight + w.voidSize) {
					setup();
				}
			}
		}
	}
	wallvx = score + 10;
	
	textSize(25);
	fill(255)
	text("Score: " + score + "\nHigh: " + highscore, width - 150, height - 50);

}

function keyPressed() {
	if (keyCode === 82) {
		setup();
	} else {
		player.vy = -jump;
	}
}

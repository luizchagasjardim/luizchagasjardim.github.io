var wallLength;
var nHorizontalCells, nVerticalCells;
var cells;
var player = {x: 0, y: 0};
var count;
var time;
var timeString;
var solx = [];
var soly = [];

function setup() {
	init();
}

function init() {

	//console.log("getting sizes");
	createCanvas(document.getElementById("width").value, document.getElementById("height").value);
	wallLength = document.getElementById("cellSize").value;
	nHorizontalCells = parseInt(width/wallLength-2);
	nVerticalCells = parseInt(height/wallLength-1);

	//console.log("reseting values");
	background(255);
	frameRate(30);
	player.x = 0;
	player.y = 0;
	count = 150;
	time = 0;
	timeString = "";
	solx = [];
	soly = [];

	//console.log("generating maze");
	cells = new Array(nHorizontalCells);
	for (i = 0; i < nHorizontalCells; i++) {
		cells[i] = new Array(nVerticalCells);
		for (j = 0; j < nVerticalCells; j++) {
			cells[i][j] = {visited: false, horizontalWall: true, verticalWall: true};
		}
	}
	var pathx = [];
	var pathy = [];
	i = 0;
	j = 0;
	do {
		//console.log(i + ", " + j);
		cells[i][j].visited = true;
		pathx.push(i);
		pathy.push(j);
		//console.log(solx.size);
		if (i == nHorizontalCells-1 && j == nVerticalCells-1 && solx.length == 0) {
			//console.log("getting solution");
			for (k = 0; k < pathx.length; k++) {
				solx[k] = pathx[k];
				soly[k] = pathy[k];
				//console.log(pathx[k] + ", " + pathy[k]);
				//console.log(solx[k] + ", " + soly[k]);
			}
			solx.push(nHorizontalCells);
			soly.push(nVerticalCells - 1);
		}
		var options = []
		if (j > 0) {
			if (!cells[i][j-1].visited) {
				options.push("north");
				//console.log("north");
			}
		}
		if (i < nHorizontalCells-1) {
			if (!cells[i+1][j].visited) {
				options.push("east");
				//console.log("east");
			}
		}
		if (j < nVerticalCells-1) {
			if (!cells[i][j+1].visited) {
				options.push("south");
				//console.log("south");
			}
		}
		if (i > 0) {
			if (!cells[i-1][j].visited) {
				options.push("west");
				//console.log("west");
			}
		}
		var choose = options[Math.floor(Math.random() * options.length)];
		//console.log("choose: " + choose);
		switch (choose) {
			case ("north"):
				cells[i][j].horizontalWall = false;
				j--;
				break;
			case ("east"):
				i++;
				cells[i][j].verticalWall = false;
				break;
			case ("south"):
				j++;
				cells[i][j].horizontalWall = false;
				break;
			case ("west"):
				cells[i][j].verticalWall = false;
				i--;
				break;
			default:
				pathx.pop();
				pathy.pop();
				if (pathx.length > 0) {
					i = pathx.pop();
					j = pathy.pop();
				}
		}
	} while (pathx.length > 0)

	//console.log("drawing maze");
	mazeDraw();
}

function draw() {

	background(255);
	imageMode(CORNER);
	image(mazeGraphics, 0, 0, width, height);

	if (document.getElementById("solution").checked) showSolution();

	noStroke();
	fill(0);
	ellipse((player.x + .5)*wallLength, (player.y + .5)*wallLength, wallLength/2, wallLength/2);
	if (player.x == nHorizontalCells && player.y == nVerticalCells - 1) {
		if (count == 150) {
			minutes = parseInt((time/30)/60);
			//console.log(time);
			//console.log(minutes);
			if (minutes > 0) {
				time -= minutes*60*30;
				timeString = minutes + " min ";
			}
			seconds = parseInt(time/30);
			//console.log(time);
			//console.log(seconds);
			if (seconds > 0) {
				time -= seconds*30;
				timeString += seconds + " s ";
			}
			miliseconds = parseInt(100*time)/100;
			//console.log(time);
			//console.log(miliseconds);
			if (miliseconds > 0) {
				timeString += miliseconds + " ms ";
			}
		}
		fill(255);
		stroke(1);
		rect(wallLength*parseInt(nHorizontalCells*0.25), wallLength*parseInt(nVerticalCells*0.25), wallLength*parseInt(nHorizontalCells*0.5), wallLength*parseInt(nVerticalCells*0.5));
		textAlign(CENTER);
		textSize(25);
		fill(100);
		noStroke();
		text("YOU WIN!\n\ntime = " + timeString + "\n\nRestarting in " + (1+parseInt(count/30)), wallLength*parseInt(nHorizontalCells*0.25) + wallLength*parseInt(nHorizontalCells*0.5)/2, wallLength*parseInt(nVerticalCells*0.25) + wallLength*parseInt(nVerticalCells*0.5)/4);
		if (count-- == 0) {
			init();
		}
	} else {
		time++;
	}

}

function keyPressed() {
	move();
	if (keyIsDown(16)) {
		for (k = 0; k < nHorizontalCells + nVerticalCells; k++) {
			move();
		}
	}
}

function move() {
	if (document.getElementById("trail").checked) {
		mazeGraphics.noStroke();
		mazeGraphics.fill(0);
		mazeGraphics.ellipse((player.x + .5)*wallLength, (player.y + .5)*wallLength, wallLength/8, wallLength/8);
	}
	if (keyCode === UP_ARROW) {
		if (player.y > 0 && !cells[player.x][player.y].horizontalWall) player.y--;
	} else if (keyCode === RIGHT_ARROW) {
		if (player.x == nHorizontalCells-1 && player.y == nVerticalCells-1) player.x++;
		if (player.x < nHorizontalCells && !cells[player.x+1][player.y].verticalWall) player.x++;
	} else if (keyCode === DOWN_ARROW) {
	    if (player.y < nVerticalCells && !cells[player.x][player.y+1].horizontalWall) player.y++;
	} else if (keyCode === LEFT_ARROW) {
		if (player.x > 0 && !cells[player.x][player.y].verticalWall) player.x--;
	} else if (keyCode === 82) {
		init();
	}
}

function mazeDraw() {
	mazeGraphics = createGraphics(width, height);
	mazeGraphics.background(255);
	mazeGraphics.fill(0);
	mazeGraphics.stroke(0);
	for (i = 0; i < nHorizontalCells; i++) {
		for (j = 0; j < nVerticalCells; j++) {
			//console.log(i + ", " + j);
			if (cells[i][j].horizontalWall) {
				//console.log("draw horizontal wall");
				mazeGraphics.line(i*wallLength, j*wallLength, (i+1)*wallLength, j*wallLength);
			}
			if (cells[i][j].verticalWall) {
				//console.log("draw vertical wall");
				mazeGraphics.line(i*wallLength, j*wallLength, i*wallLength, (j+1)*wallLength);
			}
		}
	}
	mazeGraphics.line(0, j*wallLength, i*wallLength, j*wallLength);
	mazeGraphics.line(i*wallLength, 0, i*wallLength, (j-1)*wallLength);
}

function showSolution() {
	//console.log("draw solution");
	for (k = 0; k < solx.length-1; k++) {
		stroke(200);
		fill(200);
		line((solx[k]+.5)*wallLength, (soly[k]+.5)*wallLength, (solx[k+1]+.5)*wallLength, (soly[k+1]+.5)*wallLength)
	}
}

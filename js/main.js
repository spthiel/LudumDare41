
const maxups = 60.0;
var highestNumber = 100;
var maxtimetoclick = 3000;
var maxspawndelay = 5000;

var frame = 0;
var screen;
var cellwidth = 100;
var grid;
var startTime;
var endTime;
var gamestate;
var activeCell;
var lastUpdate = 0;
var difficulty = 1.0;
var difficultyIncrease = 0.0005;
var difficultyIncreaseIncrease = 0.000001;
var lastReaction;
var maxdifficulty = 5;
var maxdifficultyincrease = 0.01;
var number;
var lastNumberValue;
var possibleNumbers = [];

var button;
var inputField;

var kills = 0;

var health = 5;
var score = 0;

var quickies;

gamestate = "menu"

var hover = -1;

function setup() {
	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); }
	}
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	let canvas = createCanvas(screen.w,screen.h);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
	cellwidth = screen.h*2/25;
	if(screen.w*0.8/5 < cellwidth)
		cellwidth = screen.w*0.8/5;
	if(grid)
		grid.resize();
}

function setupGame(difficultyChoosen) {
	switch(difficultyChoosen) {
		case 1:
			setupEasyGame();
			break;
		case 2:
			setupMediumGame();
			break;
		case 3:
			setupInsaneGame();
			break;
	}
	lastUpdate = 0;
	lastReaction = Date.now();
	grid = new Grid();
	gamestate = "start";
	quickies = [];
	for(let i = 0; i < highestNumber; i++) {
		possibleNumbers[i] = i+1;
	}
	grid.resize();
	angleMode(DEGREES);
}

function setupEasyGame() {
	highestNumber = 70;
	maxtimetoclick = 10000;
	maxspawndelay = 10000;
}

function setupMediumGame() {
	highestNumber = 100;
	maxtimetoclick = 3000;
	maxspawndelay = 5000;
}

function setupInsaneGame() {
	highestNumber = 300;
	maxtimetoclick = 2000;
	maxspawndelay = 2000;
}

function getColor(frame) {
	return "hsl(" + (frame%720/2 | 0) + ",100%,50%)";
}

function removeNumber() {
	let setNumbers = grid.definedNumbers();
	for(let i = possibleNumbers.length-1; i >= 0; i--) {
		let num = possibleNumbers[i];
		if(!setNumbers.includes(num)) {
			possibleNumbers.splice(i,1);
			return;
		}
	}
}

function endGame(){

	gamestate = "lose"
	endTime = Date.now();

}

function draw() {

	if(Date.now()-lastUpdate > 1000.0/maxups) {
		update();
		lastUpdate = Date.now();
	}

}


function update() {
	background(100);

	switch(gamestate) {
		case "game":
			updateGame();
			break;
		case "start":
			updateStart();
			break;
		case "win":
			updateWin();
			break;
		case "lose":
			updateLose();
			break;
		case "menu":
			updateMenu(hover);
			break;
	}
	frame++;
}

function newNumber() {
	number = possibleNumbers[random(possibleNumbers.length) | 0];
	if(number == lastNumberValue) {
		newNumber();
	} else {
		lastNumberValue = number;
	}
}

var border = 100;


function spawnRandomReaction() {
	let x = random(screen.w-2*border)+border;
	let y = random(screen.h-2*border)+border;
	if(x < this.grid.center.x-cellwidth*5 || x > this.grid.center.x+cellwidth*5 || y < this.grid.center.y-cellwidth*5 || y > this.grid.center.y+cellwidth*5) { //out of grid
		quickies[quickies.length] = new QuickReactions(x,y);
	} else {
		spawnRandomReaction();
	}
}

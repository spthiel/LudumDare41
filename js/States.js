/* get's called when in game to update the game */
function updateGame() {

	grid.drawAll();

	if(Date.now() - lastReaction > maxspawndelay/difficulty) {
		lastReaction = Date.now();
		spawnRandomReaction();
	}
	difficulty += difficultyIncrease;
	difficultyIncrease += difficultyIncreaseIncrease;
	if(difficultyIncrease > maxdifficultyincrease)
		difficultyIncrease = maxdifficultyincrease;
	if(difficulty > maxdifficulty)
		difficulty = maxdifficulty;

	push();
		translate(screen.w/2,screen.h/2);
		fill(TEXTCOLOR);
		textSize(cellwidth*4);
		textAlign(CENTER,BOTTOM);
		if(number == 0 || !number) {
			newNumber();
		}
		text((number ? number : 0),0,0);
	pop();

	push();
		fill(TEXTCOLOR);
		translate(10,screen.h-10);
		textSize(cellwidth/4);
		textAlign(LEFT,BOTTOM);
		displayscores();
	pop();

	for(let i = 0; i < quickies.length; i++) {
		let reaction = quickies[i];
		if(reaction.isDead) {
			quickies.splice(i,1);
			i--;
		} else {
			reaction.draw();
		}
	}
}

/* get's called when in setup to update the grid */
function updateStart() {

	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,CENTER);
		text("Enter your bingo numbers below\n(1 to " + highestNumber + ")",0,0);
	pop();
	push();
		fill(BUTTONCOLOR);
		translate(screen.w-cellwidth,screen.h-cellwidth/2-cellwidth/4);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2,5,5);
		fill(BUTTONTEXTCOLOR);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("START",0,0);
	pop();
	push();
		fill(BUTTONCOLOR);
		translate(screen.w-cellwidth,screen.h-cellwidth-cellwidth/2);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2,5,5);
		fill(BUTTONTEXTCOLOR);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("RAN",0,0);
	pop();
	grid.drawAll();

}

/* text that will be displayed for the stats */
var statstext = "Difficulty: $difficulty\nLevel: $level\nHealth: $health\nKills: $kills\nTime: $time";

/* get's called when in winscreen (wouldn't really need to be updated but whatever) */
function updateWin() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,BOTTOM);
		text("Congratulations, you won!\n",0,0);
		textAlign(LEFT,TOP);
		translate(-cellwidth*2,0);
		textSize(cellwidth/4);
		displayscores();
	pop();
}

/* get's called when in losescreen (wouldn't really need to be updated but whatever) */
function updateLose() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,BOTTOM);
		text("The gray squares ran you over.\nYou died!\n",0,0);
		textAlign(LEFT,TOP);
		translate(-cellwidth*2,0);
		textSize(cellwidth/4);
		displayscores();
	pop();
}

/* updates the main menu */
function updateMenu(hover) {
	push();
		translate(screen.w/2,screen.h/2-2*cellwidth-cellwidth/2);
		fill(TEXTCOLOR);
		textAlign(CENTER,BOTTOM);
		textSize(cellwidth*2);
		if(font.font) {
			textFont(font)
		} else {
			textFont("alien encounters");
		}
		stroke(0);
		strokeWeight(15);
		text("BLITZINGO",0,0);
	pop();
	push();
		translate(screen.w/2,screen.h/2);
		textAlign(CENTER,CENTER);
		textSize(cellwidth/2);
		stroke(0);
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 0) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,-cellwidth*3/2-cellwidth/4-cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("EASY",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 1) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,-cellwidth/2-cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("MEDIUM",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 2) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,cellwidth/2+cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("INSANE",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 3) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,cellwidth*3/2+cellwidth/4+cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("OPTIONS",0,0);
		pop();

	pop();
}

/* called when in options (never gotten around to add any options so now it's just there) */
function updateOptions() {
	push();
		fill([255,255,255]);
		textSize(cellwidth/2);
		textAlign(CENTER,CENTER);
		translate(screen.w/2,screen.h/2);
		text("What options do you need?",0,0);
	pop();
}

// CUSTOM FUNCTIONS

/* calls text() and writes the scoreboard to position/align use them beforehand */
function displayscores() {
	let timeto = endTime;
	if(!timeto)
		timeto = Date.now();
	let formattime = formatTime(timeto-startTime);
	let t = statstext.replace("$score",(score/100 | 0)).replace("$level","" + diffToLevel()).replace("$health",health).replace("$kills",kills).replace("$time",formattime).replace("$difficulty",difficultyGame);
	if(difficultyGame == "easy") {
		t = t.replace("Health","Amount of Damage received");
	}
	text(t,0,0);
}

/* function to calculate the level based of the difficulty */
function diffToLevel() {
	return (6.188*(difficulty-1)*(difficulty-1)+1) | 0;
}

/* used to format a time difference in format m:ss.SSS */
function formatTime(timedif) {
	let ms = timedif%1000;
	timedif = (timedif-timedif%1000)/1000;
	let s = timedif%60;
	timedif = (timedif-timedif%60)/60;
	let m = timedif;
	if(ms < 10) {
		ms = "00" + ms;
	} else if(ms < 100) {
		ms = "0" + ms;
	}
	if(s < 10) {
		s = "0" + s;
	}
	return m + ":" + s +"." + ms;
}

const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';
const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';

var gGamerPos;
var isCanMove;
var gBoard;
var gBalls;
var isGameOn;
var gAddBallIntrvl, gAddGlueIntrvl, changeTitle, removeGlueItrvl, hideGlueInfo;
var audioWin = new Audio('sounds/footballkick.mp3');
var audioGameOver = new Audio('sounds/gameOver.mp3');

function init() {

	reset();
	gBoard = buildBoard();
	renderBoard(gBoard);
	console.log(gBoard)

	addRndBalls();
	addGlue();
}

function reset() {
	gBalls = 0;
	isGameOn = true;
	isCanMove = true;
	gGamerPos = { i: 2, j: 5 };
	var elTitle = document.querySelector('#title');
	elTitle.innerHTML = "Collect those FootBall Balls";

	clearInterval(gAddBallIntrvl)
	clearInterval(gAddGlueIntrvl)
	clearTimeout(changeTitle)
	clearTimeout(removeGlueItrvl)
	clearTimeout(hideGlueInfo)
}

function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null, isStuck: false };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				if (!(j === 5 && (i === 0 || i === 9) || i === 5 && (j === 0 || j === 11))) {
					cell.type = WALL;
				}
			}
			//handeling the model
			board[i][j] = cell;
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR && currCell.gameElement === GLUE) cellClass += ' floor glue';
			else if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';


			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += '\t' + GAMER_IMG + '\n';
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	if (!isGameOn) return;
	if (gBoard[gGamerPos.i][gGamerPos.j].isStuck) return;

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 || iAbsDiff === 9) && jAbsDiff === 0 ||
		(jAbsDiff === 1 || jAbsDiff === 11) && iAbsDiff === 0) {

		if (targetCell.gameElement === BALL) {
			gBalls++;
			var elSpanBall = document.querySelector('#ballsNum');
			elSpanBall.innerHTML = gBalls
			audioWin.play();

		}

		if (targetCell.gameElement === GLUE) {
			targetCell.isStuck = true;
			displayInfo();
		}

		// MOVING
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}

	gameOver();
}



// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

function displayInfo() {
	var elGlueInfo = document.querySelector('.glueInfo');
	elGlueInfo.style.visibility = 'visible';

	hideGlueInfo = setTimeout(function () {
		elGlueInfo.style.visibility = 'hidden';
	}, 3000);
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			if (i === 5 && j === 0) j = 12;
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (i === 5 && j === 11) j = -1;
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0 && j === 5) i = 10;
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === 9 && j === 5) i = -1;
			moveTo(i + 1, j);
			break;
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function rndEmptyCell() {
	var rndCell = null, cell;

	rndCell = randomCell(gBoard.length, gBoard[0].length);
	cell = gBoard[rndCell.i][rndCell.j];

	while (!isBoardFull(gBoard) && !(cell.type === FLOOR && cell.gameElement === null)) {
		rndCell = randomCell(gBoard.length, gBoard[0].length);
		cell = gBoard[rndCell.i][rndCell.j];
	}

	return rndCell;
}

//Every few seconds a new ball is added in a random empty cell
function addRndBalls() {

	gAddBallIntrvl = setInterval(function () {

		var randomCellPos = rndEmptyCell();

		if (randomCellPos) {
			var cell = gBoard[randomCellPos.i][randomCellPos.j];
			if (cell.type === FLOOR && cell.gameElement === null) {
				//MODEL
				cell.gameElement = BALL
				//DOM
				renderCell(randomCellPos, BALL_IMG);
			}
		}
	}, 2000)
}


function gameOver() {
	isGameOn = false;

	for (var i = 0; i < gBoard.length && !isGameOn; i++) {
		for (var j = 0; j < gBoard[0].length && !isGameOn; j++) {
			var cell = gBoard[i][j];
			if (cell.gameElement === BALL) isGameOn = true;
		}
	}

	if (!isGameOn) {
		clearInterval(gAddBallIntrvl);
		clearInterval(gAddGlueIntrvl);

		changeTitle = setTimeout(function () {
			var elTitle = document.querySelector('#title');
			elTitle.innerHTML = "Game Over Press Restart To Play Again"
			audioGameOver.play();
		}, 1000);
	}
}

function isBoardFull(board) {
	var isFull = true;
	for (var i = 0; i < board.length && isFull; i++)
		for (var j = 0; j < board[0].length && isFull; j++)
			if (board[i][j].type === FLOOR && board[i][j].gameElement === null) isFull = false;
	return isFull;
}

//Add support for gameElement GLUE,
//when user steps on GLUE he cannot move for 3 seconds.
//GLUE is added to board every few seconds and gone after 3 seconds.

function addGlue() {

	gAddGlueIntrvl = setInterval(function () {

		var coord = rndEmptyCell();
		var cell = gBoard[coord.i][coord.j];

		if (coord && cell.type === FLOOR && cell.gameElement === null) {
			//model
			cell.gameElement = GLUE;
			//DOM
			var elClass = '.' + getClassName(coord);
			var elCell = document.querySelector(elClass);
			elCell.classList.add('glue');

			removeGlueItrvl = setTimeout(function () {

				//model
				cell.gameElement = null;
				if (cell.isStuck) {
					//MODEL
					cell.isStuck = false;
				}
				//DOM
				var elClass = '.' + getClassName(coord);
				var elCell = document.querySelector(elClass);
				elCell.classList.remove('glue');
			}, 3000);
		}
	}, 2000);
}
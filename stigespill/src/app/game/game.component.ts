import { Component, OnInit } from '@angular/core';
import { GameserviceService } from '../gameservice.service';
import { ViewEncapsulation } from '@angular/core'
import { Player } from './Player';
import { Square } from './Square';
import { Board } from './Board';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {
  gameservice: GameserviceService;
  board: Board;
  squares = new Array<Square>();
  players = new Array<Player>();
  maxPlayers: number = 4;
  gameRunning: boolean;
  currentPlayer: Player;
  currentPlayerInArray: number;

  constructor(gameservice: GameserviceService) {
    this.gameservice = gameservice;
    this.gameRunning = false;
  }

  ngOnInit() {
    this.getBoard();
    window.addEventListener('resize', function () {
      let svg = document.getElementById("svg");
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
    }, true);
  }


  getBoard(): void {
    this.gameservice.getBoard().subscribe(json => {
      this.board = new Board(json);
      this.getSquares();
    });
  }

  getSquares() {
    let goal = this.board.dimY * this.board.dimX;
    let start = this.board['start']
    for (var i = start; i <= goal; i++) {
      this.gameservice.getSquare(i).subscribe(json => {
        let temp = new Square(json);
        this.squares.push(temp);
        if (this.squares.length == goal) {
          this.sortSquares();
          this.printBoard(this.board);
        }
      });
    }
  }

  sortSquares(): void {
    this.squares.sort((a, b) => a.number < b.number ? -1 : a.number > b.number ? 1 : 0)
  }

  printBoard(board: Board): void {
    const numOfRows = board.dimY;
    for (var i = numOfRows; i > 0; i--) {
      this.createRow(i);
    }
    for (let square in this.squares) {
      this.drawSquare(this.squares[square]);
    }
    this.redrawWormholes();

  }


  createRow(rowId: number) {
    var elem = document.getElementById("board");
    var row = document.createElement("div"); row.setAttribute("id", "row-" + rowId); row.setAttribute("class", "row");

    if (rowId % 2 == 0) {
      row.setAttribute("class","row-reversed row");
    }
    elem.appendChild(row);
  }

  drawSquare(squareObject: Square) {
    var row = document.getElementById("row-" + squareObject.posY);
    var square = document.createElement("div");

    var numberTag = document.createElement("p"); numberTag.setAttribute("class", "square-number");
    numberTag.innerHTML = squareObject.number.toString();

    var squareName = document.createElement("p"); squareName.setAttribute("class", "square-name");
    squareName.innerHTML = squareObject.name;

    var squarePlayerBox = document.createElement("div"); squarePlayerBox.setAttribute("id", "playerBox-" + squareObject.number); squarePlayerBox.setAttribute("class", "playerBox");
    square.appendChild(numberTag);
    square.appendChild(squarePlayerBox);
    square.appendChild(squareName);
    

    if (squareObject.number == this.board.goal) {
      square.setAttribute("class", "square goal")
    }
    else {
      square.setAttribute("class", "square");
    }
    square.setAttribute("id", "square-" + squareObject.number);

    row.appendChild(square);
  }

  rollDice(playerName: string): void {
    let diceElem = document.getElementById("dice-image");
    let msgElem = document.getElementById("dice-messages");
    let number = Math.floor(Math.random() * 6) + 1;
    diceElem.setAttribute("src", "../src/images/dice-" + number + ".png");
    msgElem.innerHTML = playerName + " rolled a " + number + "!";

    this.movePlayer(number, this.currentPlayer);

    this.currentPlayerInArray++;
    if (this.currentPlayerInArray >= this.players.length) {
      this.currentPlayerInArray = 0;
      this.currentPlayer = this.players[0];
    }
    else {
      this.currentPlayer = this.players[this.currentPlayerInArray];
    }
  }

  getSquareById(id: number): Square {
    for (let square in this.squares) {
      if (this.squares[square].number == id) {
        return this.squares[square];
      }
    }
    return null;
  }

  startGame(): void {
    this.players = new Array<Player>();
    let numOfPlayers: number;
    while (numOfPlayers > this.maxPlayers || !numOfPlayers) {
      numOfPlayers = parseInt(window.prompt("How many players? (1 - 4)"));
    }

    for (let i = 1; i <= numOfPlayers; i++) {
      let player = new Player(i);
      this.players.push(player);
    }
    this.gameRunning = true;
    this.currentPlayer = this.players[0];
    this.currentPlayerInArray = 0;
    this.drawPlayers();
  }


  movePlayer(squaresToMove: number, player: Player) {
    let newPos = player.pos + squaresToMove;
    let lastSquare = this.board.dimX * this.board.dimY;
    let msg: string;
   
    
    if (newPos > lastSquare) {
      msg = player.name + " stood on " + player.pos + " and rolled a " + squaresToMove + ". They bounced back to square " + (lastSquare - (newPos - lastSquare) + ".");
      player.pos = lastSquare - (newPos - lastSquare);
   }
   else if (this.getSquareById(newPos).wormhole) {
      let wormholeTo = this.getSquareById(newPos).wormhole;
      msg = player.name + " moved " + squaresToMove + " squares, from " + player.pos + " to " + newPos + ". ";;
      msg += player.name + " fell into a wormhole on square " + newPos + ", and teleported to square " + wormholeTo + ".";
     player.pos = wormholeTo;
     setTimeout(function () {
       alert("Wormhole! " + player.name + " was teleported from square " + newPos + " to square " + wormholeTo + ".");
     }, 100)
    }
    else {
      msg = player.name + " moved " + squaresToMove + " squares and moved from " + player.pos + " to " + newPos + ".";;
      player.pos = newPos;
    }
    this.printMessage(msg);
    player.numOfDiceRolls++;
    this.drawPlayers();

    if (player.pos == this.board.goal) {
      msg = player.name + " won the game!";
      this.printMessage(msg);
      window.alert(msg);
      this.gameRunning = false;
    }
  }

  drawPlayers(): void {
    this._clearPlayers();
    for (let i = 0; i < this.players.length; i++) {
      let playerToDraw: Player = this.players[i];
      let playerElement = document.createElement("p");
      playerElement.setAttribute("class", "player");
      playerElement.setAttribute("style", "color:" + playerToDraw.color);
      playerElement.innerHTML = playerToDraw.name;
      let squareToPutPlayerIn = document.getElementById("playerBox-" + playerToDraw.pos);
      squareToPutPlayerIn.appendChild(playerElement);
    }
  }
  


  drawLine(startSquare: number, endSquare: number) {
    var svgContainer = document.getElementById("svg");
    var line = document.createElementNS('http://www.w3.org/2000/svg',"line");
    line.setAttribute("id", "line");

    if (startSquare < endSquare) {
      line.setAttribute("style", "stroke:green");
    }
    else {
      line.setAttribute("style", "stroke:red");
    }
    

    var div1 = document.getElementById("square-" + startSquare);
    var div2 = document.getElementById("square-" + endSquare);

    var x1 = div1.offsetLeft + (div1.offsetWidth/ 2);
    var y1 = div1.offsetTop + (div1.offsetHeight / 2);
    var x2 = div2.offsetLeft + (div2.offsetWidth / 2);
    var y2 = div2.offsetTop + (div2.offsetHeight / 2);

    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    svgContainer.appendChild(line);
  }

  printMessage(msg: string) {
    this._clearMessages();
    var msgBox = document.getElementById("message-box");
    let p = document.createElement("p");
    p.innerHTML = msg;
    msgBox.appendChild(p);
  }

  redrawWormholes() {
    this.hideWormholes();
    for (let square in this.squares) {
      if (this.squares[square].wormhole) {
        let start = this.squares[square].number;
        let end = this.squares[square].wormhole;
        this.drawLine(start, end);
      }
    }
  }

  hideWormholes() {
    let svg = document.getElementById("svg");
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  _getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  _clearPlayers() {
    var elements = document.getElementsByClassName("player");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  _clearMessages() {
    var msgBox = document.getElementById("message-box");
    while (msgBox.firstChild) {
      msgBox.removeChild(msgBox.firstChild);
    }
  }


}

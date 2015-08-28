var gameOptions = {
  width: 600,
  height: 600,
  numEnemies: 20
};

var gameStats = {
  high: 0,
  current: 0,
  collisions: 0
};

var gameBoard = 
  d3.select('body')
  .append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)

var Enemy = function(id) {
  this.id = id;
  this.x = Math.random() * gameOptions.width;
  this.y = Math.random() * gameOptions.height;
}

var enemies = [];

for (var i = 0; i < gameOptions.numEnemies; i++) {
  enemies.push(new Enemy(i));
}

var Player = function() {
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
};

var players = [];
players.push(new Player);
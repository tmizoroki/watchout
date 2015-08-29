/************************************
Game Options, Stats, and Game Board
*************************************/

var gameOptions = {
  width: 600,
  height: 600,
  numEnemies: 20
};

var gameStats = {
  high: 0,
  current: 0,
  collisions: 0,
  collisionsThisInterval: 0
};

var d3gameBoard = 
  d3.select('body')
  .append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .attr('class', 'gameBoard')

// var axes = {
//   x : d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
//   y : d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
// };

/************************************
Enemy Behavior
*************************************/

//Enemy Constructor
var Enemy = function(id) {
  this.id = id;
  this.x = Math.random() * 600;
  this.y = Math.random() * 600;
  this.r = 10;
};

//Create a new set of Enemies
var moveEnemies = function() {
  var newEnemies = [];

  for (var i = 0; i < gameOptions.numEnemies; i++) {
    newEnemies.push(new Enemy(i));
  }
  enemyUpdate(newEnemies);
};

var enemyUpdate = function(data) {
  
  //DATA JOIN
  var d3enemies = d3gameBoard.selectAll('.enemies').data(data, function(d) { return d.id });

  //UPDATE
  d3enemies
  .transition()
  .duration(1000)
  .attr('x', function(d) { return d.x; })
  .attr('y', function(d) { return d.y; })
  //call customTween
  .tween('collision', collisionTween);

 
  //ENTER
  d3enemies
  .enter()
  .append('image')
  .attr('class', 'enemies')
  .attr('height', 20)
  .attr('width', 20)
  .attr('xlink:href', './shuriken.png')
  .attr('x', function(d) { return d.x; })
  .attr('y', function(d) { return d.y; })
  .attr('r', function(d) { return d.r; })

  //EXIT
  d3enemies.exit().remove();
};

var checkCollision = function(enemy) {
  var d3enemies = d3gameBoard.selectAll('.enemies');
  var enemyR = Number(d3enemies.attr('r')); //CHANGED THIS
  //get this individual enemy's x and y positions
  var enemyX = enemy.attr('x');
  var enemyY = enemy.attr('y');

  // get player position
  var playerX = Number(d3.select('.player').attr('cx'));
  var playerY = Number(d3.select('.player').attr('cy'));

  //calculate distance
  var xDelta = /*Math.abs(*/enemyX - playerX/*)*/;
  var yDelta = /*Math.abs(*/enemyY - playerY/*)*/;
  var l = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));

  //calculate radius sum
  var r = players[0].r + enemyR;
  
  if (l < r) {
    //reset score
    gameStats.collisionsThisInterval++;
  }
};

var collisionTween = function() {
  //get enemy position data, current and end
  var enemy = d3.select(this);
  var endX = enemy[0][0].__data__.x;
  var endY = enemy[0][0].__data__.y;
  var startX = Number(enemy.attr('x'));
  var startY = Number(enemy.attr('y'));

  return function(t) {
    
    checkCollision(enemy);

    nextX = startX + (endX - startX) * t;
    nextY = startY + (endY - startY) * t;
    // debugger;

    enemy.attr('x', nextX);
    enemy.attr('y', nextY);    
  }

};


/************************************
Player Functions and Behavior
*************************************/

var Player = function(id) {
  this.id = id;
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
  this.r = 10;
};

var drag = d3.behavior.drag()
  .on('drag', function() { 
    d3Player.attr('cx', d3.event.x)
    .attr('cy', d3.event.y); 
  });


var players = [];
players.push(new Player(1));

var d3Player = d3gameBoard.selectAll('.player')
  .data(players, function(d) { return d.id; })
  .enter()
  .append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', function(d) { return d.r; })
  .style('fill', 'blue')
  .call(drag);

/************************************
Begin Set Intervals
*************************************/

//initialize enemies and update
//moveEnemies();
setInterval(function() {
  moveEnemies();

  if(gameStats.collisionsThisInterval > 0) {
    gameStats.collisions++;
    gameStats.current = 0;
    d3.select('#num-collisions').data([gameStats.collisions])
    .text(function(d) { return d; });
    gameStats.collisionsThisInterval = 0;
  }

}, 1000);

//update high and current scores every 100ms
setInterval(function() {
  gameStats.current++;

  if (gameStats.current > gameStats.high) {
    gameStats.high = gameStats.current;
    d3.select('#high-score').data([gameStats.high])
    .text(function(d) { return d; });
  }

  d3.select('#current-score').data([gameStats.current])
  .text(function(d) { return d; });

}, 100);



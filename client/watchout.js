/************************************
Game Options, Stats, and Game Board
*************************************/

var shurikenPath = "M2366 4068 c-9 -24 -75 -225 -147 -447 -98 -304 -129 -412 -125 -435\
  3 -17 24 -57 45 -89 92 -134 67 -294 -59 -378 -137 -92 -296 -51 -384 101 -55\
  94 -34 90 -536 88 -392 -3 -435 -5 -438 -19 -2 -12 112 -100 379 -294 210\
  -152 395 -282 411 -287 21 -8 44 -5 97 11 131 40 238 18 310 -64 46 -53 64\
  -99 65 -170 1 -85 -24 -144 -86 -200 -55 -49 -105 -68 -185 -67 -41 0 -55 -4\
  -72 -22 -14 -15 -69 -167 -156 -437 -74 -228 -135 -420 -135 -426 0 -7 8 -13\
  18 -13 9 0 184 121 387 269 297 216 372 275 380 300 7 20 8 53 2 98 -17 120\
  32 220 133 277 47 26 65 31 125 31 59 0 79 -5 124 -30 60 -33 112 -96 131\
  -159 8 -26 10 -69 5 -127 -6 -69 -4 -92 7 -108 21 -30 740 -550 761 -551 22 0\
  22 11 -7 100 -204 625 -249 758 -261 774 -11 14 -30 20 -71 23 -151 9 -254\
  116 -254 262 0 79 22 132 75 186 21 20 56 46 79 56 51 23 147 25 206 4 54 -19\
  83 -19 120 0 34 17 725 518 755 547 17 16 18 20 5 28 -21 14 -888 13 -927 0\
  -23 -9 -40 -29 -75 -93 -34 -63 -55 -89 -91 -114 -124 -83 -287 -54 -368 67\
  -72 106 -62 229 25 327 50 56 66 83 66 114 0 20 -261 836 -283 887 -15 34 -34\
  27 -51 -20z m117 -1441 c87 -37 141 -120 140 -218 -2 -199 -239 -297 -386\
  -160 -112 104 -85 295 52 368 51 27 142 31 194 10z";

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
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  //call customTween
  .tween('collision', collisionTween);

 
  //ENTER
  d3enemies
  .enter()
  .append('circle')
  .attr('class', 'enemies')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', function(d) { return d.r; })
  .attr('fill', 'red')

  //EXIT
  d3enemies.exit().remove();
};

var checkCollision = function(enemy) {
  var d3enemies = d3gameBoard.selectAll('.enemies');
  var enemyR = Number(d3enemies.attr('r')); //CHANGED THIS
  //get this individual enemy's x and y positions
  var enemyX = enemy.attr('cx');
  var enemyY = enemy.attr('cy');

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
  var startX = Number(enemy.attr('cx'));
  var startY = Number(enemy.attr('cy'));

  return function(t) {
    
    checkCollision(enemy);

    nextX = startX + (endX - startX) * t;
    nextY = startY + (endY - startY) * t;
    // debugger;

    enemy.attr('cx', nextX);
    enemy.attr('cy', nextY);    
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



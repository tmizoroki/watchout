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

var d3gameBoard = 
  d3.select('body')
  .append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)

// var axes = {
//   x : d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
//   y : d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
// };

//Enemy functions and behavior

var Enemy = function(id) {
  this.id = id;
  this.x = Math.random() * 600;
  this.y = Math.random() * 600;
  this.r = 10;
};

 

var enemyUpdate = function(data) {
  
  //DATA JOIN
  var d3enemies = d3gameBoard.selectAll('.enemies').data(data, function(d) { return d.id });

  //UPDATE
  d3enemies
  .transition()
  .duration(1500)
  .tween('circles', function(d) {
    // var x = d.x;
    // var y = d.y;
    var enemyR = d.r;

    return function() {
      debugger;

      var playerX = Number(d3.select('.player').attr('cx'));
      var playerY = Number(d3.select('.player').attr('cy'));
      var xDelta = Math.abs(this.__data__.x - playerX);
      var yDelta = Math.abs(this.__data__.y - playerY);
      var r = players[0].r + enemyR;
      var l = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
        // debugger;
      if (l < r) {
        //reset score
        gameStats.current = 0;
        d3.select('#num-collisions').data([gameStats.collisions])
        .text(function(d) { return d; });
        return gameStats.collisions++;
      }
    }
  })
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })

 
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


var moveEnemies = function() {
  var newEnemies = [];

  for (var i = 0; i < gameOptions.numEnemies; i++) {
    newEnemies.push(new Enemy(i));
  }
  enemyUpdate(newEnemies);
};

//Player functions and behavior

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

setInterval(moveEnemies, 2000);

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

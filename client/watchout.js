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

var axes = {
  x : d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y : d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var Enemy = function(id) {
  this.id = id;
  this.x = Math.random() * 100;
  this.y = Math.random() * 100;
};

var enemies = [];

var Player = function() {
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
};

var players = [];
players.push(new Player);

var enemyUpdate = function(data) {
  
  //DATA JOIN
  var d3enemies = d3gameBoard.selectAll('.enemies').data(data, function(d) { return d.id });

  //UPDATE
  d3enemies
  .transition(2000)
  .attr('cx', function(d) { return axes.x(d.x); })
  .attr('cy', function(d) { return axes.y(d.y); })

 
  //ENTER
  d3enemies
  .enter()
  .append('circle')
  .attr('class', 'enemies')
  .attr('cx', function(d) { return axes.x(d.x); })
  .attr('cy', function(d) { return axes.y(d.y); })
  .attr('r', 10)
  .attr('fill', 'red')

  //EXIT
  d3enemies.exit().remove();
};

var play = function() {
  var newEnemies = [];

  for (var i = 0; i < gameOptions.numEnemies; i++) {
    newEnemies.push(new Enemy(i));
  }
  enemyUpdate(newEnemies);
};




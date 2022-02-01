
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body;

var balls = [];
var boundaries = [];
var pegs = [];
var graphHeights = [];
let ballSize = 5;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    for(let i = 0; i < width; i++) {
      graphHeights[i] = 0;
    }
    canvas.position(0, 0);
    engine = Engine.create();
    world = engine.world;
    // textFont(helventicaFont);
    // boundaries.push(new Boundary(width / 2, height - 10, width, 20, 0));
    let pegSize = ballSize;
    for(let i = 3; i < height/pegSize/4; i++) {
      for(let j = -1; j < i + 1; j++) {
        pegs.push(new Peg(width/2 - pegSize * i * 2 + pegSize * j * 4 + pegSize * 2, i * pegSize * 4, pegSize));
      }
    }
    boundaries.push(new Boundary(width/2 - pegSize * 12 - pegSize, pegSize * 5, pegSize * 22, 5, PI/5));
    boundaries.push(new Boundary(width/2 + pegSize * 12 + pegSize, pegSize * 5, pegSize * 22, 5, -PI/5));
}

function windowResized() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
}

function draw() {
  background(255);
  boundaries.forEach((item, i) => {
    item.show();
  });
  pegs.forEach((item, i) => {
      item.show();
  });
  let toRemove = [];
  balls.forEach((item, i) => {
      item.show();
      if (item.isOffScreen()) {
          balls.splice(i, 1);
          toRemove.push(item);
          // item.removeFromWorld();
          graphHeights[Math.floor((item.body.position.x + ballSize * 2)/(ballSize*4))]+=0.5;
      }
  });

  toRemove.forEach(item => {
    item.removeFromWorld();
  });

  Engine.update(engine);

  if(frameCount%7==0) {
    balls.push(new Ball(width/2 , 0, 5, random(0, 255)));
  }


  strokeWeight(3);

  
  for(let i = 0; i < graphHeights.length-1; i++) {
    stroke(150, 150, 255, 100);
    line(ballSize*4*i, height-graphHeights[i], ballSize*4*i+ballSize*4, height-graphHeights[i+1]);
    line(ballSize*4*i, height, ballSize*4*i, height-graphHeights[i]);
    line(ballSize*4*i + ballSize * 2, height, ballSize*4*i + ballSize * 2, height-((graphHeights[i] + graphHeights[i+1])/2));
    noStroke();
    fill(150, 150, 255, 100);
    ellipse(ballSize*4*i, height-graphHeights[i], 5);
  }
  stroke(150, 150, 255, 100);
  strokeWeight(1);

  num = 0;
  dem = 0;
  for(let i = 0; i < graphHeights.length; i++) {
    num += i * graphHeights[i] * ballSize * 4;
    dem += graphHeights[i];
  }

  mean = num/dem;
  line(mean, 0, mean, height);

  fill(200);
  noStroke();
  frameRate(100);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("FPS: " + Math.floor(frameRate()), width * 3 / 4, height / 4);
}

  
function mousePressed() {
  balls.push(new Ball(mouseX, mouseY, 5, random(0, 255)));
}

function Ball(x, y, r, hue) {
  options = {
    friction: 0,
    restitution: 0.7
  }
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  this.hue = hue;
  World.add(world, this.body);

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    colorMode(HSB, 255);
    noStroke();
    fill(hue, 255, 255, 100);
    ellipse(0, 0, 2*r, 2*r);
    pop();
  }

  this.isOffScreen = function() {
    var pos = this.body.position;
    return pos.y > height+100;
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }
}

function Peg(x, y, r) {
  options = {
    isStatic: true,
    friction: 0
  }

  this.body = Bodies.circle(x, y, r, options);
  
  World.add(world, this.body);
  this.x = x;
  this.y = y;
  this.r = r;

  this.show = function() {
    noStroke();
    fill(200);
    ellipse(this.x, this.y, 2*this.r);
  }
  
  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }
}

function Boundary(x, y, w, h, a) {
  var options = {
    isStatic: true,
    friction: 0.3,
    restitution: 1,
    angle: a,
  }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  
    this.show = function() {
      var pos = this.body.position;
      var angle = this.body.angle;
  
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      rectMode(CENTER);
      noStroke();
      fill(200);
      rect(0, 0, this.w, this.h);
      pop();
    }
  
    this.removeFromWorld = function() {
      World.remove(world, this.body);
    }
  }
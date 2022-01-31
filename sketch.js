
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body;

var balls = [];
var boundaries = [];
var pegs = [];
var graphHeights = [];

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
    let pegSize = 5;
    for(let i = 2; i < 39; i++) {
      for(let j = 0; j < i; j++) {
        pegs.push(new Peg(width/2 - pegSize * i * 2 + pegSize * j * 4 + pegSize * 2, i * pegSize * 4, pegSize));
      }
    }
}

function windowResized() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
}

function draw() {
  background(255);
  
  stroke(100, 100, 255);
  for(let i = 0; i < graphHeights.length-1; i++) {
    line(15*i, height-graphHeights[i], 15*i+15, height-graphHeights[i+1]);
  }
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
          graphHeights[Math.floor((item.body.position.x + 5)/15)]++;
      }
  });

  toRemove.forEach(item => {
    item.removeFromWorld();
  });

  Engine.update(engine);

  if(frameCount%10==0) {
    balls.push(new Ball(width/2 + random(-4, 4), 0, 5, random(0, 255)));
  }
}

  
  function mousePressed() {
    balls.push(new Ball(mouseX, mouseY, 5, random(0, 255)));
  }

  //   this.mouseReleased = function() {
  //     mouseDown = false;
  //     if(mouseX < deadZoneX && mouseY < deadZoneY) {
  //       // key = 'none';
  //       return;
  //     }
  //     if (mode == '3' && mouseXStart > 0 && mouseYStart > 0) {
  //       let x = mouseX;
  //       let y = mouseY;
  
  //       let length = dist(x, y, mouseXStart, mouseYStart);
  
  //       let angle = atan2(y - mouseYStart, x - mouseXStart);
  
  //       boundaries.push(new Boundary((x + mouseXStart) / 2, (y + mouseYStart) / 2, length, 20, angle));
  
  //     }
  //   }
  
  //   this.mouseDragged = function() {
  //     if(mouseX < deadZoneX && mouseY < deadZoneY) {
  //       // key = 'none';
  //       return;
  //     }
  
  //     if (mode == '4') {
  //       if (frameCount % 2 == 0) {
  //         boxes.push(new Box(sliderOptions, mouseX, mouseY, random(5, 30), random(5, 30), random(0, 255)));
  //         balls.push(new Ball(sliderOptions, mouseX, mouseY, random(2.5, 15), random(0, 255)));
  //       }
  //     }
  //   }
  
  //   this.keyPressed = function() {
  //     if (key == 'r') {
  //       boxes.forEach((item, i) => {
  //         item.removeFromWorld();
  //       });
  
  //       boxes = [];
  
  //       balls.forEach((item, i) => {
  //         item.removeFromWorld();
  //       });
  //       balls = [];
  
  //       for (var i = 1; i < boundaries.length; i) {
  
  //         boundaries[i].removeFromWorld();
  //         boundaries.splice(i, 1);
  //       }
  //     }
  //   }
  // }

function Ball(x, y, r, hue) {
  options = {
    friction: 0,
    restitution: 0.3
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
      fill(100);
      rect(0, 0, this.w, this.h);
      pop();
    }
  
    this.removeFromWorld = function() {
      World.remove(world, this.body);
    }
  }
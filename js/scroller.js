// not minified for your pleasure

function Player(canvas, image) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.image = image;
  this.x = 50;
  this.y = -100;
  this.vy = 0;
  this.width = 68;
  this.height = 100;
  this.state = 'stand';
  this.gravity = 0.35;
}

Player.prototype.spriteOffsets = {
  stand: 0,
  walk: 68,
  jump: 136
};

Player.prototype.draw = function(timePassed) {
    this.vy += this.gravity;
    this.y += this.vy;

    if (this.y + this.height >= this.canvas.height) {
        this.y = this.canvas.height - this.height;
        this.vy = 0;
        if (this.state === 'jump') {
          this.state = 'stand';
        }
    }

  var leftSpace = this.spriteOffsets[this.state];
  this.ctx.drawImage(this.image,leftSpace,0,this.width, this.height, this.x, this.y, this.width, this.height);
};

Player.prototype.updateStride = function(timestamp) {
  if (this.state === 'jump') {
    return;
  }

  var pace = 300;
  var walk = timestamp % pace > pace/2;
  this.state = walk ? 'walk' : 'stand';
};

Player.prototype.jump = function() {
  if (this.state === 'jump') {
    return;
  }
  this.vy -= 7;
  this.state = 'jump';
};

function Game(player, canvas) {
  this.player = player;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.obstacles = [];

}

Game.prototype.detectCollision = function(obj1, obj2) {
  function detectXOverlap(obj1, obj2) {
      var obj1Left = obj1.x;
      var obj1Right = obj1.x + obj1.width;
      var obj2Left = obj2.x;
      var obj2Right = obj2.x + obj2.width;

      if ( (obj1Right > obj2Left && obj1Right < obj2Right) ||
           (obj1Left > obj2Left && obj1Left < obj2Right)) {
          return true;
      }

      return false;
  }

  function detectYOverlap(obj1, obj2) {
    var obj1Top = obj1.y;
    var obj1Bottom = obj1.y + obj1.height;
    var obj2Top = obj2.y;
    var obj2Bottom = obj2.y + obj2.height;
    if ((obj1Top > obj2Top && obj1Top < obj2Bottom) ||
        (obj1Bottom > obj2Bottom && obj1Bottom < obj2Top)) {
        return true;
    }

    return false;
  }

    return detectXOverlap(obj1, obj2) && detectYOverlap(obj1, obj2);
};


Game.prototype.render = function(timestamp) {
  for(var i=0;i<this.obstacles.length;i++) {
    if (this.detectCollision(this.obstacles[i], this.player)) {
      return;
    }
  }

  // Generate new obstacle
  if (Math.random()*200< 1){
    this.obstacles.push(new Rock(canvas));
  }

  var timePassed = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
  this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

  this.player.updateStride(timestamp);
  this.player.draw(timePassed);

  for(var i=0;i<this.obstacles.length;i++) {
      if (this.obstacles[i].x < 0) {
        this.obstacles[i] = null;
      } else {
        this.obstacles[i].render(timePassed);
      }
  }

  //cleanup
  var newArray = [];
  for(var i=0;i<this.obstacles.length;i++) {
    if (this.obstacles[i]) {
      newArray.push(this.obstacles[i])
    }
  }
    this.obstacles = newArray;

  window.requestAnimationFrame(this.render.bind(this));
}

function Rock(c) {
  this.height = Math.random() * 30 + 5
  this.width = Math.random() * 30 + 5
  this.x = 800;
  this.y = c.height - this.height;
  this.vx = -5;
  this.canvas = c;
  this.ctx = c.getContext("2d");
}

Rock.prototype.render = function(timepassed) {
  this.x += this.vx;
  this.ctx.beginPath();
  this.ctx.lineWidth = 7;
  this.ctx.rect(this.x,this.y,this.width, this.height);
  this.ctx.stroke();
};

window.onload = function() {
    var c=document.getElementById("canvas");
    var img = document.createElement('img');
    img.onload = function() {
      var db = new Player(c, img);
      var game = new Game(db, c);

      window.startGame = function() {
        game.render();

        document.onkeydown = function(e) {
            if (e.which == 32 ) {
              e.preventDefault();
              db.jump();
            }
        };
      }
    };

    img.src = "./images/walk.png";
};


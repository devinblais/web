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

  this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
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
  this.vy -= 7;
  this.state = 'jump';
};

function Game(player) {
  this.player = player;
}

var objects = [];

Game.prototype.render = function(timestamp) {
  var timePassed = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
  this.player.updateStride(timestamp);
  this.player.draw(timePassed);
  window.requestAnimationFrame(this.render.bind(this))
}

function Rock(c) {
  this.height = this.width = 50;
  this.x = 400;
  this.y = c.height - this.height;
  this.vx = -1;
  this.canvas = c;
  this.ctx = c.getContext("2d");
}

Rock.prototype.render = function(timepassed) {
  this.x += this.vx
  //this.ctx.rect(this.x,this.x,this.width, this.height)
    this.ctx.rect(0, 0, 100, 100)
  this.ctx.stroke();
}

window.onload = function() {
    var c=document.getElementById("canvas");
    var img = document.createElement('img');
    img.onload = function() {
      var db = new Player(c, img);
      var game = new Game(db);
      var rock = new Rock(c)
      window.objects.push(rock);
      game.render();
      //window.setInterval(db.walk.bind(db), 100);

      document.onkeydown = function(e) {
          if (e.which == 32 ) {
            e.preventDefault();
            db.jump();
          }
      };
    };
    img.src = "./images/walk.png";
};


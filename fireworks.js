(function() {
  var canvas = document.getElementById('fireworks');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var fireworksRunning = false;
  var rockets = [], parts = [], animFrame = null;

  function resizeCanvas() {
    var s = canvas.parentElement;
    canvas.width = s.clientWidth;
    canvas.height = s.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  function Rocket() {
    this.x = canvas.width * (0.15 + Math.random() * 0.7);
    this.y = canvas.height;
    this.targetY = canvas.height * (0.1 + Math.random() * 0.3);
    this.vy = -(6 + Math.random() * 3);
    this.hue = Math.random() * 360;
    this.trail = [];
  }
  Rocket.prototype.update = function() {
    this.y += this.vy;
    this.vy *= 0.99;
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) this.trail.shift();
    return this.y < this.targetY || this.vy > -0.5;
  };
  Rocket.prototype.draw = function() {
    for (var i = 0; i < this.trail.length; i++) {
      var a = i / this.trail.length;
      ctx.beginPath();
      ctx.fillStyle = 'hsla(' + this.hue + ',100%,65%,' + (a * 0.7) + ')';
      ctx.arc(this.trail[i].x, this.trail[i].y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = 'hsl(' + this.hue + ',100%,80%)';
    ctx.shadowColor = 'hsl(' + this.hue + ',100%,70%)';
    ctx.shadowBlur = 20;
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function Particle(x, y, hue) {
    this.x = x; this.y = y;
    var ang = Math.random() * Math.PI * 2;
    var sp = Math.random() * 5 + 2;
    this.vx = Math.cos(ang) * sp;
    this.vy = Math.sin(ang) * sp;
    this.hue = hue + (Math.random() * 40 - 20);
    this.life = 1;
    this.decay = 0.012 + Math.random() * 0.015;
    this.size = Math.random() * 2.5 + 1.5;
  }
  Particle.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.06; this.vx *= 0.98; this.vy *= 0.98;
    this.life -= this.decay;
    return this.life > 0;
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = 'hsla(' + this.hue + ',100%,60%,' + this.life + ')';
    ctx.shadowColor = 'hsl(' + this.hue + ',100%,70%)';
    ctx.shadowBlur = 15;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function explode(x, y, hue) {
    var n = 60 + Math.floor(Math.random() * 40);
    for (var i = 0; i < n; i++) parts.push(new Particle(x, y, hue));
  }

  var lastRocketTime = 0;

  function loop(ts) {
    if (!fireworksRunning) return;
    ctx.fillStyle = 'rgba(10,10,18,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (ts - lastRocketTime > 500) {
      rockets.push(new Rocket());
      lastRocketTime = ts;
    }
    var nr = [];
    for (var i = 0; i < rockets.length; i++) {
      if (rockets[i].update()) explode(rockets[i].x, rockets[i].y, rockets[i].hue);
      else { rockets[i].draw(); nr.push(rockets[i]); }
    }
    rockets = nr;
    var np = [];
    for (var j = 0; j < parts.length; j++) {
      if (parts[j].update()) { parts[j].draw(); np.push(parts[j]); }
    }
    parts = np;
    animFrame = requestAnimationFrame(loop);
  }

  window.startFireworks = function() {
    if (fireworksRunning) return;
    resizeCanvas();
    fireworksRunning = true;
    lastRocketTime = 0;
    animFrame = requestAnimationFrame(loop);
  };
  window.stopFireworks = function() {
    fireworksRunning = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rockets = []; parts = [];
  };
})();
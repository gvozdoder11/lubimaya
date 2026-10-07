var heartPhotos = [
  "photos/1.jpg","photos/2.jpg","photos/3.jpg","photos/4.jpg",
  "photos/5.jpg","photos/6.jpg","photos/7.jpg","photos/8.jpg",
  "photos/9.jpg","photos/10.jpg","photos/11.jpg","photos/12.jpg",
  "photos/13.jpg","photos/14.jpg"
];

var slides = document.querySelectorAll('.slide');
var current = 0;

function next() {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (typeof startFireworks === 'function') {
    if (slides[current].classList.contains('slide-8')) startFireworks();
    else stopFireworks();
  }
}
function openEnvelope() {
  document.getElementById('envelope').classList.add('opened');
  document.getElementById('heartReveal').classList.add('opened');
}

var heartContainer = document.getElementById('heartContainer');
var TOTAL_HEART = 14;

function buildHeart() {
  var old = heartContainer.querySelectorAll('.heart-photo');
  for (var k = 0; k < old.length; k++) old[k].remove();

  var W = heartContainer.offsetWidth;
  var H = heartContainer.offsetHeight;
  if (W === 0 || H === 0) { setTimeout(buildHeart, 100); return; }

  var cx = W / 2;
  var cy = H / 2;
  var scale = Math.min(W, H) / 42;

  for (var i = 0; i < TOTAL_HEART; i++) {
    var t = (i / TOTAL_HEART) * Math.PI * 2 - Math.PI / 2;
    var x0 = 16 * Math.pow(Math.sin(t), 3);
    var y0 = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    var px = cx + x0 * scale;
    var py = cy - y0 * scale;

    var img = document.createElement('img');
    img.className = 'heart-photo';
    img.src = heartPhotos[i % heartPhotos.length];
    img.style.left = px + 'px';
    img.style.top = py + 'px';
    img.style.animationDelay = (i * 0.08) + 's';
    heartContainer.appendChild(img);
  }
}

window.addEventListener('load', function() { setTimeout(buildHeart, 200); });
window.addEventListener('resize', function() {
  clearTimeout(window._heartT);
  window._heartT = setTimeout(buildHeart, 300);
});

var emojis = ['❤️','🌙','✨','💜','🖤','⭐','🌸','💖'];
setInterval(function() {
  var p = document.createElement('div');
  p.className = 'particle';
  p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.left = Math.random() * 95 + 'vw';
  p.style.animationDuration = (6 + Math.random() * 6) + 's';
  p.style.fontSize = (14 + Math.random() * 16) + 'px';
  document.body.appendChild(p);
  setTimeout(function() { p.remove(); }, 12000);
}, 400);
// me ara — gallery + lightbox (fully local, no dependencies)
var FULL_DIR = "images/";
var THUMB_DIR = "images/thumbs/";

// Display order. Full-size file names live in images/; a ~1000px JPEG of each
// lives in images/thumbs/ (same name, .jpg) and is what the grid loads.
var PAINTINGS = [
  "AY6A6027.jpg",
  "AY6A6030.jpg",
  "AY6A5926.jpg",
  "AY6A5996.jpg",
  "AY6A6006.jpg",
  "AY6A5987.jpg",
  "AY6A5956.jpg",
  "92A40DBA-D724-4AFB-83D6-9742410DBD90_1_201_a.jpeg",
  "AY6A5964.jpg",
  "AY6A5970.jpg",
  "AY6A5977.jpg",
  "AY6A5985.jpg",
  "AY6A5944.jpg",
  "AY6A5924.jpg",
  "AY6A6023.jpg",
  "AY6A5906.jpg",
  "tempImagehMmYe8.jpg",
  "IMG_2902.jpg",
  "AY6A5889.jpg",
  "AY6A5897.jpg",
  "9987319F-0FC6-4D04-9004-C9711828DD39.jpg",
  "AY6A5892.jpg",
  "tempImageuVORHb.png",
  "tempImagejz9Apl.png",
  "AY6A5899.jpg",
  "AY6A5914.jpg",
  "AY6A5931.jpg",
  "AY6A5934.jpg",
  "AY6A6020.jpg",
  "tempImage54hGFI.png",
  "tempImageo8WfGd.png",
  "D6EA1150-4754-49E8-B6BF-545CD3496CB2.jpg",
  "2F324259-2D5A-4BD2-A96B-479B63E309DB.jpeg",
  "tempImageqUis1p.png"
];

var gallery = document.getElementById("gallery");
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var counter = document.getElementById("counter");
var active = null;

function thumbSrc(name) { return THUMB_DIR + name.replace(/\.(jpe?g|png)$/i, ".jpg"); }
function fullSrc(name) { return FULL_DIR + name; }
function label(name) { return "Painting — " + name.replace(/\.[a-z]+$/i, ""); }

PAINTINGS.forEach(function (name, i) {
  var btn = document.createElement("button");
  btn.type = "button";
  var img = document.createElement("img");
  img.src = thumbSrc(name);
  img.alt = label(name);
  img.loading = "lazy";
  btn.appendChild(img);
  btn.addEventListener("click", function () { open(i); });
  gallery.appendChild(btn);
});

function open(i) {
  active = i;
  lightboxImg.src = fullSrc(PAINTINGS[i]);
  lightboxImg.alt = label(PAINTINGS[i]);
  counter.textContent = (i + 1) + " / " + PAINTINGS.length;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function close() {
  active = null;
  lightbox.hidden = true;
  lightboxImg.removeAttribute("src");
  document.body.style.overflow = "";
}

function step(d) {
  if (active === null) return;
  open((active + d + PAINTINGS.length) % PAINTINGS.length);
}

document.getElementById("closeBtn").addEventListener("click", close);
document.getElementById("prevBtn").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
document.getElementById("nextBtn").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
lightbox.addEventListener("click", close);
document.getElementById("lightboxInner").addEventListener("click", function (e) { e.stopPropagation(); });
window.addEventListener("keydown", function (e) {
  if (active === null) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

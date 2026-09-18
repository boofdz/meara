// me ara — gallery + lightbox (fully local, no dependencies)
var FULL_DIR = "images/";
var THUMB_DIR = "images/thumbs/";

var MIN_COL = 300;  // min column width before dropping a column
var MAX_COL = 3;    // never more than this many columns
var GAP = 18;       // must match --gap in styles.css

// Display order: [full-size file name, thumb width, thumb height].
// The dimensions let the browser reserve the right space before the image
// loads, so the columns balance correctly on first paint instead of
// reflowing as the lazy images arrive.
var PAINTINGS = [
  ["AY6A6027.jpg", 1000, 745],
  ["AY6A6030.jpg", 1000, 781],
  ["AY6A5926.jpg", 1000, 2406],
  ["AY6A5996.jpg", 1000, 2365],
  ["AY6A6006.jpg", 1000, 680],
  ["AY6A5987.jpg", 1000, 1395],
  ["AY6A5956.jpg", 1000, 1329],
  ["92A40DBA-D724-4AFB-83D6-9742410DBD90_1_201_a.jpeg", 1000, 1483],
  ["AY6A5964.jpg", 1000, 989],
  ["AY6A5970.jpg", 1000, 1100],
  ["AY6A5977.jpg", 1000, 1225],
  ["AY6A5985.jpg", 1000, 975],
  ["AY6A5944.jpg", 1000, 803],
  ["AY6A5924.jpg", 1000, 802],
  ["AY6A6023.jpg", 1000, 1333],
  ["AY6A5906.jpg", 1000, 496],
  ["tempImagehMmYe8.jpg", 1000, 787],
  ["IMG_2902.jpg", 1000, 802],
  ["AY6A5889.jpg", 1000, 825],
  ["AY6A5897.jpg", 1000, 786],
  ["9987319F-0FC6-4D04-9004-C9711828DD39.jpg", 1000, 1605],
  ["AY6A5892.jpg", 1000, 1220],
  ["tempImageuVORHb.png", 1000, 1253],
  ["tempImagejz9Apl.png", 1000, 1386],
  ["AY6A5899.jpg", 1000, 1269],
  ["AY6A5914.jpg", 1000, 995],
  ["AY6A5931.jpg", 1000, 1486],
  ["AY6A5934.jpg", 1000, 1282],
  ["AY6A6020.jpg", 1000, 982],
  ["tempImage54hGFI.png", 1000, 667],
  ["tempImageo8WfGd.png", 1000, 663],
  ["D6EA1150-4754-49E8-B6BF-545CD3496CB2.jpg", 588, 744],
  ["2F324259-2D5A-4BD2-A96B-479B63E309DB.jpeg", 1000, 1778],
  ["tempImageqUis1p.png", 1000, 1282]
];

var gallery = document.getElementById("gallery");
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var counter = document.getElementById("counter");
var active = null;
var builtCols = 0;

function thumbSrc(name) { return THUMB_DIR + name.replace(/\.(jpe?g|png)$/i, ".jpg"); }
function fullSrc(name) { return FULL_DIR + name; }
function label(name) { return "Painting — " + name.replace(/\.[a-z]+$/i, ""); }

function columnCount() {
  var w = gallery.clientWidth;
  if (!w) return MAX_COL;
  var n = Math.floor((w + GAP) / (MIN_COL + GAP));
  return Math.max(1, Math.min(MAX_COL, n));
}

// Masonry by hand: N equal flex columns, each painting appended to whichever
// column is currently shortest. Because the columns are siblings in a flex
// row anchored to flex-start, every column's first painting sits on the same
// top edge — no dependence on CSS column balancing or image load timing.
function build(cols) {
  gallery.textContent = "";
  builtCols = cols;

  // width one column will actually render at, so heights below are real pixels
  var colWidth = (gallery.clientWidth - GAP * (cols - 1)) / cols;

  var colEls = [];
  var colHeights = [];
  for (var c = 0; c < cols; c++) {
    var el = document.createElement("div");
    el.className = "gallery-col";
    gallery.appendChild(el);
    colEls.push(el);
    colHeights.push(0);
  }

  PAINTINGS.forEach(function (p, i) {
    var name = p[0], w = p[1], h = p[2];

    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", label(name));

    var img = document.createElement("img");
    img.src = thumbSrc(name);
    img.alt = label(name);
    img.loading = "lazy";
    img.decoding = "async";
    img.width = w;
    img.height = h;

    btn.appendChild(img);
    btn.addEventListener("click", function () { open(i); });

    // shortest column wins; strict < sends ties to the leftmost column,
    // so the very first row fills left-to-right in display order
    var target = 0;
    for (var c = 1; c < cols; c++) {
      if (colHeights[c] < colHeights[target]) target = c;
    }
    colEls[target].appendChild(btn);
    colHeights[target] += colWidth * (h / w) + GAP;
  });
}

build(columnCount());

var resizeTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    var n = columnCount();
    if (n !== builtCols) build(n);
  }, 120);
});

function open(i) {
  active = i;
  lightboxImg.src = fullSrc(PAINTINGS[i][0]);
  lightboxImg.alt = label(PAINTINGS[i][0]);
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

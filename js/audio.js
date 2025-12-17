let audioCtx;
const buffers = {};

async function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await load('drum', 'sounds/drum.wav');
  await load('gong', 'sounds/gong.wav');
  await load('cymbal', 'sounds/cymbal.wav');
  await load('small', 'sounds/small-gong.wav');
  await load('wood', 'sounds/woodblock.wav');
}

async function load(name, url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  buffers[name] = await audioCtx.decodeAudioData(buf);
}

function play(name) {
  if (!buffers[name]) return;
  const src = audioCtx.createBufferSource();
  src.buffer = buffers[name];
  src.connect(audioCtx.destination);
  src.start();
}

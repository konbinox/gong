let audioCtx;
const buffers = {};
const soundFiles = {
  drum: 'sounds/drum.mp3',
  gong: 'sounds/gong.mp3',
  cymbal: 'sounds/cymbal.mp3',
  small: 'sounds/small-gong.mp3',
  wood: 'sounds/woodblock.mp3'
};

// 初始化音频上下文并加载 MP3
async function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const promises = Object.keys(soundFiles).map(name => load(name, soundFiles[name]));
  await Promise.all(promises);
  console.log('所有音频加载完成');
}

// 加载单个音频文件
async function load(name, url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  buffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

// 播放音频
function play(name) {
  if (!buffers[name]) return;
  const src = audioCtx.createBufferSource();
  src.buffer = buffers[name];
  src.connect(audioCtx.destination);
  src.start();
}

// 一次击打
function hit(current) {
  play(current);
  // 半句增强震动效果
  if (current === 'small') {
    navigator.vibrate?.([50, 30, 100]);
    const pad = document.getElementById('pad');
    pad.classList.add('flash');
    setTimeout(() => pad.classList.remove('flash'), 200);
  } else {
    navigator.vibrate?.(40);
  }
}

// 绑定事件
let ready = false;
document.body.addEventListener('touchstart', async () => {
  if (!ready) {
    await initAudio();
    ready = true;
  }
  hit(document.getElementById('instrument').value);
}, { passive: true });

document.body.addEventListener('click', () => {
  if (!ready) return;
  hit(document.getElementById('instrument').value);
});

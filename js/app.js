let current = 'drum';
let ready = false;

const pad = document.getElementById('pad');
const sel = document.getElementById('instrument');

sel.onchange = e => current = e.target.value;

function hit() {
  play(current);
  navigator.vibrate?.(current === 'small' ? [50,30,100] : 40);

  if (current === 'small') {
    pad.classList.add('flash');
    setTimeout(() => pad.classList.remove('flash'), 200);
  }
}

document.body.addEventListener('touchstart', async () => {
  if (!ready) {
    await initAudio();
    ready = true;
  }
  hit();
}, { passive: true });

document.body.addEventListener('click', () => {
  if (!ready) return;
  hit();
});

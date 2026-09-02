document.addEventListener('DOMContentLoaded', () => {
  // Particles background
  const container = document.getElementById('particles');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(p);
  }

  // Card navigation
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const game = card.dataset.game;
      if (game) {
        window.location.href = `${game}/index.html`;
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Fade out intro screen
  window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    setTimeout(() => {
      intro.classList.add('fade-out');
      setTimeout(() => intro.remove(), 1000);
    }, 3000);
  });

  const slider = document.querySelector('.slider');
  const items = document.querySelectorAll('.slider .item');
  const cursor = document.querySelector('.custom-cursor');

  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;
  let currentIndex = 0;
  let lastRotation = 0;

  const updateRotation = (angle) => {
    slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${angle}deg)`;
  };

  const updateActiveItem = () => {
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });
  };

  const snapToNearest = () => {
    const anglePerItem = 360 / items.length;
    const nearestAngle = Math.round(currentRotation / anglePerItem) * anglePerItem;
    currentRotation = nearestAngle;
    const normalizedRotation = ((360 - currentRotation % 360) + 360) % 360;
    currentIndex = Math.round(normalizedRotation / anglePerItem) % items.length;
    updateRotation(currentRotation);
    updateActiveItem();
  };

  const startDrag = (x) => {
    isDragging = true;
    startX = x;
  };

  const drag = (x) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    const rotationDelta = deltaX * 0.3;
    lastRotation = currentRotation + rotationDelta;
    updateRotation(lastRotation);
  };

  const endDrag = (x) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    currentRotation += deltaX * 0.3;
    snapToNearest();
    isDragging = false;
  };

  // Mouse and touch event listeners
  slider.addEventListener('mousedown', (e) => startDrag(e.clientX));
  window.addEventListener('mousemove', (e) => drag(e.clientX));
  window.addEventListener('mouseup', (e) => endDrag(e.clientX));
  slider.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX));
  window.addEventListener('touchmove', (e) => drag(e.touches[0].clientX));
  window.addEventListener('touchend', (e) => endDrag(e.changedTouches[0].clientX));

  // Extra safety: stop dragging if mouse leaves window
  window.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      snapToNearest();
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && isDragging) {
      isDragging = false;
      snapToNearest();
    }
  });

  // Wheel scroll
  slider.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    currentRotation += delta * 0.6;
    snapToNearest();
  }, { passive: false });

  // Custom cursor tracking
  const OFFSET_X = -10;
  const OFFSET_Y = -12;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - OFFSET_X}px`;
    cursor.style.top = `${e.clientY - OFFSET_Y}px`;
  });

  // Pop + shockwave effect
  document.addEventListener('mousedown', (e) => {
    cursor.classList.add('pop');

    const wave = document.createElement('div');
    wave.classList.add('click-wave');
    wave.style.left = `${e.clientX + OFFSET_X}px`;
    wave.style.top = `${e.clientY + OFFSET_Y}px`;
    document.body.appendChild(wave);

    wave.addEventListener('animationend', () => wave.remove());
  });

  cursor.addEventListener('animationend', () => {
    cursor.classList.remove('pop');
  });

  // Initial active item
  updateActiveItem();
});

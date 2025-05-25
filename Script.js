document.addEventListener('DOMContentLoaded', () => {
  // Intro fade out
  window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    setTimeout(() => {
      intro.classList.add('fade-out');
      setTimeout(() => intro.remove(), 1000);
    }, 3000);
  });

  const slider = document.querySelector('.slider');
  const items = document.querySelectorAll('.slider .item');
  const links = slider.querySelectorAll('a');
  const cursor = document.querySelector('.custom-cursor');
  const background = document.querySelector('body::before');

  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let currentRotation = 0;
  let currentIndex = 0;
  let lastRotation = 0;

  const updateRotation = (angle) => {
    // Normalize rotation
    currentRotation = ((angle % 360) + 360) % 360;

    slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${currentRotation}deg)`;

    const scrollSpeed = 2; // You can tweak this
  const scrollAmount = currentRotation * scrollSpeed;
  bgLayer.style.backgroundPosition = `-${scrollAmount}px center`;
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

    // Wrap angle to 0–360
    const normalizedRotation = ((360 - currentRotation % 360) + 360) % 360;
    currentIndex = Math.round(normalizedRotation / anglePerItem) % items.length;

    updateRotation(currentRotation);
    updateActiveItem();
  };

  const startDrag = (x) => {
    isDragging = true;
    hasMoved = false;
    startX = x;
  };

  const drag = (x) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    if (Math.abs(deltaX) > 5) hasMoved = true;
    lastRotation = currentRotation + deltaX * 0.3;
    updateRotation(lastRotation); // live rotation while dragging
  };

  const endDrag = (x) => {
    if (!isDragging) return;
    const deltaX = x - startX;
    currentRotation += deltaX * 0.3;
    snapToNearest();
    isDragging = false;
  };

  // Mouse & touch events
  slider.addEventListener('mousedown', (e) => startDrag(e.clientX));
  window.addEventListener('mousemove', (e) => drag(e.clientX));
  window.addEventListener('mouseup', (e) => endDrag(e.clientX));
  slider.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX));
  window.addEventListener('touchmove', (e) => drag(e.touches[0].clientX));
  window.addEventListener('touchend', (e) => endDrag(e.changedTouches[0].clientX));

  // Fallback for edge cases
  window.addEventListener('mouseleave', () => isDragging && (isDragging = false, snapToNearest()));
  document.addEventListener('mouseout', (e) => !e.relatedTarget && isDragging && (isDragging = false, snapToNearest()));

  // Prevent accidental link clicks when dragging
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (hasMoved) e.preventDefault();
    });
    link.draggable = false; // Disable image dragging
  });

  // Scroll wheel rotation
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

  // Pop effect & shockwave
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

  // Initialize first state
  updateActiveItem();
});

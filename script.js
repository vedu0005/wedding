/**
 * SANTHOSH & DIVYA - WEDDING INVITATION INTERACTIVE SCRIPT
 * Features: Opening transition, audio playback, scroll reveal, lightbox, calendar export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const openingScreen = document.getElementById('openingScreen');
  const enterInviteBtn = document.getElementById('enterInviteBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioMuteIcon = document.getElementById('audioMuteIcon');
  const weddingMusic = document.getElementById('weddingMusic');
  
  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxIndex = document.getElementById('lightboxIndex');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentPhotoIndex = 0;
  const galleryData = [
    {
      src: 'assets/images/couple-temple-color.jpg',
      caption: 'Timeless Heritage Moments | Santhosh & Divya'
    },
    {
      src: 'assets/images/couple-outdoor-close.jpg',
      caption: 'Whispers of Eternity | Santhosh & Divya'
    },
    {
      src: 'assets/images/couple-temple-bw.jpg',
      caption: 'A Classic Love Story | Santhosh & Divya'
    },
    {
      src: 'assets/images/couple-outdoor-full.jpg',
      caption: 'Grace and Togetherness | Santhosh & Divya'
    }
  ];

  // 1. OPENING SCREEN LOGIC
  function revealInvitation() {
    if (!openingScreen.classList.contains('revealed')) {
      openingScreen.classList.add('revealed');
      
      // Attempt auto-play music upon user gesture
      playMusic();

      // Trigger animation on hero banner
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (enterInviteBtn) {
    enterInviteBtn.addEventListener('click', revealInvitation);
  }

  // Also support opening on wheel/touch on the opening screen
  let touchStartY = 0;
  openingScreen.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  openingScreen.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 50) {
      revealInvitation();
    }
  }, { passive: true });

  window.addEventListener('wheel', (e) => {
    if (!openingScreen.classList.contains('revealed') && e.deltaY > 20) {
      revealInvitation();
    }
  }, { passive: true });

  // 2. BACKGROUND MUSIC CONTROLLER
  let isPlaying = false;

  function playMusic() {
    if (!weddingMusic) return;
    weddingMusic.play().then(() => {
      isPlaying = true;
      audioToggleBtn.classList.add('playing');
      audioToggleBtn.classList.remove('muted');
    }).catch((err) => {
      console.log('Audio autoplay prevented by browser policy:', err);
      isPlaying = false;
      audioToggleBtn.classList.remove('playing');
      audioToggleBtn.classList.add('muted');
    });
  }

  function pauseMusic() {
    if (!weddingMusic) return;
    weddingMusic.pause();
    isPlaying = false;
    audioToggleBtn.classList.remove('playing');
    audioToggleBtn.classList.add('muted');
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // 3. SCROLL REVEAL (Intersection Observer)
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once visible, keep it revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  // 4. LIGHTBOX MODAL VIEWER
  function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentPhotoIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
    lightboxIndex.textContent = `${currentPhotoIndex + 1} / ${galleryData.length}`;
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10) || 0;
      openLightbox(idx);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevPhoto);

  // Close on backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop') || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Touch Swipe for Mobile Lightbox
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    lbTouchEndX = e.changedTouches[0].screenX;
    if (lbTouchEndX < lbTouchStartX - 45) {
      showNextPhoto(); // Swiped left -> next
    } else if (lbTouchEndX > lbTouchStartX + 45) {
      showPrevPhoto(); // Swiped right -> prev
    }
  }, { passive: true });

});

// 5. CALENDAR EXPORT (.ics File Generator)
function addToCalendar(eventType) {
  let title = '';
  let description = '';
  let location = 'Rajatha Bhavana (BWSSB), 8th–19th Cross, Malleshwaram, Bengaluru – 560012';
  let startStr = '';
  let endStr = '';

  if (eventType === 'reception') {
    title = 'Wedding Reception - Santhosh & Divya';
    description = 'Join us to celebrate the wedding reception of Santhosh & Divya. Venue: Rajatha Bhavana (BWSSB), Malleshwaram, Bengaluru.';
    // 14 November 2026, 6:30 PM (18:30) IST to 10:30 PM (22:30) IST
    // UTC is IST - 5:30 -> 18:30 - 5:30 = 13:00 UTC
    startStr = '20261114T130000Z';
    endStr = '20261114T170000Z';
  } else {
    title = 'Muhurtha Wedding Ceremony - Santhosh & Divya';
    description = 'Auspicious Muhurtha ceremony of Santhosh & Divya. Venue: Rajatha Bhavana (BWSSB), Malleshwaram, Bengaluru.';
    // 15 November 2026, 6:00 AM to 7:30 AM IST
    // UTC is IST - 5:30 -> 06:00 - 5:30 = 00:30 UTC
    startStr = '20261115T003000Z';
    endStr = '20261115T020000Z';
  }

  // Create .ics iCalendar file format
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Santhosh & Divya//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${eventType}-santhosh-divya.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

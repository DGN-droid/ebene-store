const playlist = [
  'assets/videos/veste.mp4',
  'assets/videos/robe3D.mp4',
  'assets/videos/sac.mp4',
  'assets/videos/fais_pareil_pour_cette_robe_st.mp4',
  'assets/videos/pareil_ici (1).mp4',
  'assets/videos/pareil_ici.mp4'
];

export function initCatalogBackgroundVideo() {
  const video = document.querySelector('.catalog-bg-video');
  if (!video) return;

  let currentIndex = 0;

  const playCurrentVideo = () => {
    try {
      video.src = playlist[currentIndex];
      video.load();
      video.play().catch(() => advanceVideo());
    } catch (error) {
      console.warn('Catalog background video failed', playlist[currentIndex], error);
      advanceVideo();
    }
  };

  const advanceVideo = () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    playCurrentVideo();
  };

  video.addEventListener('ended', advanceVideo);
  video.addEventListener('error', advanceVideo);
  playCurrentVideo();
}

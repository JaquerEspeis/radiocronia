---
---

const loadEvent = () => {
  try {
    if (Turbolinks) return 'turbolinks:load';
  } catch {
    return 'DOMContentLoaded'
  }
}

// Inicia y gestiona el strea
const streaming = (element) => {
  // Cambiar el src para que incluya un timestamp, esto engaña a Firefox
  // a recargar el video cuando se corta en lugar de pensar que terminó
  // la descarga y empezar a reproducir desde el principio.
  element.querySelectorAll('source').forEach(source => {
    // Obtener la URL completa hasta el ?
    source.src = source.src.split('?')[0]+'?'+Date.now().toString();
  });

  // Empezar la reproducción
  element.load();
  element.play();
};

document.addEventListener(loadEvent(), () => {
  const transmission = document.querySelector('#transmission');

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "{{ radio.description | escape }}",
      artist: "{{ radio.title | escape }}",
      artwork: [
        {
          src: '{{ radio.logo.path | thumbnail: 192 }}',
          sizes: '192x192',
          type: 'image/{{ radio.logo.path | split: '.' | last }}'
        },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => transmission.play());
    navigator.mediaSession.setActionHandler('pause', () => transmission.pause());
  }

  // Volver a reproducir cuando se corte
  // TODO: Agregar los track
  transmission.addEventListener('ended', event => streaming(transmission));

});

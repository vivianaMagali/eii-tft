const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.[0-9]{1,3}){3}$/),
);

export function register(config) {
  if ("serviceWorker" in navigator) {
    // Asegúrate de que la ruta del Service Worker es correcta
    const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;

    if (isLocalhost) {
      // En modo localhost, verifica si el Service Worker es válido
      checkValidServiceWorker(swUrl, config);
    } else {
      // En producción, registra el Service Worker normalmente
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Nuevo contenido está disponible; solicite actualizar la página
              console.log("New content is available; please refresh.");
            } else {
              // El contenido está en caché para uso offline
              console.log("Content is cached for offline use.");
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl)
    .then((response) => {
      const contentType = response.headers.get("Content-Type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.error(
        "No internet connection found. App is running in offline mode.",
      );
    });
}

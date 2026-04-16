/**
 * Sustituye 'Unknown' por tu Gmail (solo la parte antes de @ o el correo completo).
 * Ejemplo: 'tuprojecto@gmail.com'
 */
const EMAIL_DESTINO = 'servidortresenuno@gmail.com';

(function () {
  function esCorreoValidoParaEnvio(val) {
    return typeof val === 'string' && val !== 'Unknown' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function aplicarEnlaceMail() {
    const enlace = document.querySelector('[data-contact-mail-link]');
    if (!enlace) return;
    if (esCorreoValidoParaEnvio(EMAIL_DESTINO)) {
      enlace.href = 'mailto:' + encodeURIComponent(EMAIL_DESTINO);
      enlace.removeAttribute('aria-disabled');
    } else {
      enlace.href = '#';
      enlace.setAttribute('aria-disabled', 'true');
    }
  }

  function validarEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
  }

  document.addEventListener('DOMContentLoaded', function () {
    aplicarEnlaceMail();

    const form = document.getElementById('contacto-form');
    if (!form) return;

    const feedback = document.getElementById('contacto-feedback');
    const avisoConfig = document.getElementById('contacto-aviso-config');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'contacto-feedback';
      }

      const nombre = document.getElementById('contacto-nombre');
      const email = document.getElementById('contacto-email');
      const mensaje = document.getElementById('contacto-mensaje');

      const n = nombre && nombre.value.trim();
      const em = email && email.value.trim();
      const m = mensaje && mensaje.value.trim();

      if (!n || !em || !m) {
        if (feedback) {
          feedback.textContent = 'Completa todos los campos.';
          feedback.classList.add('is-err');
        }
        return;
      }

      if (!validarEmail(em)) {
        if (feedback) {
          feedback.textContent = 'Introduce un correo electrónico válido.';
          feedback.classList.add('is-err');
        }
        return;
      }

      if (!esCorreoValidoParaEnvio(EMAIL_DESTINO)) {
        if (avisoConfig) avisoConfig.hidden = false;
        if (feedback) {
          feedback.textContent =
            'Configura EMAIL_DESTINO en assets/js/contacto.js con un Gmail válido para abrir el mensaje en tu correo.';
          feedback.classList.add('is-err');
        }
        return;
      }

      if (avisoConfig) avisoConfig.hidden = true;

      const cuerpo =
        'Nombre: ' + n + '\n' +
        'Correo del remitente: ' + em + '\n\n' +
        'Mensaje:\n' + m;

      const asunto = encodeURIComponent('[Servenium] Mensaje desde la web');
      const body = encodeURIComponent(cuerpo);
      window.location.href =
        'mailto:' + encodeURIComponent(EMAIL_DESTINO) + '?subject=' + asunto + '&body=' + body;

      if (feedback) {
        feedback.textContent = 'Se abrirá tu aplicación de correo. Si no ocurre nada, revisa la configuración del navegador.';
        feedback.classList.add('is-ok');
      }
    });
  });
})();

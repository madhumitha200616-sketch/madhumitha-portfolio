/* Contact form: sends the message through EmailJS (REST API) straight from the page.
   No mail app is opened and no EmailJS library or private key is needed in the browser. */
(function () {
   var form = document.getElementById('contact-form');
   if (!form) return;

   var status = document.getElementById('contact-status');
   var button = form.querySelector('.contact__send');
   var nameEl = form.elements['name'];
   var emailEl = form.elements['email'];
   var msgEl = form.elements['message'];
   var trap = form.elements['website']; // honeypot, hidden from people

   var ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
   var TIMEOUT_MS = 15000;
   var COOLDOWN_MS = 30000;            // minimum gap between two sends from the same browser
   var LAST_KEY = 'contactLastSent';
   var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
   var idleHTML = button.innerHTML;
   var sending = false;

   form.reset();

   function setStatus(text, type) {
      status.textContent = text;
      status.classList.remove('contact__status--success', 'contact__status--error');
      if (type) status.classList.add('contact__status--' + type);
   }

   function setInvalid(el, bad) {
      if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
   }

   function setLoading(on) {
      sending = on;
      button.disabled = on;
      button.setAttribute('aria-busy', on ? 'true' : 'false');
      button.classList.toggle('is-loading', on);
      button.innerHTML = on ? 'Sending&hellip; <i class="ri-loader-4-line contact__spinner"></i>' : idleHTML;
   }

   function lastSent() {
      try { return Number(localStorage.getItem(LAST_KEY)) || 0; } catch (e) { return 0; }
   }
   function markSent() {
      try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch (e) { /* storage unavailable */ }
   }

   function validate() {
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = msgEl.value.trim();
      var error = '', focus = null;

      setInvalid(nameEl, false); setInvalid(emailEl, false); setInvalid(msgEl, false);

      if (name.length < 2) { error = 'Please enter your name (at least 2 characters).'; focus = nameEl; }
      else if (!email) { error = 'Please enter your email address.'; focus = emailEl; }
      else if (!EMAIL_RE.test(email) || !emailEl.checkValidity()) { error = 'Please enter a valid email address, like name@example.com.'; focus = emailEl; }
      else if (message.length < 10) { error = 'Please write a message of at least 10 characters.'; focus = msgEl; }

      if (error) { setInvalid(focus, true); focus.focus(); return { error: error }; }
      return { name: name, email: email, message: message };
   }

   function configReady(cfg) {
      return cfg && ['serviceId', 'templateId', 'publicKey'].every(function (k) {
         return typeof cfg[k] === 'string' && cfg[k] && cfg[k].indexOf('YOUR_') !== 0;
      });
   }

   function failMessage(httpStatus) {
      if (httpStatus === 429) return 'Too many messages right now. Please wait a minute and try again.';
      return 'Sorry, your message could not be sent. Please try again, or email me at madhumitha200616@gmail.com.';
   }

   form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;                                    // duplicate click / Enter key

      if (trap && trap.value) {                               // bot filled the hidden field: pretend success, send nothing
         form.reset(); setStatus('Thank you! Your message has been sent.', 'success'); return;
      }

      var data = validate();
      if (data.error) { setStatus(data.error, 'error'); return; }

      var wait = COOLDOWN_MS - (Date.now() - lastSent());
      if (wait > 0) {
         setStatus('Your message was just sent. Please wait ' + Math.ceil(wait / 1000) + ' seconds before sending another.', 'error');
         return;
      }

      var cfg = window.EMAILJS_CONFIG;
      if (!configReady(cfg)) {
         console.error('EmailJS is not configured. Fill in assets/js/emailjs-config.js (see README).');
         setStatus('The contact form is not set up yet. Please email me at madhumitha200616@gmail.com.', 'error');
         return;
      }

      setStatus('', null);
      setLoading(true);

      var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;

      fetch(ENDPOINT, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         signal: ctrl ? ctrl.signal : undefined,
         body: JSON.stringify({
            service_id: cfg.serviceId,
            template_id: cfg.templateId,
            user_id: cfg.publicKey,
            template_params: {
               // several common variable names, so the template works whichever it uses
               name: data.name,
               from_name: data.name,
               email: data.email,
               from_email: data.email,
               reply_to: data.email,
               message: data.message,
               title: 'Portfolio contact form message from ' + data.name,
               time: new Date().toLocaleString(),
               sent_at: new Date().toLocaleString()
            }
         })
      }).then(function (res) {
         if (!res.ok) {
            return res.text().then(function (t) { var err = new Error(t || res.statusText); err.httpStatus = res.status; throw err; });
         }
         markSent();
         form.reset();
         setInvalid(nameEl, false); setInvalid(emailEl, false); setInvalid(msgEl, false);
         setStatus('Thank you! Your message has been sent. I will get back to you soon.', 'success');
      }).catch(function (err) {
         console.error('EmailJS send failed:', err && err.message ? err.message : err);
         setStatus(err && err.name === 'AbortError' ? 'The request timed out. Please check your connection and try again.' : failMessage(err && err.httpStatus), 'error');
      }).then(function () {
         if (timer) clearTimeout(timer);
         setLoading(false);
      });
   });

   // clear the red state as soon as the visitor edits a field
   [nameEl, emailEl, msgEl].forEach(function (el) {
      el.addEventListener('input', function () { setInvalid(el, false); });
   });
})();

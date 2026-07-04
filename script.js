// ============ Mobile nav ============
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ============ Scroll reveal ============
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // ============ Animated score rings ============
  const rings = document.querySelectorAll('.score-ring-fill');
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = parseFloat(el.dataset.value || '0');
        const r = parseFloat(el.getAttribute('r'));
        const circumference = 2 * Math.PI * r;
        el.style.strokeDasharray = `${circumference}`;
        el.style.strokeDashoffset = `${circumference}`;
        requestAnimationFrame(() => {
          setTimeout(() => {
            const offset = circumference - (val / 100) * circumference;
            el.style.strokeDashoffset = `${offset}`;
          }, 100);
        });
        ringObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  rings.forEach(el => ringObserver.observe(el));

  // ============ Animated bar fills ============
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = el.dataset.value || '0';
        setTimeout(() => { el.style.width = val + '%'; }, 80);
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(el => barObserver.observe(el));

  // ============ FAQ accordion ============
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ============ Lead form (submits to FormSubmit, arrives by email) ============
  const leadForm = document.getElementById('audit-form');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const endpoint = leadForm.dataset.formsubmit;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;

      const showError = () => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        let err = leadForm.querySelector('.form-error');
        if (!err) {
          err = document.createElement('p');
          err.className = 'form-error';
          err.style.cssText = 'color:#F26D6D; font-size:13px; text-align:center; margin-top:14px;';
          leadForm.appendChild(err);
        }
        err.textContent = "Something went wrong sending your request — please email siya334433@gmail.com directly, or try again.";
      };

      try {
        const formData = new FormData(leadForm);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (!res.ok) throw new Error('Request failed');

        leadForm.innerHTML = `
          <div style="text-align:center; padding: 30px 10px;">
            <div style="width:52px;height:52px;border-radius:50%;background:rgba(52,211,153,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style="font-family:var(--font-display); margin-bottom:10px;">Request received</h3>
            <p style="color:var(--text-dim); font-size:14.5px;">We'll review your business and send your free AI Audit within 24–48 hours. Keep an eye on your inbox.</p>
          </div>`;
      } catch (err) {
        showError();
      }
    });
  }
});

'use strict';

(function initSite() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scrolling for navigation links
  const headerEl = document.querySelector('header');
  const getHeaderOffset = () => (headerEl ? headerEl.offsetHeight : 0);

  document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return; // Allow external links
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = getHeaderOffset();
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        document.querySelectorAll('nav ul li a').forEach(link => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        });
        this.classList.add('active');
        this.setAttribute('aria-current', 'page');
      }
    });
  });

  // Highlight active navigation link based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    const headerHeight = getHeaderOffset();
    let currentActiveSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 1;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
        currentActiveSection = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href') || '';
      if (currentActiveSection && href.includes(`#${currentActiveSection}`)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  });

  // Function to scroll to contact section with context
  function scrollToContact(context) {
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;

    const headerOffset = getHeaderOffset();
    const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({ top: offsetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    // Show a helpful message
    setTimeout(() => {
      const messageBox = document.createElement('div');
      messageBox.className = 'toast toast--success';

      const subjectByContext = {
        petition: 'Petition Access Request',
        calendar: 'Calendar Access Request',
        materials: 'Advocacy Materials Request'
      };
      const subject = subjectByContext[context] || 'General Inquiry';

      const messageP = document.createElement('p');
      messageP.innerHTML = '<strong>Ready to help!</strong><br>Send us an email with subject: "' + subject + '"';

      const dismissBtn = document.createElement('button');
      dismissBtn.textContent = 'Got it';
      dismissBtn.addEventListener('click', () => {
        if (messageBox.parentNode) messageBox.remove();
      });

      messageBox.appendChild(messageP);
      messageBox.appendChild(dismissBtn);
      document.body.appendChild(messageBox);

      setTimeout(() => { if (messageBox.parentNode) messageBox.remove(); }, 5000);
    }, 500);
  }

  // Attach listeners for scroll-to-contact triggers
  document.querySelectorAll('[data-scroll-to="contact"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToContact(el.getAttribute('data-context') || '');
    });
  });

  // Council email generation via form submit
  const councilForm = document.getElementById('councilForm');
  if (councilForm) {
    councilForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const userNameEl = document.getElementById('userName');
      const userEmailEl = document.getElementById('userEmail');
      const userMessageEl = document.getElementById('userMessage');
      const emailLinkDiv = document.getElementById('generatedEmailLink');
      const emailLink = document.getElementById('emailLink');

      const userName = (userNameEl && userNameEl.value) ? userNameEl.value.trim() : '';
      const userEmail = (userEmailEl && userEmailEl.value) ? userEmailEl.value.trim() : '';
      const userMessage = (userMessageEl && userMessageEl.value) ? userMessageEl.value : '';

      if (!userName || !userEmail) {
        const messageBox = document.createElement('div');
        messageBox.className = 'toast toast--error';
        messageBox.style.left = '50%';
        messageBox.style.top = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        const messageP = document.createElement('p');
        messageP.textContent = 'Please enter your Name and Email to generate the message.';
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.addEventListener('click', () => { if (messageBox.parentNode) messageBox.remove(); });
        messageBox.appendChild(messageP);
        messageBox.appendChild(okBtn);
        document.body.appendChild(messageBox);
        return;
      }

      const councilEmails = [
        'council@berkeleyca.gov',
        'mayor@berkeleyca.gov',
        'rkesarwani@berkeleyca.gov',
        'ttaplin@berkeleyca.gov',
        'bbartlett@berkeleyca.gov',
        'itregub@berkeleyca.gov',
        'sokeefe@berkeleyca.gov',
        'bblackaby@berkeleyca.gov',
        'clunaparra@berkeleyca.gov',
        'mhumbert@berkeleyca.gov'
      ];

      const subject = encodeURIComponent('Support for More Dog Parks in Berkeley');
      let body = 'Dear Berkeley City Council Members,\n\n';
      body += 'I am writing to express my strong support for the creation of additional designated dog parks in Berkeley. As a resident and a member of the community, I believe that more dog parks will bring significant benefits to our city.\n\n';
      body += 'Dog parks promote responsible pet ownership by providing safe, legal spaces for off-leash exercise, which is crucial for canine health and socialization. They also foster community connections among residents and contribute to a safer, more harmonious urban environment by reducing unauthorized off-leash activity in other public spaces.\n\n';
      body += 'I urge you to prioritize the allocation of resources and identify suitable locations for new dog parks across Berkeley.\n\n';
      if (userMessage.trim() !== '') {
        body += '\nMy personal thoughts on this matter are:\n"' + userMessage.trim() + '"\n\n';
      }
      body += 'Thank you for your time and consideration of this important community need.\n\n';
      body += 'Sincerely,\n' + userName + '\n' + userEmail + '\nBerkeley Resident';

      const mailtoLink = 'mailto:' + councilEmails.join(',') + '?subject=' + subject + '&body=' + encodeURIComponent(body);
      if (emailLink) emailLink.href = mailtoLink;
      if (emailLinkDiv) emailLinkDiv.style.display = 'block';
    });
  }

  // Set current year in footer
  (function updateYear(){
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  })();

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
  }

  // Simple privacy-friendly analytics
  (function initBasicAnalytics() {
    const trackEvent = (action, section) => {
      try {
        const events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
        events.push({ action, section, timestamp: Date.now(), page: window.location.pathname });
        if (events.length > 100) events.splice(0, events.length - 100);
        localStorage.setItem('siteEvents', JSON.stringify(events));
        // Optional: send to your own analytics endpoint
        // fetch('/analytics', { method: 'POST', body: JSON.stringify({ action, section }) });
      } catch (_) { /* ignore storage errors */ }
    };

    document.addEventListener('click', (e) => {
      const button = e.target.classList?.contains('button') ? e.target : e.target.closest?.('.button');
      if (button) {
        const section = button.closest('section')?.id || 'unknown';
        const text = (button.textContent || '').trim();
        trackEvent('button_click', `${section}:${text}`);
      }
    });

    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form') || e.target;
      const section = form.closest('section')?.id || 'unknown';
      trackEvent('form_submit', section);
    });

    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const denominator = (document.body.scrollHeight - window.innerHeight) || 1;
      const scrollPercent = Math.round((window.scrollY / denominator) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackEvent('scroll_depth', `${scrollPercent}%`);
      }
    });

    trackEvent('page_load', window.location.pathname);
  })();

  // Error handling for external fonts and resources
  (function checkExternalResources() {
    const testFontAwesome = () => {
      const testIcon = document.createElement('i');
      testIcon.className = 'fas fa-test';
      testIcon.style.position = 'absolute';
      testIcon.style.left = '-9999px';
      document.body.appendChild(testIcon);
      const beforeContent = window.getComputedStyle(testIcon, ':before').content;
      document.body.removeChild(testIcon);
      if (beforeContent === 'none' || beforeContent === '') {
        console.warn('Font Awesome failed to load. Consider using fallback icons.');
        const fallbackStyle = document.createElement('style');
        fallbackStyle.textContent = '.fas::before, .far::before, .fab::before { content: "●"; font-weight: bold; }';
        document.head.appendChild(fallbackStyle);
      }
    };
    setTimeout(testFontAwesome, 2000);
  })();

  // Discourse embeddable comments with better error handling
  (function initDiscourseEmbed() {
    const discourseUrl = 'https://forum.berkeleydogs.com/';
    const discourseContainer = document.getElementById('discourse-comments');
    if (!discourseContainer) return;

    try {
      const timeoutId = setTimeout(() => {
        discourseContainer.innerHTML = [
          '<div style="padding: 20px; text-align: center; color: #666;">',
          '<p>Forum comments temporarily unavailable.</p>',
          '<p><a href="mailto:advocates@berkeleydogs.com?subject=Forum%20Access">Contact us directly</a> to share your thoughts!</p>',
          '</div>'
        ].join('');
      }, 10000);

      window.DiscourseEmbed = {
        discourseUrl: discourseUrl,
        discourseEmbedUrl: window.location.origin + '/#forum'
      };

      const d = document.createElement('script');
      d.type = 'text/javascript';
      d.async = true;
      d.src = discourseUrl + 'javascripts/embed.js';
      d.onload = () => clearTimeout(timeoutId);
      d.onerror = () => {
        clearTimeout(timeoutId);
        discourseContainer.innerHTML = [
          '<div style="padding: 20px; text-align: center; color: #666;">',
          '<p>Unable to load forum comments.</p>',
          '<p><a href="mailto:advocates@berkeleydogs.com?subject=Forum%20Access">Email us your thoughts!</a></p>',
          '</div>'
        ].join('');
      };

      (document.head || document.body).appendChild(d);
    } catch (e) {
      discourseContainer.innerHTML = [
        '<div style="padding: 20px; text-align: center; color: #666;">',
        '<p>Comments unavailable. <a href="mailto:advocates@berkeleydogs.com?subject=Feedback">Email us instead!</a></p>',
        '</div>'
      ].join('');
    }
  })();
})();

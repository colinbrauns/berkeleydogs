
// Fade-in on scroll
const faders = document.querySelectorAll('.section');
const options = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('fade-in');
    observer.unobserve(entry.target);
  });
}, options);

faders.forEach(section => {
  appearOnScroll.observe(section);
});

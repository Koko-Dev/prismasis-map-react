
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('scroll-preloader').style.display = 'none';
    const main = document.getElementById('main');
    if (main) main.style.display = 'block';
  }, 3000);
});

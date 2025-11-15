
ScrollReveal({
    distance: '60px',
    duration: 1200,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
    reset: false
});

ScrollReveal().reveal('.banner h2, .banner h1', {
    origin: 'top',
    interval: 100
});

ScrollReveal().reveal('.banner .video', {
    origin: 'left',
    delay: 300
});
ScrollReveal().reveal('.banner .pera', {
    origin: 'right',
    delay: 300
});

ScrollReveal().reveal('.banner-2 .heading h3, .banner-2 .heading p', {
    origin: 'top',
    delay: 100
});
ScrollReveal().reveal('.banner-2 .images', {
    origin: 'bottom',
    interval: 150
});

ScrollReveal().reveal('.banner-3 .heading', {
    origin: 'top',
    delay: 100
});
ScrollReveal().reveal('.banner-3 .product', {
    origin: 'bottom',
    interval: 100
});

ScrollReveal().reveal('.banner-4 .heading', {
    origin: 'top',
    delay: 100
});
ScrollReveal().reveal('.banner-4 .bloker', {
    origin: 'bottom',
    interval: 50
});

ScrollReveal().reveal('footer .sec-1, footer .copy', {
    origin: 'bottom',
    interval: 100
});

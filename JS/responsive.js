(function () {
    function init() {
        var nav = document.querySelector('.nav-bar');
        var wrap = document.querySelector('.header-top-wrapper');
        if (nav && wrap && !document.querySelector('.nav-toggle')) {
            var btn = document.createElement('button');
            btn.className = 'nav-toggle';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Mở menu');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="bi bi-list"></i>';
            wrap.appendChild(btn);
            btn.addEventListener('click', function () {
                var open = nav.classList.toggle('open');
                btn.setAttribute('aria-expanded', open);
                btn.firstChild.className = open ? 'bi bi-x-lg' : 'bi bi-list';
            });
        }
        var mega = document.querySelector('.has-mega > .nav-link');
        if (mega) {
            mega.addEventListener('click', function (e) {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    e.preventDefault();
                    mega.parentElement.classList.toggle('open');
                }
            });
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
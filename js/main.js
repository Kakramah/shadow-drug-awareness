document.addEventListener('DOMContentLoaded', () => {

    // ─── Hamburger / Mobile Drawer ────────────────────────
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer    = document.getElementById('navDrawer');
    const overlay   = document.getElementById('navOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        drawer.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            drawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
        overlay.addEventListener('click', closeDrawer);
        drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });
    }
    // ─────────────────────────────────────────────────────

    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    const revealTexts = document.querySelectorAll('.reveal-text');
    const progressBar = document.querySelector('.scroll-progress-bar');

    // Dot Navigation — يربط المشاهد الست كخيط تنقّل واحد
    const dots = document.querySelectorAll('.dot-nav .dot');
    const scenes = document.querySelectorAll('.scene[id^="scene-"]');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = document.getElementById(dot.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    if (scenes.length && dots.length) {
        const sceneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dots.forEach(d => d.classList.remove('active'));
                    const activeDot = document.querySelector(`.dot[data-target="${entry.target.id}"]`);
                    if (activeDot) activeDot.classList.add('active');
                }
            });
        }, { threshold: 0.55 });

        scenes.forEach(scene => sceneObserver.observe(scene));
    }

    window.addEventListener('scroll', () => {
        // 1. Parallax Backgrounds
        parallaxBgs.forEach(bg => {
            const speed = 0.4;
            const rect = bg.parentElement.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const centerOffset = window.innerHeight / 2 - (rect.top + rect.height / 2);
                const yPos = centerOffset * speed;
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });

        // 2. Reveal Text Elements
        revealTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                text.classList.add('visible');
            }
        });

        // 3. Full-page scroll progress
        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
    });

    window.dispatchEvent(new Event('scroll'));
});

// Pledge form (Web3Forms)
async function submitPledge() {
    const nameInput = document.getElementById('citizenName');
    const feedback = document.getElementById('formFeedback');
    const btn = document.querySelector('.submit-btn');
    const name = nameInput.value.trim();

    if (name === "") return;

    btn.innerHTML = "جاري التوثيق...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: '2527772c-69c7-4bd9-9319-a5b705e44bac',
                subject: 'الالتزام بحملة الظل — توعية مكافحة المخدرات',
                name: name
            })
        });

        if (response.ok) {
            btn.innerHTML = "تم التوثيق";
            btn.style.background = "var(--accent-gold, #A8842F)";
            btn.style.color = "white";

            feedback.style.color = "#A8842F";
            feedback.innerHTML = `شكراً لوعيك يا ${name}. حضورك سندٌ لمن يحتاجه.`;
            nameInput.value = "";
            nameInput.disabled = true;
        } else {
            btn.innerHTML = "فشل التوثيق";
            btn.disabled = false;
            btn.style.opacity = "1";
            feedback.style.color = "#ff4444";
            feedback.innerHTML = "حدث خطأ أثناء التوثيق. حاول مجدداً.";
        }
    } catch (error) {
        btn.innerHTML = "خطأ في الاتصال";
        btn.disabled = false;
        btn.style.opacity = "1";
        feedback.style.color = "#ff4444";
        feedback.innerHTML = "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
    }
}

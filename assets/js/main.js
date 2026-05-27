/* assets/js/main.js */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initFAQ();
});

/**
 * ヘッダーのスクロールに伴う背景切り替え
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初期読み込み時のチェック
}

/**
 * モバイルハンバーガーメニューとナビゲーションの開閉
 */
function initMobileMenu() {
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!burgerMenu || !mobileNav) return;

  // オーバーレイの作成
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav__overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    burgerMenu.classList.toggle('open');
    mobileNav.classList.toggle('open');
    overlay.classList.toggle('open');
    
    // スクロール固定
    if (mobileNav.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  burgerMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // メニュー内のリンクをクリックしたら閉じる
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Intersection Observerを使用したスクロールアニメーション (フェードイン・フェードアップ)
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // 15%見えたらトリガー
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // 一度アクティブになったら監視を解除してパフォーマンスを向上
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/**
 * FAQアコーディオンの制御
 */
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isOpen = item.classList.contains('active');
      
      // 他のすべてのFAQアイテムを閉じる（アコーディオンの排他動作）
      document.querySelectorAll('.faq__item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq__answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // トグル開閉動作
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

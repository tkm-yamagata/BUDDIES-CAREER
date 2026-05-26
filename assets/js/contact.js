/* assets/js/contact.js */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // DOM Elements
  const section1 = document.getElementById('section-step-1');
  const section2 = document.getElementById('section-step-2');
  const section3 = document.getElementById('section-step-3');

  const indicator1 = document.getElementById('step-indicator-1');
  const indicator2 = document.getElementById('step-indicator-2');
  const indicator3 = document.getElementById('step-indicator-3');

  const btnToStep2 = document.getElementById('btn-to-step-2');
  const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
  const btnSubmit = document.getElementById('btn-submit');

  // Input Fields
  const nameInput = document.getElementById('user-name');
  const kanaInput = document.getElementById('user-kana');
  const emailInput = document.getElementById('user-email');
  const phoneInput = document.getElementById('user-phone');
  const messageInput = document.getElementById('user-message');
  const privacyCheck = document.getElementById('privacy-agree');

  // 1. URLパラメータ解析 & 求人情報の自動マッピング
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('job_id');
  const jobTitle = urlParams.get('job_title');
  const source = urlParams.get('source');

  if (jobTitle) {
    const jobPanel = document.getElementById('target-job-panel');
    const jobTitleSpan = document.getElementById('target-job-title');

    if (jobPanel && jobTitleSpan) {
      jobPanel.style.display = 'flex';
      jobTitleSpan.textContent = jobTitle;
    }

    // お問い合わせ初期文章の生成
    if (messageInput) {
      if (source === 'private_job') {
        messageInput.value = `求人ID: ${jobId || ''}\n求人名: 「${jobTitle}」について問い合わせます。\nこちらの非公開情報（企業名や詳細要件など）の開示を希望します。`;
      } else {
        messageInput.value = `求人ID: ${jobId || ''}\n求人名: 「${jobTitle}」への応募・詳細説明を希望します。`;
      }
    }
  }

  // 2. リアルタイム・バリデーション用ヘルパー
  const validators = {
    name: (val) => val.trim().length > 0,
    kana: (val) => /^[ァ-ヶー\s]+$/.test(val.trim()), // カタカナとスペースのみ
    email: (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()),
    phone: (val) => /^\d{10,11}$/.test(val.replace(/[ー-]/g, '').trim()), // ハイフン除いて10か11桁の数字
    agree: (checked) => checked === true
  };

  function validateField(inputEl, errorEl, validatorFn, isCheckbox = false) {
    const value = isCheckbox ? inputEl.checked : inputEl.value;
    const isValid = validatorFn(value);

    if (isValid) {
      inputEl.classList.remove('is-invalid');
      if (errorEl) errorEl.style.display = 'none';
      return true;
    } else {
      inputEl.classList.add('is-invalid');
      if (errorEl) errorEl.style.display = 'block';
      return false;
    }
  }

  // リアルタイム検知 (Blur & Input)
  nameInput.addEventListener('blur', () => validateField(nameInput, document.getElementById('error-user-name'), validators.name));
  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('is-invalid')) {
      validateField(nameInput, document.getElementById('error-user-name'), validators.name);
    }
  });

  kanaInput.addEventListener('blur', () => validateField(kanaInput, document.getElementById('error-user-kana'), validators.kana));
  kanaInput.addEventListener('input', () => {
    if (kanaInput.classList.contains('is-invalid')) {
      validateField(kanaInput, document.getElementById('error-user-kana'), validators.kana);
    }
  });

  emailInput.addEventListener('blur', () => validateField(emailInput, document.getElementById('error-user-email'), validators.email));
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) {
      validateField(emailInput, document.getElementById('error-user-email'), validators.email);
    }
  });

  phoneInput.addEventListener('blur', () => validateField(phoneInput, document.getElementById('error-user-phone'), validators.phone));
  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('is-invalid')) {
      validateField(phoneInput, document.getElementById('error-user-phone'), validators.phone);
    }
  });

  privacyCheck.addEventListener('change', () => validateField(privacyCheck, document.getElementById('error-privacy-agree'), validators.agree, true));


  // 3. STEP 1 → STEP 2 (確認画面へ)
  btnToStep2.addEventListener('click', () => {
    // 全フィールド強制バリデーション
    const isNameValid = validateField(nameInput, document.getElementById('error-user-name'), validators.name);
    const isKanaValid = validateField(kanaInput, document.getElementById('error-user-kana'), validators.kana);
    const isEmailValid = validateField(emailInput, document.getElementById('error-user-email'), validators.email);
    const isPhoneValid = validateField(phoneInput, document.getElementById('error-user-phone'), validators.phone);
    const isAgreeValid = validateField(privacyCheck, document.getElementById('error-privacy-agree'), validators.agree, true);

    const isAllValid = isNameValid && isKanaValid && isEmailValid && isPhoneValid && isAgreeValid;

    if (isAllValid) {
      // データのバインド
      document.getElementById('confirm-name').textContent = nameInput.value;
      document.getElementById('confirm-kana').textContent = kanaInput.value;
      document.getElementById('confirm-email').textContent = emailInput.value;
      document.getElementById('confirm-phone').textContent = phoneInput.value;

      const selectedPref = document.querySelector('input[name="job-preference"]:checked').value;
      document.getElementById('confirm-pref').textContent = selectedPref;

      document.getElementById('confirm-message').textContent = messageInput.value.trim() || 'なし';

      // 画面切り替え
      section1.classList.remove('active');
      section2.classList.add('active');

      // インジケーター更新
      indicator1.classList.remove('active');
      indicator1.classList.add('completed');

      indicator2.classList.add('active');

      // 最上部へスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 最初のエラーフィールドにスクロール
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });

  // 4. STEP 2 → STEP 1 (修正へ)
  btnBackToStep1.addEventListener('click', () => {
    section2.classList.remove('active');
    section1.classList.add('active');

    indicator2.classList.remove('active');

    indicator1.classList.remove('completed');
    indicator1.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 5. STEP 2 → STEP 3 (送信完了へ / Googleスプレッドシート・GAS連携対応)
  btnSubmit.addEventListener('click', async () => {
    // 多重送信防止
    btnSubmit.disabled = true;
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '送信中... <i class="fa-solid fa-spinner fa-spin"></i>';

    // フォームデータの集約
    const formData = {
      timestamp: new Date().toLocaleString('ja-JP'),
      name: nameInput.value,
      kana: kanaInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      preference: document.querySelector('input[name="job-preference"]:checked').value,
      message: messageInput.value,
      jobId: jobId || 'なし',
      jobTitle: jobTitle || 'なし',
      source: source || 'direct'
    };

    // 【スプレッドシート連携】
    // デプロイしたGoogle Apps Script (GAS) のWebアプリURLをここに貼り付けるだけで、
    // 自動的にスプレッドシートにデータが蓄積されるようになります。
    const GAS_WEBAPP_URL = ''; 

    if (GAS_WEBAPP_URL) {
      try {
        // GASへデータをPOST送信 (no-corsモードでシンプルに送信)
        await fetch(GAS_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } catch (error) {
        console.error('送信中にエラーが発生しました:', error);
      }
    } else {
      // 動作デモ用の擬似的な遅延 (送信中の演出)
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // 画面切り替え
    section2.classList.remove('active');
    section3.classList.add('active');

    // インジケーター更新
    indicator2.classList.remove('active');
    indicator2.classList.add('completed');

    indicator3.classList.add('active');
    indicator3.classList.add('completed');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

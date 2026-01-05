 (function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clean = (v) => String(v ?? "").trim();

  // روابط Meta الرسمية (مباشرة قدر الإمكان)
  // Disabled: مركز مساعدة (شرح/طعن) + (ممكن تختلف الروابط حسب الدولة/الحالة)
  // Hacked: facebook.com/hacked (الأكثر شهرة وثباتًا)
  // Impersonation: شرح الإبلاغ عن الانتحال
  const OFFICIAL_LINKS = {
    disabled: [
      { titleAr: "شرح تعطيل الحساب والطعن (Help Center)", titleEn: "Disabled account & appeal (Help Center)", url: "https://www.facebook.com/help/103873106370583" },
      { titleAr: "مركز مساعدة تسجيل الدخول/استعادة الوصول", titleEn: "Login & access recovery (Help Center)", url: "https://www.facebook.com/help/105487009541643" },
    ],
    hacked: [
      { titleAr: "صفحة استعادة الحساب المخترق (facebook.com/hacked)", titleEn: "Compromised account recovery (facebook.com/hacked)", url: "https://www.facebook.com/hacked" },
      { titleAr: "تأمين حسابك: كلمات مرور وتسجيلات دخول", titleEn: "Secure your account: password & logins", url: "https://www.facebook.com/help/211990645501187" },
    ],
    impersonation: [
      { titleAr: "كيفية الإبلاغ عن انتحال شخصية (Help Center)", titleEn: "Report impersonation (Help Center)", url: "https://www.facebook.com/help/174210519303259" },
      { titleAr: "الإبلاغ عن ملف/صفحة (الدخول لصفحة الإبلاغ)", titleEn: "Report a profile/page (report flow)", url: "https://www.facebook.com/help/contact/295309487309948" },
    ],
    defamation: [
      { titleAr: "الإبلاغ عن التنمر/المضايقة (Help Center)", titleEn: "Bullying/harassment reporting (Help Center)", url: "https://www.facebook.com/help/325807937506242" },
      { titleAr: "الإبلاغ عن محتوى على فيسبوك (Help Center)", titleEn: "Report content on Facebook (Help Center)", url: "https://www.facebook.com/help/1380418588640631" },
    ],
  };

  const LABELS = {
    ar: {
      disabled: "تعطيل الحساب (Disabled)",
      hacked: "اختراق الحساب (Hacked)",
      impersonation: "انتحال شخصية (Impersonation)",
      defamation: "تشهير/مضايقة (Defamation)",
      build: "تم بناء خطة احترافية ✅",
      short: "تم إنشاء نسخة مختصرة ✅",
      copied: "✅ تم نسخ النص",
      copyFail: "⚠️ لم يتم النسخ — انسخ يدويًا",
      cleared: "تم المسح",
    },
    en: {
      disabled: "Account Disabled",
      hacked: "Account Hacked",
      impersonation: "Impersonation",
      defamation: "Defamation/Harassment",
      build: "Professional plan generated ✅",
      short: "Short version generated ✅",
      copied: "✅ Copied",
      copyFail: "⚠️ Copy failed — copy manually",
      cleared: "Cleared",
    },
  };

  // المحتوى الاحترافي لكل حالة (تشخيص + خطوات + أدلة + أخطاء)
  const PACK = {
    disabled: {
      diagnosis: {
        ar: "حالتك: الحساب Disabled. غالبًا السبب قرار آلي/بلاغات/اشتباه نشاط. المطلوب: اختيار مسار الطعن الصحيح وإرفاق أدلة (خصوصًا الهوية إن طُلبت) وتجنب الطلبات العشوائية.",
        en: "Your case: Account disabled. Often automated action/reports/suspicious signals. Goal: use the right appeal path, attach proper evidence (ID if requested), and avoid spammy repeated requests."
      },
      steps: {
        ar: [
          "تأكد أنك تسجل الدخول من جهاز وشبكة معتادة (تجنب VPN).",
          "افتح رابط الطعن/الشرح الرسمي ثم اتبع خطوة الاستئناف المتاحة لك.",
          "جهّز إثبات هوية مطابق لاسم الحساب إذا طُلب (صورة واضحة).",
          "اكتب اعتراضًا قصيرًا، هادئًا، يطلب مراجعة بشرية.",
          "لا ترسل 5 طلبات بنفس اليوم—اكتفِ بطلب واحد وانتظر ردًا."
        ],
        en: [
          "Use a familiar device/network (avoid VPN).",
          "Open the official appeal/help page and follow the available appeal flow.",
          "Prepare a clear ID matching the account name if requested.",
          "Write a calm, short appeal asking for a human review.",
          "Don’t spam multiple appeals in the same day—submit once and wait."
        ]
      },
      evidence: {
        ar: [
          "لقطة شاشة لرسالة التعطيل داخل التطبيق",
          "أي بريد من Meta بخصوص التعطيل",
          "هوية رسمية إن طُلبت + صورة سيلفي واضحة (إن طلبها النظام)",
          "رابط الحساب/اسم المستخدم"
        ],
        en: [
          "Screenshot of the disable notice",
          "Any email from Meta about the action",
          "Government ID if requested (+ selfie if required)",
          "Your profile URL/username"
        ]
      },
      warnings: {
        ar: [
          "لا تستخدم VPN أو تغيّر IP بشكل متكرر أثناء الاسترداد.",
          "لا تهدد/تسب في الرسالة—هذا يضعف فرص المراجعة.",
          "لا تنشئ حساب جديد بدل القديم (قد يزيد التعقيد).",
          "لا ترسل اعتراضات عديدة يوميًا (Spam)."
        ],
        en: [
          "Avoid VPN/frequent IP changes during recovery.",
          "No threats/insults in your message—hurts your chance.",
          "Don’t create a new account instead of recovering the old one.",
          "Don’t spam multiple appeals daily."
        ]
      }
    },

    hacked: {
      diagnosis: {
        ar: "حالتك: الحساب مخترق. الهدف الآن: استعادة الوصول بأسرع وقت + إلغاء الجلسات المشبوهة + تغيير كلمة المرور + تفعيل المصادقة الثنائية.",
        en: "Your case: account compromised. Goal: regain access fast, revoke suspicious sessions, change password, enable 2FA."
      },
      steps: {
        ar: [
          "افتح facebook.com/hacked واتبع خطوات الاسترداد مباشرة.",
          "إذا استعدت الدخول: غيّر كلمة المرور فورًا.",
          "سجّل خروج من كل الأجهزة/الجلسات غير المعروفة (Security & Login).",
          "فعّل المصادقة الثنائية (2FA) وحدث البريد/الهاتف الآمن.",
          "راجع أي تغييرات: البريد، رقم الهاتف، الصفحات/الإعلانات إن وُجد."
        ],
        en: [
          "Open facebook.com/hacked and follow the recovery flow.",
          "If you regain access: change your password immediately.",
          "Log out of unknown devices/sessions (Security & Login).",
          "Enable 2FA and update secure email/phone.",
          "Review changes: email/phone/pages/ads activity."
        ]
      },
      evidence: {
        ar: [
          "تاريخ/وقت نشاط مشبوه (إن عُرف)",
          "لقطات شاشة لإشعارات تغيير البريد/كلمة المرور",
          "هوية رسمية إذا طُلبت",
          "رابط الحساب"
        ],
        en: [
          "Approx date/time of suspicious activity (if known)",
          "Screenshots of email/password change alerts",
          "ID if requested",
          "Profile URL"
        ]
      },
      warnings: {
        ar: [
          "لا تتأخر—سرعة التحرك مهمة جدًا في الاختراق.",
          "لا تعيد استخدام نفس كلمة المرور في مواقع أخرى.",
          "لا تشارك أكواد التحقق مع أي شخص.",
          "لا تنقر روابط غير رسمية تُرسل لك عبر رسائل."
        ],
        en: [
          "Act fast—time matters with hacks.",
          "Don’t reuse old passwords across sites.",
          "Never share verification codes.",
          "Avoid unofficial links sent via messages."
        ]
      }
    },

    impersonation: {
      diagnosis: {
        ar: "حالتك: انتحال شخصية. الهدف: الإبلاغ الرسمي مع روابط واضحة وإثبات أن هذا الحساب ينتحل اسمك/صورك وربطه بحسابك الحقيقي.",
        en: "Your case: impersonation. Goal: report using official flow with clear evidence comparing the fake account to your real one."
      },
      steps: {
        ar: [
          "اجمع رابط الحساب المنتحل + رابط حسابك الحقيقي.",
          "افتح رابط الإبلاغ الرسمي عن الانتحال واتبع الطلب.",
          "ارفق أدلة: صور/أسماء/منشورات تثبت الانتحال.",
          "إذا تم رفض البلاغ، أعد الإبلاغ بمعلومات أدق ولقطات شاشة أوضح.",
          "إن كان الانتحال يتضمن تهديد/ابتزاز: وثّق كل شيء وبلّغ الجهات المختصة محليًا."
        ],
        en: [
          "Collect the impersonating account URL + your real account URL.",
          "Use the official impersonation report flow and submit.",
          "Attach evidence: matching photos/name/posts showing impersonation.",
          "If rejected, re-submit with clearer screenshots/details.",
          "If threats/extortion: document everything and consider reporting locally."
        ]
      },
      evidence: {
        ar: [
          "رابط الحساب المنتحل",
          "رابط حسابك الحقيقي",
          "لقطات مقارنة (صورة/اسم/نبذة)",
          "هوية رسمية إذا طُلبت"
        ],
        en: [
          "Impersonating account URL",
          "Your real account URL",
          "Comparison screenshots (photo/name/bio)",
          "ID if requested"
        ]
      },
      warnings: {
        ar: [
          "لا تدخل في نقاش مع المنتحل—وثّق وبلّغ.",
          "لا ترسل بياناتك أو هوية عبر حسابات غير رسمية.",
          "لا تعتمد على “وسيط” يطلب مالًا لفتح الحساب—غالبًا احتيال."
        ],
        en: [
          "Don’t argue with the impersonator—document and report.",
          "Never send ID to unofficial accounts.",
          "Beware of paid 'agents' promising recovery—often scams."
        ]
      }
    },

    defamation: {
      diagnosis: {
        ar: "حالتك: تشهير/مضايقة. الهدف: الإبلاغ عن المحتوى المحدد (روابط + لقطات شاشة) وتوضيح الضرر بشكل هادئ، وطلب إزالة المحتوى المخالف.",
        en: "Your case: defamation/harassment. Goal: report the specific content with links + screenshots and explain the harm calmly; request removal under harassment/bullying policies."
      },
      steps: {
        ar: [
          "انسخ روابط المنشورات/التعليقات المسيئة (كل رابط على سطر).",
          "خذ لقطات شاشة تظهر المحتوى + اسم الحساب + التاريخ/الوقت إن أمكن.",
          "استخدم مسار الإبلاغ الرسمي (Report) للمحتوى المحدد.",
          "اكتب وصفًا قصيرًا: لماذا هذا تشهير/مضايقة وما الضرر.",
          "إذا كان هناك تهديد مباشر أو نشر بيانات شخصية: بلّغ فورًا كحالة طارئة."
        ],
        en: [
          "Collect direct URLs to abusive posts/comments (one per line).",
          "Take screenshots showing content + account name + date/time if possible.",
          "Use the official report flow for the specific content.",
          "Write a short explanation of why it’s harassment/defamation and the harm caused.",
          "If threats or doxxing: escalate immediately."
        ]
      },
      evidence: {
        ar: [
          "روابط المنشورات/التعليقات المسيئة",
          "لقطات شاشة واضحة + تاريخ",
          "توضيح الضرر (تهديد/ابتزاز/تشويه سمعة/نشر بيانات)",
          "أي بلاغات سابقة ونتائجها (إن وجدت)"
        ],
        en: [
          "URLs to abusive posts/comments",
          "Clear screenshots + date",
          "Impact summary (threats/extortion/reputation damage/doxxing)",
          "Any prior reports + outcomes (if any)"
        ]
      },
      warnings: {
        ar: [
          "لا ترد بعنف أو سب—قد يتم اعتبارك مشاركًا في الإساءة.",
          "لا تكتفي بكلام عام—حدد الروابط بدقة.",
          "لا تعتمد على صور مقصوصة جدًا—خلّها تُظهر السياق والاسم."
        ],
        en: [
          "Don’t respond with insults—can backfire.",
          "Avoid vague reports—use direct URLs.",
          "Don’t over-crop screenshots—show context and account name."
        ]
      }
    }
  };

  function lang() {
    return (clean($("lang")?.value) === "en") ? "en" : "ar";
  }
  function issue() {
    return clean($("issue")?.value) || "disabled";
  }

  function setStatus(text, kind) {
    const el = $("copyStatus");
    if (el) el.textContent = text || "";
    const badge = $("statusBadge");
    if (badge) {
      badge.className = "tag " + (kind || "warn");
      badge.textContent = text ? text : "جاهز";
    }
  }

  function buildLinks(list, L) {
    const box = $("linksBox");
    if (!box) return;
    box.innerHTML = "";
    (list || []).forEach((x) => {
      const a = document.createElement("a");
      a.className = "linkBtn";
      a.href = x.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const title = (L === "ar") ? x.titleAr : x.titleEn;
      a.innerHTML = `<div><b>${escapeHtml(title)}</b><div><span>${escapeHtml(x.url)}</span></div></div><div>↗</div>`;
      box.appendChild(a);
    });
  }

  function renderList(id, items) {
    const ul = $(id);
    if (!ul) return;
    ul.innerHTML = "";
    (items || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getData() {
    return {
      fullName: clean($("fullName")?.value),
      profileUrl: clean($("profileUrl")?.value),
      email: clean($("email")?.value),
      country: clean($("country")?.value),
      context: clean($("context")?.value),
      links: clean($("links")?.value),
    };
  }

  function buildMessage(L, k, data, short) {
    const labels = LABELS[L];
    const label = labels[k] || k;

    const whoAr = data.fullName ? `الاسم: ${data.fullName}` : `الاسم: —`;
    const whoEn = data.fullName ? `Name: ${data.fullName}` : `Name: —`;

    const baseAr = [
      "مرحبًا فريق دعم Meta،",
      "",
      `الموضوع: طلب مراجعة بخصوص ${label}`,
      "",
      "بيانات:",
      `- ${whoAr}`,
      `- رابط الحساب: ${data.profileUrl || "—"}`,
      data.email ? `- البريد/الهاتف: ${data.email}` : null,
      data.country ? `- الدولة: ${data.country}` : null,
      "",
      "ملخص الحالة:",
      data.context || "أعتقد أن هناك خطأ/سوء فهم أو نشاط غير مصرح به. أرجو مراجعة بشرية وإرشادي للمطلوب.",
      data.links ? "" : null,
      data.links ? "روابط/أدلة:" : null,
      data.links ? data.links : null,
      "",
      "أرجو اتخاذ الإجراء المناسب وفق سياسات Meta وتوضيح الخطوات التالية إن لزم.",
      "",
      "شكرًا لكم."
    ].filter(Boolean);

    const baseEn = [
      "Hello Meta Support Team,",
      "",
      `Subject: Request regarding ${label}`,
      "",
      "Details:",
      `- ${whoEn}`,
      `- Account URL: ${data.profileUrl || "—"}`,
      data.email ? `- Email/Phone: ${data.email}` : null,
      data.country ? `- Country: ${data.country}` : null,
      "",
      "Case summary:",
      data.context || "I believe this may be a mistake/misunderstanding or unauthorized activity. Please conduct a human review and advise next steps.",
      data.links ? "" : null,
      data.links ? "Links/Evidence:" : null,
      data.links ? data.links : null,
      "",
      "Please take the appropriate action under Meta policies and let me know the required steps if any.",
      "",
      "Thank you."
    ].filter(Boolean);

    if (!short) return (L === "ar") ? baseAr.join("\n") : baseEn.join("\n");

    // نسخة مختصرة قوية
    const shortAr = [
      "مرحبًا دعم Meta،",
      `أطلب مراجعة بشرية لمشكلتي: ${label}.`,
      `الرابط: ${data.profileUrl || "—"}.`,
      data.context ? `ملخص: ${data.context}` : "ملخص: أرجو المراجعة وإعادة الوصول إن أمكن أو توضيح المطلوب.",
      "شكرًا."
    ].join("\n");

    const shortEn = [
      "Hello Meta Support,",
      `Please conduct a human review for: ${label}.`,
      `URL: ${data.profileUrl || "—"}.`,
      data.context ? `Summary: ${data.context}` : "Summary: Please review and restore access if possible or advise required steps.",
      "Thanks."
    ].join("\n");

    return (L === "ar") ? shortAr : shortEn;
  }

  function applyPack(shortMode) {
    const L = lang();
    const k = issue();
    const data = getData();

    const labels = LABELS[L];
    const pack = PACK[k] || PACK.disabled;

    // تشخيص
    const diag = (L === "ar") ? pack.diagnosis.ar : pack.diagnosis.en;
    const diagBox = $("diagnosisBox");
    if (diagBox) diagBox.textContent = diag;

    // قوائم
    renderList("stepsList", (L === "ar") ? pack.steps.ar : pack.steps.en);
    renderList("evidenceList", (L === "ar") ? pack.evidence.ar : pack.evidence.en);
    renderList("warningsList", (L === "ar") ? pack.warnings.ar : pack.warnings.en);

    // روابط
    buildLinks(OFFICIAL_LINKS[k] || OFFICIAL_LINKS.disabled, L);

    // نص جاهز
    const msg = buildMessage(L, k, data, !!shortMode);
    const out = $("output");
    if (out) out.textContent = msg;

    // Status
    setStatus(shortMode ? labels.short : labels.build, shortMode ? "good" : "warn");

    // تخزين بسيط (يحسن تجربة المستخدم)
    try {
      localStorage.setItem("mp_recover_state", JSON.stringify({
        lang: L,
        issue: k,
        ...data
      }));
    } catch {}
  }

  async function copyCurrent() {
    const out = $("output");
    const text = (out?.textContent || "").trim();
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }
  }

  function resetAll() {
    ["fullName", "profileUrl", "email", "country", "context", "links"].forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    if ($("issue")) $("issue").value = "disabled";
    if ($("lang")) $("lang").value = "ar";

    // تنظيف UI
    const diagBox = $("diagnosisBox");
    if (diagBox) diagBox.textContent = "اختر نوع المشكلة واضغط “بناء الخطة”.";
    ["stepsList", "evidenceList", "warningsList"].forEach((id) => renderList(id, []));
    const linksBox = $("linksBox");
    if (linksBox) linksBox.innerHTML = "";
    const out = $("output");
    if (out) out.textContent = "اضغط “بناء الخطة + الروابط + النص” لعرض النتيجة هنا.";

    setStatus(LABELS[lang()].cleared, "warn");

    try { localStorage.removeItem("mp_recover_state"); } catch {}
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem("mp_recover_state");
      if (!raw) return;
      const s = JSON.parse(raw);

      if ($("lang")) $("lang").value = s.lang || "ar";
      if ($("issue")) $("issue").value = s.issue || "disabled";
      ["fullName", "profileUrl", "email", "country", "context", "links"].forEach((id) => {
        if ($(id) && typeof s[id] === "string") $(id).value = s[id];
      });

      // بناء تلقائي بعد الاسترجاع
      applyPack(false);
    } catch {}
  }

  function wire() {
    $("btnBuild")?.addEventListener("click", (e) => { e.preventDefault(); applyPack(false); });
    $("btnShort")?.addEventListener("click", (e) => { e.preventDefault(); applyPack(true); });

    $("btnCopy")?.addEventListener("click", async (e) => {
      e.preventDefault();
      const ok = await copyCurrent();
      const L = lang();
      setStatus(ok ? LABELS[L].copied : LABELS[L].copyFail, ok ? "good" : "bad");
    });

    $("btnPrint")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });

    $("btnReset")?.addEventListener("click", (e) => { e.preventDefault(); resetAll(); });

    // تحديث ديناميكي
    $("lang")?.addEventListener("change", () => applyPack(false));
    $("issue")?.addEventListener("change", () => applyPack(false));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      wire();
      restoreState();
    });
  } else {
    wire();
    restoreState();
  }
})();


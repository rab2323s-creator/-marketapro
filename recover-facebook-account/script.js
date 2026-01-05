 (function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const clean = (v) => String(v ?? "").trim();

  const issueLabels = {
    ar: {
      disabled: "تم تعطيل الحساب",
      locked: "تم قفل الحساب مؤقتًا",
      hacked: "تم اختراق الحساب",
      impersonation: "انتحال شخصية",
      defamation: "تشهير / مضايقة",
    },
    en: {
      disabled: "Account disabled",
      locked: "Account locked",
      hacked: "Account hacked",
      impersonation: "Impersonation",
      defamation: "Defamation / Harassment",
    },
  };

  // جمل قوية حسب المشكلة (بدون مبالغة)
  const templates = {
    ar: {
      disabled: ({ context }) => ({
        title: "طلب مراجعة بشرية لإعادة تفعيل حساب فيسبوك",
        body: [
          "أتقدم بطلب مراجعة بشرية لقرار تعطيل حسابي. أعتقد أن الإجراء تم بالخطأ أو بسبب سوء فهم.",
          context
            ? `ملخص الحالة: ${context}`
            : "ملخص الحالة: لم أتلقَّ توضيحًا كافيًا عن سبب التعطيل، وأطلب التحقق من الالتزام بمعايير المجتمع.",
          "أؤكد التزامي بمعايير المجتمع وشروط الاستخدام، وأرجو إعادة تفعيل الحساب أو توضيح المخالفة إن وجدت وخطوات تصحيحها.",
        ],
        evidence: [
          "صورة من رسالة التعطيل/الإنذار داخل التطبيق",
          "أي بريد إلكتروني من Meta بخصوص الإجراء",
          "إن وُجد: إثبات هوية مطابق لاسم الحساب",
        ],
      }),

      locked: ({ context }) => ({
        title: "طلب استعادة الوصول لحساب فيسبوك المقفول",
        body: [
          "حسابي مقفول مؤقتًا ولا أستطيع إكمال خطوات الاسترداد.",
          context
            ? `ملخص الحالة: ${context}`
            : "ملخص الحالة: أواجه مشكلة في التحقق/الكود أو ظهور حلقة تحقق تمنعني من الدخول.",
          "أرجو إرشادي للخطوات الصحيحة لاستعادة الوصول أو إعادة ضبط آلية التحقق.",
        ],
        evidence: [
          "لقطات شاشة لرسالة القفل/خطأ التحقق",
          "رقم الهاتف/البريد المرتبط (إن وُجد)",
        ],
      }),

      hacked: ({ context }) => ({
        title: "بلاغ اختراق وطلب تأمين الحساب واستعادة الوصول",
        body: [
          "أعتقد أن حسابي تعرّض للاختراق وتم تغيير كلمة المرور/البريد أو تنفيذ نشاط غير مصرح به.",
          context
            ? `تفاصيل مهمة: ${context}`
            : "تفاصيل مهمة: لاحظت تسجيلات دخول أو تغييرات لم أقم بها، وأحتاج استعادة الوصول وتأمين الحساب.",
          "أرجو تعطيل أي جلسات نشطة غير معروفة، وإتاحة استرداد الحساب، وتأكيد الإجراءات اللازمة لتأمينه.",
        ],
        evidence: [
          "تاريخ/وقت آخر نشاط مشبوه (إن عُرف)",
          "لقطات شاشة للتغييرات أو الإشعارات",
          "إثبات هوية إن طُلب",
        ],
      }),

      impersonation: ({ context }) => ({
        title: "طلب إزالة حساب/صفحة تنتحل شخصيتي",
        body: [
          "يوجد حساب/صفحة تنتحل شخصيتي وتستخدم اسمي/صوري أو تدّعي تمثيلي.",
          context
            ? `معلومات إضافية: ${context}`
            : "معلومات إضافية: أطلب التحقق من الانتحال واتخاذ الإجراء المناسب وفق سياسات Meta.",
          "أرجو إزالة المحتوى/الحساب المنتحل، وحماية اسمي من تكرار الانتحال.",
        ],
        evidence: [
          "روابط الحساب/المنشورات المنتحلة",
          "رابط حسابي الحقيقي",
          "صور مقارنة أو إثبات هوية",
        ],
      }),

      defamation: ({ context }) => ({
        title: "بلاغ تشهير/مضايقة وطلب إزالة المحتوى المسيء",
        body: [
          "تعرّضت لتشهير/مضايقة عبر منشور/حساب على فيسبوك، ويتضمن إساءة أو معلومات مضللة تسبب ضررًا.",
          context
            ? `ملخص الضرر والمحتوى: ${context}`
            : "ملخص الضرر والمحتوى: أطلب مراجعة المحتوى وفق سياسات التحرّش وخطاب الكراهية/التنمر (حسب الحالة).",
          "أرجو إزالة المحتوى المسيء واتخاذ الإجراء المناسب بحق الحساب، مع إتاحة طريقة واضحة للطعن/المتابعة.",
        ],
        evidence: [
          "روابط المنشورات/التعليقات المسيئة",
          "لقطات شاشة توضح الإساءة وتاريخها",
          "إن لزم: توضيح الضرر (تهديد، ابتزاز، نشر بيانات…)",
        ],
      }),
    },

    en: {
      disabled: ({ context }) => ({
        title: "Request for human review to restore my Facebook account",
        body: [
          "I’m requesting a human review of the decision to disable my Facebook account. I believe this action may have been taken by mistake or due to a misunderstanding.",
          context
            ? `Case summary: ${context}`
            : "Case summary: I did not receive sufficient clarity on the reason for the disablement and I’m requesting a review against Community Standards.",
          "I confirm my intent to comply with Meta policies. Please restore access or clearly explain any violation and the corrective steps required.",
        ],
        evidence: [
          "Screenshot of the disable/violation notice",
          "Any email from Meta related to the action",
          "Valid ID matching the account name (if requested)",
        ],
      }),

      locked: ({ context }) => ({
        title: "Request to regain access to my locked Facebook account",
        body: [
          "My account appears to be locked and I’m unable to complete the recovery/verification steps.",
          context
            ? `Case summary: ${context}`
            : "Case summary: I’m stuck in verification loops or not receiving codes and cannot proceed.",
          "Please advise the correct steps to regain access or reset the verification method.",
        ],
        evidence: [
          "Screenshots of the lock/verification error",
          "Associated email/phone (if any)",
        ],
      }),

      hacked: ({ context }) => ({
        title: "Report: account compromised — request to secure and restore access",
        body: [
          "I believe my Facebook account has been compromised and unauthorized changes/logins occurred.",
          context
            ? `Key details: ${context}`
            : "Key details: I noticed suspicious login activity or changes I did not make and need help restoring access and securing the account.",
          "Please revoke unknown sessions, enable recovery, and confirm the steps needed to secure the account.",
        ],
        evidence: [
          "Approx. date/time of suspicious activity (if known)",
          "Screenshots/notifications of changes",
          "Valid ID if required",
        ],
      }),

      impersonation: ({ context }) => ({
        title: "Request: remove an account/page impersonating me",
        body: [
          "There is an account/page impersonating me by using my name/photos or claiming to represent me.",
          context
            ? `Additional information: ${context}`
            : "Additional information: Please review the impersonation under Meta’s policies and take the appropriate action.",
          "Please remove the impersonating account/content and help prevent repeated impersonation.",
        ],
        evidence: [
          "Links to the impersonating account/posts",
          "Link to my real account",
          "Comparisons and/or proof of identity",
        ],
      }),

      defamation: ({ context }) => ({
        title: "Report: defamation/harassment — request content removal",
        body: [
          "I’m reporting defamation/harassment content posted about me. It includes abusive or misleading information that is causing harm.",
          context
            ? `Content & impact summary: ${context}`
            : "Content & impact summary: Please review the content under harassment/bullying policies (as applicable).",
          "Please remove the violating content and take appropriate action on the account. If possible, provide a clear appeal/follow-up path.",
        ],
        evidence: [
          "Links to the posts/comments",
          "Screenshots showing the content and date",
          "If applicable: details of harm (threats, doxxing, extortion, etc.)",
        ],
      }),
    },
  };

  function build(lang, data) {
    const L = lang === "en" ? "en" : "ar";
    const issue = data.issue || "disabled";
    const label = issueLabels[L][issue] || issue;
    const t = templates[L][issue] || templates[L].disabled;
    const pack = t({ context: data.context });

    const lines = [];
    if (L === "ar") {
      lines.push("مرحبًا فريق دعم Meta،");
      lines.push("");
      lines.push(`الموضوع: ${pack.title}`);
      lines.push("");
      lines.push("بيانات:");
      if (data.fullName) lines.push(`- الاسم: ${data.fullName}`);
      if (data.profileUrl) lines.push(`- رابط الحساب: ${data.profileUrl}`);
      if (data.email) lines.push(`- البريد/الهاتف (اختياري): ${data.email}`);
      if (data.country) lines.push(`- الدولة: ${data.country}`);
      lines.push(`- نوع المشكلة: ${label}`);
      lines.push("");
      lines.push(...pack.body.map((x) => `- ${x}`));
      if (data.links) {
        lines.push("");
        lines.push("روابط ذات صلة:");
        lines.push(data.links);
      }
      lines.push("");
      lines.push("مقترح مرفقات/أدلة:");
      lines.push(...pack.evidence.map((x) => `- ${x}`));
      lines.push("");
      lines.push("شكرًا لكم.");
      return lines.join("\n");
    } else {
      lines.push("Hello Meta Support Team,");
      lines.push("");
      lines.push(`Subject: ${pack.title}`);
      lines.push("");
      lines.push("Details:");
      if (data.fullName) lines.push(`- Name: ${data.fullName}`);
      if (data.profileUrl) lines.push(`- Account URL: ${data.profileUrl}`);
      if (data.email) lines.push(`- Email/Phone (optional): ${data.email}`);
      if (data.country) lines.push(`- Country: ${data.country}`);
      lines.push(`- Issue: ${label}`);
      lines.push("");
      lines.push(...pack.body.map((x) => `- ${x}`));
      if (data.links) {
        lines.push("");
        lines.push("Relevant links:");
        lines.push(data.links);
      }
      lines.push("");
      lines.push("Suggested evidence to attach:");
      lines.push(...pack.evidence.map((x) => `- ${x}`));
      lines.push("");
      lines.push("Thank you.");
      return lines.join("\n");
    }
  }

  async function copyText(text) {
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

  function getData() {
    return {
      issue: clean($("issue")?.value),
      fullName: clean($("fullName")?.value),
      email: clean($("email")?.value),
      profileUrl: clean($("profileUrl")?.value),
      country: clean($("country")?.value),
      context: clean($("context")?.value),
      links: clean($("links")?.value),
      lang: clean($("lang")?.value) || "ar",
    };
  }

  function generate() {
    const data = getData();
    const text = build(data.lang, data);
    if ($("output")) $("output").textContent = text;
    setStatus("تم توليد نص أقوى ✅");
    return text;
  }

  function setStatus(msg) {
    if ($("copyStatus")) $("copyStatus").textContent = msg;
  }

  function shorten() {
    const data = getData();
    const L = data.lang === "en" ? "en" : "ar";
    const label = issueLabels[L][data.issue] || data.issue || (L === "ar" ? "تم تعطيل الحساب" : "Account disabled");

    const shortAr =
      `مرحبًا دعم Meta،\n` +
      `أطلب مراجعة بشرية لمشكلتي: ${label}. ` +
      `الاسم: ${data.fullName || "—"}، الرابط: ${data.profileUrl || "—"}. ` +
      `${data.context ? `ملخص: ${data.context}` : "أعتقد أنه تم بالخطأ. أرجو إعادة التفعيل/التوجيه."}\n` +
      `شكرًا.`;

    const shortEn =
      `Hello Meta Support,\n` +
      `Please conduct a human review for: ${label}. ` +
      `Name: ${data.fullName || "—"}, URL: ${data.profileUrl || "—"}. ` +
      `${data.context ? `Summary: ${data.context}` : "I believe this may be a mistake. Please restore access/advise next steps."}\n` +
      `Thanks.`;

    if ($("output")) $("output").textContent = L === "ar" ? shortAr : shortEn;
    setStatus("تم توليد نسخة مختصرة ✅");
  }

  function resetForm() {
    ["fullName", "email", "profileUrl", "country", "context", "links"].forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    if ($("issue")) $("issue").value = "disabled";
    if ($("lang")) $("lang").value = "ar";
    if ($("output")) $("output").textContent = "اضغط “توليد النص” لعرض النتيجة هنا.";
    setStatus("تم المسح");
  }

  function wire() {
    $("btnGenerate")?.addEventListener("click", (e) => {
      e.preventDefault();
      generate();
    });

    $("btnCopy")?.addEventListener("click", async (e) => {
      e.preventDefault();
      const out = $("output");
      const text = (out?.textContent || "").trim();
      const finalText = text && !text.includes("اضغط") ? text : generate();
      const ok = await copyText(finalText);
      setStatus(ok ? "✅ تم النسخ" : "⚠️ لم يتم النسخ — انسخ يدويًا");
    });

    $("btnShorten")?.addEventListener("click", (e) => {
      e.preventDefault();
      shorten();
    });

    $("btnReset")?.addEventListener("click", (e) => {
      e.preventDefault();
      resetForm();
    });

    $("lang")?.addEventListener("change", generate);
    $("issue")?.addEventListener("change", generate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();


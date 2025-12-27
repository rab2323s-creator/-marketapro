function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(()=>{ t.style.display='none'; }, 2200);
  }

  const base = {
    morning: ["09:00–11:00", "10:00–12:00"],
    noon: ["12:00–14:00", "13:00–15:00"],
    evening: ["18:00–21:00", "19:00–22:00"],
    weekend: ["السبت 11:00–13:00", "الأحد 18:00–21:00"]
  };

  const byRegion = {
    gulf:   { label:"الخليج", shift:"+0", prime:["الثلاثاء 18:00–21:00","الخميس 09:00–11:00","السبت 11:00–13:00"], extra:["الإثنين 19:00–21:00","الأربعاء 10:00–12:00","الجمعة 16:00–19:00"] },
    egypt:  { label:"مصر",    shift:"+0", prime:["الأحد 19:00–22:00","الثلاثاء 18:00–21:00","الخميس 10:00–12:00"], extra:["السبت 11:00–13:00","الأربعاء 18:00–20:00","الجمعة 16:00–19:00"] },
    levant: { label:"بلاد الشام", shift:"+0", prime:["الثلاثاء 18:00–21:00","الأربعاء 10:00–12:00","السبت 11:00–13:00"], extra:["الإثنين 18:00–20:00","الخميس 09:00–11:00","الجمعة 16:00–19:00"] },
    maghreb:{ label:"المغرب العربي", shift:"+0", prime:["الأربعاء 19:00–21:00","الخميس 10:00–12:00","السبت 12:00–14:00"], extra:["الثلاثاء 18:00–20:00","الإثنين 10:00–12:00","الأحد 18:00–21:00"] },
    europe: { label:"أوروبا", shift:"+0", prime:["الإثنين 18:00–20:00","الأربعاء 12:00–14:00","السبت 10:00–12:00"], extra:["الثلاثاء 18:00–21:00","الخميس 09:00–11:00","الأحد 19:00–21:00"] },
    global: { label:"جمهور مختلط", shift:"+0", prime:["يوميًا 09:00–11:00","يوميًا 18:00–21:00","الثلاثاء/الخميس (تجربة أولًا)"], extra:["السبت 11:00–13:00","الأربعاء 10:00–12:00","الجمعة 16:00–19:00"] }
  };

  function goalTweaks(goal, format){
    // تعطي تلميحات حسب الهدف ونوع المحتوى
    const hints = [];
    if(goal === "sales") hints.push("للمبيعات: جرّب أوقات الدوام (10:00–12:00) + مساءً 19:00–21:00.");
    if(goal === "reach") hints.push("للوصول: ثبّت 3 أوقات، وكرر أفضل صيغة محتوى 3 مرات أسبوعيًا.");
    if(goal === "brand") hints.push("للوعي: اعتمد Carousel/Posts وقت الظهيرة، وStories يوميًا.");
    if(goal === "engagement") hints.push("للتفاعل: ركّز على مساء الثلاثاء/الخميس وعطلة نهاية الأسبوع.");

    if(format === "reels") hints.push("Reels غالبًا تعمل أفضل مساءً + عطلة نهاية الأسبوع.");
    if(format === "carousel") hints.push("Carousel غالبًا تعمل جيدًا وقت الظهيرة وبعد العمل.");
    if(format === "stories") hints.push("Stories: وزّعها على اليوم (صباح/ظهر/مساء) بدل مرة واحدة.");

    return hints;
  }

  const form = document.getElementById('timeForm');
  const out = document.getElementById('output');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const country = document.getElementById('country').value;
    const goal = document.getElementById('goal').value;
    const type = document.getElementById('type').value;
    const format = document.getElementById('format').value;

    const region = byRegion[country];
    const tweaks = goalTweaks(goal, format);

    const meta = document.getElementById('meta');
    meta.textContent = `اقتراحات مبدئية لجمهور: ${region.label} — هدفك: ${labelGoal(goal)} — نوع المحتوى: ${labelFormat(format)}. ` + (tweaks[0] ? ("نصيحة: " + tweaks[0]) : "");

    renderList('topTimes', adjustForType(region.prime, type, format));
    renderList('extraTimes', adjustForType(region.extra, type, format));

    out.style.display = 'block';
    history.replaceState(null,'','#results');
    showToast('تم إنشاء التوصيات ✅');
  });

  function labelGoal(g){
    return ({
      engagement:"زيادة التفاعل",
      reach:"زيادة الوصول",
      sales:"مبيعات/Leads",
      brand:"وعي بالعلامة"
    })[g] || g;
  }

  function labelFormat(f){
    return ({
      reels:"Reels",
      carousel:"Carousel",
      post:"Post",
      stories:"Stories",
      mixed:"مختلط"
    })[f] || f;
  }

  function adjustForType(times, type, format){
    // تعديل بسيط حسب نوع الحساب ونوع المحتوى لزيادة “شعور التخصيص”
    const add = [];
    if(type === "company") add.push("الأحد 10:00–12:00 — مناسب لحسابات الشركات");
    if(type === "smallbiz") add.push("الخميس 19:00–21:00 — وقت مناسب للشراء/الطلب");
    if(type === "creator") add.push("السبت 18:00–21:00 — جمهور نشط للمحتوى");
    if(format === "reels") add.push("يوميًا 19:00–22:00 — مناسب لـ Reels");
    return [...times, ...add].slice(0, 6);
  }

  function renderList(id, arr){
    const el = document.getElementById(id);
    el.innerHTML = '';
    arr.forEach(t=>{
      const li = document.createElement('li');
      li.textContent = t;
      el.appendChild(li);
    });
  }

  document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('country').value = 'gulf';
    document.getElementById('goal').value = 'engagement';
    document.getElementById('type').value = 'creator';
    document.getElementById('format').value = 'reels';
    document.getElementById('hint').textContent = '';
    out.style.display = 'none';
    history.replaceState(null,'',' ');
    showToast('تم المسح');
  });

  document.getElementById('copyBtn').addEventListener('click', async ()=>{
    if(out.style.display === 'none'){
      showToast('احسب أولًا لنسخ الملخص');
      return;
    }
    const country = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
    const goal = labelGoal(document.getElementById('goal').value);
    const type = document.getElementById('type').options[document.getElementById('type').selectedIndex].text;
    const format = labelFormat(document.getElementById('format').value);

    const top = [...document.querySelectorAll('#topTimes li')].map(li=>"- " + li.textContent).join("\n");
    const extra = [...document.querySelectorAll('#extraTimes li')].map(li=>"- " + li.textContent).join("\n");

    const txt =
`MarketAPro — أفضل وقت للنشر على إنستغرام
البلد/المنطقة: ${country}
الهدف: ${goal}
نوع الحساب: ${type}
نوع المحتوى: ${format}

أفضل 3 أوقات:
${top}

أوقات إضافية:
${extra}

الرابط: https://marketapro.com/tools/best-time-to-post-instagram/`;

    try{
      await navigator.clipboard.writeText(txt);
      showToast('تم نسخ الملخص ✅');
    }catch(e){
      alert('تعذر النسخ تلقائيًا. انسخ النص يدويًا:\n\n' + txt);
    }
  });

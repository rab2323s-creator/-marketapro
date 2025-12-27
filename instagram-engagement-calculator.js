// ---------- Helpers ----------
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(()=>{ t.style.display='none'; }, 2200);
  }

  function parseNumbersField(str){
    if(!str) return [];
    const cleaned = str.trim();
    if(!cleaned) return [];

    // If looks like list (commas/spaces/newlines), parse list:
    if (cleaned.includes(',') || /\s/.test(cleaned)) {
      return cleaned
        .split(/[, \n\r\t]+/)
        .map(s => parseFloat(String(s).replace(/[^\d.]/g,'')))
        .filter(n => !isNaN(n));
    }

    // Otherwise parse single number (could be total)
    const v = parseFloat(cleaned.replace(/[^\d.]/g,''));
    return isNaN(v) ? [] : [v];
  }

  function sum(arr){ return arr.reduce((a,b)=>a + (+b||0), 0); }

  function median(arr){
    if(!arr.length) return 0;
    const a = [...arr].sort((x,y)=>x-y);
    const mid = Math.floor(a.length/2);
    return a.length % 2 ? a[mid] : (a[mid-1] + a[mid]) / 2;
  }

  function percentile(arr, p){
    if(!arr.length) return 0;
    const a = [...arr].sort((x,y)=>x-y);
    const idx = (p/100)*(a.length-1);
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    if(lo === hi) return a[lo];
    const w = idx - lo;
    return a[lo]*(1-w) + a[hi]*w;
  }

  function formatNumber(n){
    const v = Math.round((+n||0));
    return v.toLocaleString('ar');
  }

  function round2(n){
    return Math.round((+n||0)*100)/100;
  }

  function suggestBestTimes(engRate){
    const high=[
      'الثلاثاء 18:00–21:00 — نشاط قوي غالبًا',
      'الخميس 09:00–11:00 — مناسب للمحترفين',
      'السبت 11:00–13:00 — وقت جيّد للانتشار'
    ];
    const med=[
      'الإثنين 18:00–20:00 — مساءً بعد العمل',
      'الأربعاء 10:00–12:00 — استراحة الصباح',
      'الجمعة 16:00–19:00 — ما قبل نهاية الأسبوع'
    ];
    const low=[
      'يوميًا 09:00–11:00 — صباحًا',
      'يوميًا 18:00–21:00 — مساءً',
      'اختبر الثلاثاء والخميس للحصول على نتائج أفضل'
    ];
    if(engRate >= 3) return high;
    if(engRate >= 1) return med;
    return low;
  }

  function classifyEngagement(er){
    // تقدير عام (قد يختلف حسب المجال)
    if(er >= 6) return {label:"ممتاز جدًا", tip:"حافظ على نفس النوع من المحتوى وكرر أفضل صيغة أداء."};
    if(er >= 3) return {label:"جيد جدًا", tip:"اختبر Reels/Carousel أكثر وركز على Hook أقوى."};
    if(er >= 1) return {label:"متوسط", tip:"حسّن جودة المحتوى والتوقيت والتفاعل المباشر بعد النشر."};
    return {label:"ضعيف", tip:"ابدأ بإعادة ضبط المحتوى (Hook/قيمة/CTA) وجرّب توقيت نشر جديد."};
  }

  // ---------- Main ----------
  const form = document.getElementById('calcForm');
  const output = document.getElementById('output');
  const hint = document.getElementById('validationHint');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    hint.textContent = '';

    const followers = parseInt(document.getElementById('followers').value || 0, 10);
    const nposts = Math.max(1, parseInt(document.getElementById('nposts').value || 10, 10));
    const mode = document.getElementById('mode').value;

    if(!followers || followers < 1){
      hint.textContent = 'رجاءً أدخل عدد المتابعين بشكل صحيح.';
      return;
    }

    const likesRaw = document.getElementById('likes').value;
    const commentsRaw = document.getElementById('comments').value;

    const likesArr = parseNumbersField(likesRaw);
    const commentsArr = parseNumbersField(commentsRaw);

    // Determine totals: if single number and user didn't provide a list, treat as total
    const likesTotal = (likesArr.length === 1 && !(likesRaw.includes(',') || /\s/.test(likesRaw.trim()))) ? likesArr[0] : sum(likesArr);
    const commentsTotal = (commentsArr.length === 1 && !(commentsRaw.includes(',') || /\s/.test(commentsRaw.trim()))) ? commentsArr[0] : sum(commentsArr);

    const avgLikes = (likesTotal / nposts) || 0;
    const avgComments = (commentsTotal / nposts) || 0;

    // Advanced stats if lists provided (and length>1)
    const likesList = (likesArr.length > 1) ? likesArr : [];
    const commentsList = (commentsArr.length > 1) ? commentsArr : [];

    const erFollowers = ((avgLikes + avgComments) / followers) * 100;
    const erPosts = ((avgLikes + avgComments) / Math.max(1, (avgLikes + avgComments))) * 100; // internal, not too meaningful, but keeps mode consistent

    const er = (mode === 'followers') ? erFollowers : erFollowers; // keep it consistent (followers-based is the standard)

    // Render primary
    document.getElementById('engRate').textContent = round2(er) + '%';
    document.getElementById('avgLikes').textContent = formatNumber(avgLikes);
    document.getElementById('avgComments').textContent = formatNumber(avgComments);

    // Meta line + extra stats
    const cls = classifyEngagement(er);
    document.getElementById('metaLine').textContent =
      `تقييم عام: ${cls.label} — ${cls.tip}`;

    const extra = document.getElementById('extraStats');
    extra.innerHTML = '';

    // Median & range if possible
    if(likesList.length){
      const medLikes = median(likesList);
      const p25 = percentile(likesList, 25);
      const p75 = percentile(likesList, 75);
      const minL = Math.min(...likesList), maxL = Math.max(...likesList);

      const li1 = document.createElement('li');
      li1.textContent = `إعجابات — وسيط (Median): ${formatNumber(medLikes)} | أقل/أعلى: ${formatNumber(minL)} / ${formatNumber(maxL)}`;
      extra.appendChild(li1);

      const li2 = document.createElement('li');
      li2.textContent = `إعجابات — نطاق متوازن (25%–75%): ${formatNumber(p25)} إلى ${formatNumber(p75)}`;
      extra.appendChild(li2);
    }

    if(commentsList.length){
      const medC = median(commentsList);
      const minC = Math.min(...commentsList), maxC = Math.max(...commentsList);

      const li3 = document.createElement('li');
      li3.textContent = `تعليقات — وسيط (Median): ${formatNumber(medC)} | أقل/أعلى: ${formatNumber(minC)} / ${formatNumber(maxC)}`;
      extra.appendChild(li3);
    }

    // Basic totals
    const li4 = document.createElement('li');
    li4.textContent = `إجمالي التفاعل (تقريبي): ${formatNumber(avgLikes + avgComments)} لكل منشور — على أساس N = ${nposts}`;
    extra.appendChild(li4);

    // Best times
    const times = suggestBestTimes(round2(er));
    const best = document.getElementById('bestTimes');
    best.innerHTML = '';
    times.forEach(t=>{
      const li = document.createElement('li');
      li.textContent = t;
      best.appendChild(li);
    });

    output.style.display = 'block';

    // Update URL hash for share
    history.replaceState(null, '', '#results');
    showToast('تم الحساب بنجاح ✅');
  });

  document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('account').value = '';
    document.getElementById('followers').value = '';
    document.getElementById('nposts').value = '10';
    document.getElementById('likes').value = '';
    document.getElementById('comments').value = '';
    document.getElementById('mode').value = 'followers';
    document.getElementById('validationHint').textContent = '';
    output.style.display = 'none';
    history.replaceState(null, '', ' ');
    showToast('تم المسح');
  });

  document.getElementById('copyBtn').addEventListener('click', async ()=>{
    const acc = document.getElementById('account').value || '(غير محدد)';
    const followers = document.getElementById('followers').value || '(غير محدد)';
    const nposts = document.getElementById('nposts').value || '(غير محدد)';
    const eng = document.getElementById('engRate').textContent;
    const al = document.getElementById('avgLikes').textContent;
    const ac = document.getElementById('avgComments').textContent;

    const txt =
`MarketAPro — حاسبة معدل التفاعل على إنستغرام
الحساب: ${acc}
المتابعون: ${followers}
عدد المنشورات (N): ${nposts}
معدل التفاعل: ${eng}
متوسط الإعجابات: ${al}
متوسط التعليقات: ${ac}
الرابط: https://marketapro.com/tools/instagram-engagement-calculator/`;

    try{
      await navigator.clipboard.writeText(txt);
      showToast('تم نسخ النتائج ✅');
    }catch(err){
      alert('تعذر النسخ تلقائيًا. انسخ النص يدويًا:\n\n' + txt);
    }
  });

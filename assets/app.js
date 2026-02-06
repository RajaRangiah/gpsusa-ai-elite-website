(function(){
  const btn = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if(btn && menu){
    btn.addEventListener('click', ()=>{
      const open = menu.style.display === 'block';
      menu.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!open));
    });
  }

  document.querySelectorAll('[data-copy]').forEach(el=>{
    el.addEventListener('click', async ()=>{
      const txt = el.getAttribute('data-copy');
      try{
        await navigator.clipboard.writeText(txt);
        const old = el.textContent;
        el.textContent = "Copied";
        setTimeout(()=>el.textContent = old, 1200);
      }catch(e){}
    });
  });

  // KPI count-up
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = Number(el.getAttribute('data-count'));
    if(!Number.isFinite(target)) return;
    const suffix = el.getAttribute('data-suffix') || "";
    const prefix = el.getAttribute('data-prefix') || "";
    const duration = 700;
    const start = performance.now();
    function tick(t){
      const p = Math.min(1, (t-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.round(target * eased);
      el.textContent = `${prefix}${val}${suffix}`;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // Architecture diagram modal
  const modal = document.querySelector('[data-arch-modal]');
  if(modal){
    const titleEl = modal.querySelector('[data-arch-title]');
    const descEl = modal.querySelector('[data-arch-desc]');
    const closeBtn = modal.querySelector('[data-arch-close]');
    const nodes = document.querySelectorAll('[data-arch-node]');
    const content = {
      workloads: {
        t: "Workloads → Cost Envelope",
        d: "Agentic apps, RAG, batch, fine-tuning, evaluation. Each request class is mapped to an SLA tier and a token-cost envelope so the platform can enforce business constraints in real time."
      },
      runtime: {
        t: "Runtime → Tokens/sec/$",
        d: "Inference/training runtime optimizations (vLLM-class serving, attention efficiency, cache strategy, batching) aimed at maximizing tokens/sec/$ while protecting tail latency."
      },
      scheduler: {
        t: "Scheduler → Deterministic SLOs",
        d: "Queueing, placement, bin-packing, tiered GPU pools, and noisy-neighbor protections so p99 latency stays stable even under multi-tenant contention."
      },
      governance: {
        t: "Governance Control Plane",
        d: "Policy + accounting layer enforcing quotas, fairness, isolation, and spend constraints across AWS/Azure/GCP/on-prem—decoupled from any one vendor’s scheduler."
      },
      economics: {
        t: "Observability & Unit Economics",
        d: "Dashboards for tokens/sec/$, cost-per-token, GPU-seconds fairness, waste leakage, and capacity planning. Finance and engineering share one truth."
      },
    };
    function open(key){
      const c = content[key] || content.economics;
      titleEl.textContent = c.t;
      descEl.textContent = c.d;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
    }
    function close(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    }
    nodes.forEach(el=>{
      el.addEventListener('click', ()=>open(el.getAttribute('data-arch-node')));
      el.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter' || e.key === ' ') open(el.getAttribute('data-arch-node'));
      });
    });
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
    window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  }
})();
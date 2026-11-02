(() => {
  const btnSim = document.getElementById("btnSim");
  const btnNao = document.getElementById("btnNao");
  const btnRepetir = document.getElementById("btnRepetir");
  const pedido = document.getElementById("pedido");
  const resposta = document.getElementById("resposta");
  const dica = document.getElementById("dica");
  const bgHearts = document.getElementById("bgHearts");

  const CORES = ["#8B0000", "#DC143C", "#FADADD", "#B76E79", "#FF0066"];
  const EMOJIS = ["💖", "💗", "💕", "❤️", "💘", "🌹", "♥"];

  const frases = [
    "Ops, escorreguei! 😅",
    "Quase! Tente de novo 😉",
    "Esse botão é tímido…",
    "Não dá pra clicar nele 💘",
    "Você sabe qual é o certo 😏",
    "Ele não gosta de ser clicado!",
    "Tá difícil, né? 🌹",
    "Que tal o botão Sim? 💖",
  ];

  let fugas = 0;
  let escala = 1;

  /* ---------- Corações de fundo ---------- */
  function criarCoracaoFundo() {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > 0.3 ? "♥" : "♡";
    const tamanho = 12 + Math.random() * 26;
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = tamanho + "px";
    h.style.color = CORES[Math.floor(Math.random() * CORES.length)];
    h.style.setProperty("--op", (0.25 + Math.random() * 0.5).toFixed(2));
    h.style.setProperty("--drift", (Math.random() * 120 - 60).toFixed(0) + "px");
    h.style.setProperty("--rot", (Math.random() * 60 - 30).toFixed(0) + "deg");
    h.style.animationDuration = 7 + Math.random() * 8 + "s";
    bgHearts.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
  setInterval(criarCoracaoFundo, 450);
  for (let i = 0; i < 10; i++) setTimeout(criarCoracaoFundo, i * 120);

  /* ---------- Botão "Não" que foge ---------- */
  function fugir(x, y) {
    const margem = 12;
    const w = btnNao.offsetWidth;
    const h = btnNao.offsetHeight;
    const maxX = window.innerWidth - w - margem;
    const maxY = window.innerHeight - h - margem;

    btnNao.classList.add("fugindo");

    let novoX, novoY, tentativas = 0;
    do {
      novoX = margem + Math.random() * Math.max(0, maxX - margem);
      novoY = margem + Math.random() * Math.max(0, maxY - margem);
      tentativas++;
      // garante que o novo lugar fique longe do ponteiro/toque
    } while (
      x != null &&
      Math.hypot(novoX + w / 2 - x, novoY + h / 2 - y) < 180 &&
      tentativas < 40
    );

    btnNao.style.left = novoX + "px";
    btnNao.style.top = novoY + "px";

    fugas++;
    dica.textContent = frases[fugas % frases.length];

    // o "Sim" cresce um pouquinho a cada fuga
    escala = Math.min(1.7, escala + 0.07);
    btnSim.style.transform = `scale(${escala})`;
  }

  // posição inicial: mantém o botão no layout até a primeira fuga
  function reagir(e) {
    const p = e.touches ? e.touches[0] : e;
    fugir(p.clientX, p.clientY);
  }

  btnNao.addEventListener("mouseenter", reagir);
  btnNao.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") reagir(e);
  });
  btnNao.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    reagir(e);
  });
  btnNao.addEventListener("touchstart", (e) => {
    e.preventDefault();
    reagir(e);
  }, { passive: false });
  btnNao.addEventListener("focus", () => {
    btnNao.blur();
    fugir();
  });
  btnNao.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    reagir(e);
  });

  // Foge antes mesmo do mouse encostar (zona de proximidade)
  document.addEventListener("mousemove", (e) => {
    if (resposta.classList.contains("oculto") === false) return;
    const r = btnNao.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < 90) fugir(e.clientX, e.clientY);
  });

  // Se a janela mudar de tamanho, mantém o botão visível
  window.addEventListener("resize", () => {
    if (btnNao.classList.contains("fugindo")) fugir();
  });

  /* ---------- Botão "Sim" ---------- */
  function explosao(qtd = 70) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < qtd; i++) {
      const h = document.createElement("span");
      h.className = "burst-heart";
      h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const tamanho = 18 + Math.random() * 30;
      h.style.fontSize = tamanho + "px";
      h.style.color = CORES[Math.floor(Math.random() * CORES.length)];
      h.style.left = cx + "px";
      h.style.top = cy + "px";
      document.body.appendChild(h);

      const ang = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * Math.min(window.innerWidth, 700) * 0.55;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 80;
      const rot = Math.random() * 360 - 180;
      const dur = 1400 + Math.random() * 1400;

      const anim = h.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.2) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rot}deg)`, opacity: 1, offset: 0.6 },
          { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 220}px)) scale(0.8) rotate(${rot * 1.3}deg)`, opacity: 0 },
        ],
        { duration: dur, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" }
      );
      anim.onfinish = () => h.remove();
    }
  }

  function chuvaDeCoracoes(duracao = 6000) {
    const fim = Date.now() + duracao;
    const timer = setInterval(() => {
      if (Date.now() > fim) return clearInterval(timer);
      for (let i = 0; i < 3; i++) criarCoracaoFundo();
    }, 120);
  }

  btnSim.addEventListener("click", () => {
    pedido.classList.add("oculto");
    btnNao.classList.remove("fugindo");
    resposta.classList.remove("oculto");
    // reinicia animação de entrada
    resposta.style.animation = "none";
    void resposta.offsetWidth;
    resposta.style.animation = "";

    explosao(80);
    setTimeout(() => explosao(50), 500);
    setTimeout(() => explosao(40), 1100);
    chuvaDeCoracoes();
  });

  /* ---------- Repetir ---------- */
  btnRepetir.addEventListener("click", () => {
    resposta.classList.add("oculto");
    pedido.classList.remove("oculto");
    btnNao.classList.remove("fugindo");
    btnNao.style.left = "";
    btnNao.style.top = "";
    btnSim.style.transform = "";
    escala = 1;
    fugas = 0;
    dica.innerHTML = "&nbsp;";
  });
})();

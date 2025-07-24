document.addEventListener("DOMContentLoaded", function () {
  let minigameInterval;

  function tocarSomAleatorioDoMago() {
    const idsDosSons = [
      "som-mago-1",
      "som-mago-2",
      "som-mago-3",
      "som-mago-4",
      "som-mago-5",
      "som-mago-6",
      "som-mago-7",
      "som-mago-8",
    ];
    const idAleatorio =
      idsDosSons[Math.floor(Math.random() * idsDosSons.length)];
    const som = document.getElementById(idAleatorio);
    if (som) {
      som.currentTime = 0;
      som.play().catch((error) => console.error("Erro ao tocar som:", error));
    }
  }

  // --- NOVA FUNÇÃO PARA O SOM DO TIRO ---
  function tocarSomDoTiro() {
    const somTiro = document.getElementById("som-magia-tiro");
    if (somTiro) {
      somTiro.currentTime = 0;
      somTiro
        .play()
        .catch((error) => console.error("Erro ao tocar som de tiro:", error));
    }
  }

  function criarMaguinho() {
    const maguinho = document.createElement("div");
    maguinho.className = "maguinho-alvo";

    const tamanho = Math.random() * 30 + 90;
    maguinho.style.width = `${tamanho}px`;
    maguinho.style.height = `${tamanho}px`;

    const margemDeSeguranca = 30;
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    const areaProibidaLargura = 500;
    const areaProibidaAltura = 400;
    let x, y;
    do {
      const areaXSpawn = window.innerWidth - tamanho - margemDeSeguranca * 2;
      const areaYSpawn = window.innerHeight - tamanho - margemDeSeguranca * 2;
      x = Math.random() * areaXSpawn + margemDeSeguranca;
      y = Math.random() * areaYSpawn + margemDeSeguranca;
    } while (x > centroX - areaProibidaLargura / 2 && x < centroX + areaProibidaLargura / 2 && y > centroY - areaProibidaAltura / 2 && y < centroY + areaProibidaAltura / 2);
    maguinho.style.left = x + "px";
    maguinho.style.top = y + "px";

    const animacoes = [
      "movimento-flutuante",
      "movimento-diagonal",
      "movimento-rapido",
    ];
    const animacaoAleatoria =
      animacoes[Math.floor(Math.random() * animacoes.length)];
    maguinho.classList.add(animacaoAleatoria);

    const tempoDeVida = Math.random() * 3000 + 10000;
    const autoRemoveTimer = setTimeout(() => {
      // Quando o tempo acaba, toca SÓ o som do mago desaparecendo
      tocarSomAleatorioDoMago();
      maguinho.classList.add("desaparecendo");
      setTimeout(() => maguinho.remove(), 500);
    }, tempoDeVida);

    // --- LÓGICA DE CLIQUE ATUALIZADA ---
    maguinho.addEventListener("click", () => {
      // 1. Toca o som do tiro imediatamente
      tocarSomDoTiro();

      // 2. Toca o som do grito do mago um pouquinho depois, para não sobrepor totalmente
      setTimeout(() => {
        tocarSomAleatorioDoMago();
      }, 20); // Atraso de 50 milissegundos

      clearTimeout(autoRemoveTimer);
      maguinho.classList.add("clicado");
      setTimeout(() => {
        maguinho.remove();
      }, 500);
    });

    document.body.appendChild(maguinho);
  }

  function iniciarMinigame() {
    if (minigameInterval) clearInterval(minigameInterval);
    minigameInterval = setInterval(() => {
      criarMaguinho();
    }, Math.random() * 2000 + 1500);
  }

  window.pararMinigame = function () {
    clearInterval(minigameInterval);
    document.querySelectorAll(".maguinho-alvo").forEach((m) => m.remove());
  };

  iniciarMinigame();
});

window.cliques = 0;
let sequenciaFinalizada = false;

window.metaDeMagos = 50;

const contador = document.getElementById("clickCounter");
const carta = document.getElementById("carta");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const card = document.getElementById("cardNivel1");
const somRaio = document.getElementById("somRaio");
const wandSound = document.getElementById("wandSound");
const radioSignal = document.getElementById("radioSignal");

// Atualiza a meta na tela
document.addEventListener("DOMContentLoaded", () => {
  const metaDisplay = document.getElementById("metaDisplay");
  if (metaDisplay) metaDisplay.textContent = `Meta: ${window.metaDeMagos}`;
});

function adicionarMagosExpurgados(quantidade) {
  if (sequenciaFinalizada || !jogoAtivo) return;

  window.cliques += quantidade;
  contador.textContent = `Maguinhos Expurgados: ${window.cliques}`;

  // VERIFICA SE ATINGIU A META DE VITÓRIA
  if (window.cliques >= window.metaDeMagos) {
    if (!sequenciaFinalizada) {
      // Garante que a vitória só seja chamada uma vez
      vitoriaMinigame();
    }
  }
}

document.addEventListener("click", function (e) {
  if (sequenciaFinalizada) return;

  if (
    !e.target.classList.contains("maguinho-alvo") &&
    !e.target.closest(".envelope-wrapper")
  ) {
    wandSound.currentTime = 0;
    wandSound.play().catch(() => {});
  }
});

function iniciarSequenciaSinistra() {
  pararMinigame();
  document.body.style.pointerEvents = "none";

  somRaio.currentTime = 0;
  somRaio.volume = 1;
  somRaio.play().catch(() => {});

  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.width = "100vw";
  flash.style.height = "100vh";
  flash.style.backgroundColor = "white";
  flash.style.opacity = 0;
  flash.style.zIndex = 99998;
  flash.style.transition = "opacity 0.1s ease-in-out";
  flash.id = "flashEffect";
  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = 1;
    document.body.classList.add("tremor");
  }, 50);

  setTimeout(() => {
    flash.style.opacity = 0;
  }, 400);

  setTimeout(() => {
    document.body.classList.remove("tremor");
  }, 4500);

  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const raio = document.createElement("div");
      raio.classList.add("raio");
      raio.style.left = `${Math.random() * 100}%`;
      document.body.appendChild(raio);
      setTimeout(() => raio.remove(), 600);
    }, i * 150 + 200);
  }

  document.body.style.transition = "background 0.1s";
  const glitchInterval = setInterval(() => {
    document.body.style.background = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
  }, 50);

  setTimeout(() => {
    clearInterval(glitchInterval);
    document.body.style.background = "#000";
  }, 800);

  const onRaioEnd = () => {
    somRaio.removeEventListener("ended", onRaioEnd);

    // ... (todo o código de remoção de elementos permanece igual) ...

    // Mostra a tela quebrada
    const tela = document.getElementById("telaQuebrada");
    if (tela) {
      tela.style.display = "block";
      tela.style.zIndex = 99999;
    }

    // Remove todos os outros elementos
    document
      .querySelectorAll("body > *:not(#telaQuebrada):not(audio)")
      .forEach((el) => el.remove());

    // Agora sim: trava tudo
    finalizarTudo();

    const restartBtn = document.getElementById("restartButton");
    if (restartBtn) {
      restartBtn.textContent = "Reiniciar"; // Define o texto de derrota
      restartBtn.classList.remove("hidden");
    }
  };

  somRaio.addEventListener("ended", onRaioEnd);
}

function finalizarTudo() {
  // Trava cursor e interação
  document.body.style.cursor = "none";
  sequenciaFinalizada = true;

  // Camada transparente pra bloquear tudo
  const bloqueio = document.createElement("div");
  bloqueio.style.position = "fixed";
  bloqueio.style.top = 0;
  bloqueio.style.left = 0;
  bloqueio.style.width = "100vw";
  bloqueio.style.height = "100vh";
  bloqueio.style.zIndex = 100000;
  bloqueio.style.cursor = "none";
  bloqueio.style.background = "transparent";
  document.body.appendChild(bloqueio);

  // Inicia o som de rádio
  if (radioSignal) {
    radioSignal.loop = true;
    radioSignal.currentTime = 0;
    radioSignal.play().catch(() => {});
  }
}

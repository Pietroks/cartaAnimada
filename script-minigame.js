// --- VARIÁVEIS DE ESTADO DO JOGO ---
let jogoAtivo = true;
const limiteDeEscapes = 15; // Se 10 magos escaparem, o jogador perde
let magosEscaparam = 0;

const somVitoria = document.getElementById("som-vitoria");

// Função chamada quando o jogador PERDE
function derrotaMinigame() {
  if (!jogoAtivo) return;
  console.log("Derrota!");
  jogoAtivo = false;
  pararMinigame();
  // Chama a sequência sinistra como consequência
  iniciarSequenciaSinistra();
}

// Função chamada quando o jogador VENCE
function vitoriaMinigame() {
  if (!jogoAtivo) return;
  console.log("Vitória!");
  jogoAtivo = false;
  window.minigameAtivo = false; // "Destrava" a carta no script.js

  if (document.body.classList.contains("light-off")) {
    document.body.classList.remove("light-off");
  }

  // Toca o som da vitória
  const somVitoria = document.getElementById("som-vitoria");
  if (somVitoria) {
    somVitoria.currentTime = 0;
    somVitoria.play().catch((e) => {});
  }

  pararMinigame();

  // Efeito visual de recompensa na carta
  const envelope = document.getElementById("envelopeWrapper");
  if (envelope) envelope.classList.add("vitoria");

  // Esconde os contadores do minigame
  document.getElementById("metaDisplay").style.display = "none";
  document.getElementById("escapesDisplay").style.display = "none";
  document.getElementById("clickCounter").textContent =
    "Recompensa Desbloqueada!";

  // MOSTRA O BOTÃO DE REINICIAR IMEDIATAMENTE APÓS A VITÓRIA
  window.dispatchEvent(new CustomEvent("vitoriaDoJogo"));

  const restartBtn = document.getElementById("restartButton");
  if (restartBtn) {
    restartBtn.textContent = "Jogar Novamente"; // Define o texto de vitória
    restartBtn.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const escapesDisplay = document.getElementById("escapesDisplay");
  escapesDisplay.textContent = `Escaparam: 0 / ${limiteDeEscapes}`;
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
      "som-mago-9",
      "som-mago-10",
      "som-mago-11",
      "som-mago-12",
      "som-mago-13",
      "som-mago-14",
    ];
    const idAleatorio =
      idsDosSons[Math.floor(Math.random() * idsDosSons.length)];
    const som = document.getElementById(idAleatorio);
    if (som) {
      som.currentTime = 0;
      som.play().catch((error) => console.error("Erro ao tocar som:", error));
    }
  }

  const somTiro = document.getElementById("som-magia-tiro");
  const somMagoDourado = document.getElementById("som-mago-dourado");
  const somFantasmaTeleporte = document.getElementById(
    "som-fantasma-teleporte"
  );
  const somTeleporte = document.getElementById("som-teleporte");
  const somMagoScape = document.getElementById("som-mago-escape");
  const somSuperMorte = document.getElementById("maguinho-super-morte");
  const somSuperScape = document.getElementById("som-super-escape");
  const somKamehameha = document.getElementById("som-kamehameha");
  const laser = document.getElementById("kamehameha-laser");

  function dispararKamehameha(maguinho) {
    if (!maguinho || !laser) return;

    // Pega a posição do mago e o centro da tela
    const rect = maguinho.getBoundingClientRect();
    const mageX = rect.left + rect.width / 2;
    const mageY = rect.top + rect.height / 2;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calcula o ângulo entre o mago e o centro da tela
    const deltaX = centerX - mageX;
    const deltaY = centerY - mageY;
    const radianos = Math.atan2(deltaY, deltaX); // Ângulo em radianos
    const graus = (radianos * 180) / Math.PI; // Converte para graus

    // Posiciona o laser no centro do mago
    const laserHeight = 60; // A altura do laser definida no CSS
    laser.style.top = `${mageY - laserHeight / 2}px`;
    laser.style.left = `${mageX}px`;

    // Define a variável CSS com o ângulo calculado
    laser.style.setProperty("--laser-angle", `${graus}deg`);

    // Ativa a animação de disparo
    laser.classList.add("disparando");

    // Limpa a animação depois que ela termina
    setTimeout(() => {
      laser.classList.remove("disparando");
    }, 500);
  }

  function iniciarEventoKamehameha(maguinho) {
    maguinho.classList.remove("movimento-super");
    maguinho.classList.add("carregando-poder");

    somKamehameha.currentTime = 0;
    somKamehameha.play();

    const duracaoKamehameha = 10000; // 10 segundos
    const kamehamehaTimer = setTimeout(() => {
      if (document.body.contains(maguinho)) {
        // ATUALIZADO: Dispara o laser antes de chamar a derrota
        dispararKamehameha(maguinho);
        // Um pequeno delay para o laser ser visto antes da tela quebrar
        setTimeout(() => {
          // ATUALIZADO: Passa o mago vitorioso para a função de derrota
          derrotaMinigame(maguinho);
        }, 400);
      }
    }, duracaoKamehameha);

    maguinho.kamehamehaTimer = kamehamehaTimer;
  }

  function criarMaguinho() {
    if (!jogoAtivo) return;
    const maguinho = document.createElement("div");
    maguinho.className = "maguinho-alvo";

    // --- LÓGICA DE SPAWN (permanece a mesma) ---
    const tamanho = Math.random() * 30 + 90;
    maguinho.style.width = `${tamanho}px`;
    maguinho.style.height = `${tamanho}px`;
    const margemDeSeguranca = 30;
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    const areaProibidaLargura = 500;
    const areaProibidaAltura = 400;
    let x, y;
    const calcularPosicao = () => {
      const areaXSpawn = window.innerWidth - tamanho - margemDeSeguranca * 2;
      const areaYSpawn = window.innerHeight - tamanho - margemDeSeguranca * 2;
      x = Math.random() * areaXSpawn + margemDeSeguranca;
      y = Math.random() * areaYSpawn + margemDeSeguranca;
    };
    do {
      calcularPosicao();
    } while (x > centroX - areaProibidaLargura / 2 && x < centroX + areaProibidaLargura / 2 && y > centroY - areaProibidaAltura / 2 && y < centroY + areaProibidaAltura / 2);
    maguinho.style.left = x + "px";
    maguinho.style.top = y + "px";

    // --- LÓGICA DE TIPO DE MAGO (permanece a mesma) ---
    let tipoMago;
    const chance = Math.random();

    if (chance < 0.05) {
      // 5% de chance para o Super Maguinho
      tipoMago = "super";
      maguinho.classList.add("mago-super", "movimento-super");

      // Chance muito rara (10% dos Super Magos) de iniciar o evento Kamehameha
      if (Math.random() < 0.75) {
        maguinho.dataset.evento = "kamehameha";
        maguinho.dataset.kamehamehaHits = 0; // Contador de hits
        // O evento começará após 3 segundos
        setTimeout(() => {
          // Só inicia se o mago ainda estiver na tela
          if (document.body.contains(maguinho)) {
            iniciarEventoKamehameha(maguinho);
          }
        }, 3000);
      }
    } else if (chance < 0.15) {
      // 10% de chance para o Dourado
      tipoMago = "dourado";
      maguinho.classList.add("mago-dourado", "movimento-dourado");
    } else if (chance < 0.3) {
      tipoMago = "fantasma";
      maguinho.classList.add("mago-fantasma", "movimento-fantasma"); // <-- CORREÇÃO: Adiciona movimento
      const vidas = Math.random() < 0.5 ? 3 : 4;
      maguinho.dataset.vidas = vidas;
    } else {
      tipoMago = "comum";
      const animacoes = [
        "movimento-flutuante",
        "movimento-diagonal",
        "movimento-rapido",
      ];
      const animacaoAleatoria =
        animacoes[Math.floor(Math.random() * animacoes.length)];
      maguinho.classList.add(animacaoAleatoria);
    }

    let tempoDeVida;
    if (tipoMago === "super") {
      tempoDeVida = Math.random() * 5000 + 15000; // Super dura de 15 a 20 segundos
    } else {
      tempoDeVida = Math.random() * 3000 + 10000; // Outros duram de 10 a 13 segundos
    }

    const autoRemoveTimer = setTimeout(() => {
      // --- Lógica de Escape (ATUALIZADA) ---
      if (tipoMago === "super") {
        const penalidade = Math.random() < 0.5 ? 2 : 3;
        magosEscaparam += penalidade; // Adiciona a penalidade
        // Toca um som de risada mais imponente (reutilizando o do dourado, por exemplo)
        if (somSuperScape) somSuperScape.play().catch((e) => {});
      } else {
        magosEscaparam++; // Escape normal
        if (somMagoScape) somMagoScape.play().catch((e) => {});
      }

      // Atualiza a interface e verifica a derrota
      escapesDisplay.textContent = `Escaparam: ${magosEscaparam} / ${limiteDeEscapes}`;
      if (magosEscaparam >= limiteDeEscapes) {
        derrotaMinigame();
      }

      maguinho.classList.add("desaparecendo");
      setTimeout(() => maguinho.remove(), 500);
    }, tempoDeVida);

    // --- LÓGICA DE CLIQUE ATUALIZADA ---
    maguinho.addEventListener("click", (event) => {
      event.stopPropagation();
      if (
        maguinho.dataset.evento === "kamehameha" &&
        maguinho.classList.contains("carregando-poder")
      ) {
        somTiro.currentTime = 0;
        somTiro.play(); // Toca o som do tiro
        let hits = parseInt(maguinho.dataset.kamehamehaHits) + 1;
        maguinho.dataset.kamehamehaHits = hits;

        if (hits >= 30) {
          // SUCESSO!
          clearTimeout(maguinho.kamehamehaTimer); // Cancela a derrota
          somKamehameha.pause(); // Para o som de carregar
          clearTimeout(autoRemoveTimer); // Cancela o auto-escape

          adicionarMagosExpurgados(25); // Recompensa enorme!
          if (somSuperMorte) somSuperMorte.play();

          maguinho.classList.remove("carregando-poder");
          maguinho.classList.add("clicado");
          setTimeout(() => maguinho.remove(), 500);
        }
        return; // Impede que a lógica abaixo execute
      }

      clearTimeout(autoRemoveTimer);

      // Toca o som do tiro em todos os cliques válidos em magos
      somTiro.currentTime = 0;
      somTiro.play().catch((e) => {});

      switch (tipoMago) {
        case "super":
          adicionarMagosExpurgados(10);
          if (somSuperMorte) somSuperMorte.play();
          maguinho.classList.add("clicado");
          setTimeout(() => maguinho.remove(), 500);
          break;
        case "dourado":
          adicionarMagosExpurgados(5);
          somMagoDourado.currentTime = 0;
          somMagoDourado.play().catch((e) => {});
          maguinho.classList.add("clicado");
          setTimeout(() => maguinho.remove(), 500);
          break;
        case "fantasma":
          let vidasAtuais = parseInt(maguinho.dataset.vidas, 10);
          vidasAtuais--;

          if (vidasAtuais <= 0) {
            // GOLPE FINAL
            adicionarMagosExpurgados(3);
            tocarSomAleatorioDoMago(); // Som de morte
            maguinho.classList.add("clicado"); // Animação de morte
            setTimeout(() => maguinho.remove(), 500);
          } else {
            // AINDA TEM VIDAS, TELEPORTA
            maguinho.dataset.vidas = vidasAtuais; // Atualiza as vidas restantes

            // Mantém o som do teleporte
            if (somFantasmaTeleporte) {
              somFantasmaTeleporte.currentTime = 0;
              somFantasmaTeleporte.play().catch((e) => {});
              somTeleporte.currentTime = 0;
              somTeleporte.play().catch((e) => {});
            }

            maguinho.classList.add("teleportando");
            setTimeout(() => {
              // A função de calcular posição precisa estar acessível aqui
              // Vamos garantir que esteja
              const tamanho = parseFloat(maguinho.style.width);
              const margemDeSeguranca = 30;
              const centroX = window.innerWidth / 2;
              const centroY = window.innerHeight / 2;
              const areaProibidaLargura = 500;
              const areaProibidaAltura = 400;
              let x, y;
              do {
                const areaXSpawn =
                  window.innerWidth - tamanho - margemDeSeguranca * 2;
                const areaYSpawn =
                  window.innerHeight - tamanho - margemDeSeguranca * 2;
                x = Math.random() * areaXSpawn + margemDeSeguranca;
                y = Math.random() * areaYSpawn + margemDeSeguranca;
              } while (
                x > centroX - areaProibidaLargura / 2 &&
                x < centroX + areaProibidaLargura / 2 &&
                y > centroY - areaProibidaAltura / 2 &&
                y < centroY + areaProibidaAltura / 2
              );

              maguinho.style.left = x + "px";
              maguinho.style.top = y + "px";
              maguinho.classList.remove("teleportando");
            }, 300);
          }
          break;
        default: // Mago Comum
          adicionarMagosExpurgados(1);
          setTimeout(() => {
            tocarSomAleatorioDoMago();
          }, 50);
          maguinho.classList.add("clicado");
          setTimeout(() => maguinho.remove(), 500);
          break;
      }
    });

    document.body.appendChild(maguinho);
  }

  function iniciarMinigame() {
    if (minigameInterval) clearTimeout(minigameInterval);
    function cicloDeSpawn() {
      // Se o jogo não estiver mais ativo, para o loop
      if (!jogoAtivo) return;

      // Calcula o progresso do jogador (de 0.0 a 1.0)
      const progresso = (window.cliques || 0) / window.metaDeMagos;

      // O tempo de espera DIMINUI conforme o progresso AUMENTA
      const tempoMaximo = 2000 - 1800 * progresso;
      const tempoMinimo = 1000 - 900 * progresso; // Começa em 1.0s, termina em 0.1s

      // Gera o próximo mago
      criarMaguinho();

      // Agenda o próximo ciclo de spawn
      const proximoSpawn =
        Math.random() * (tempoMaximo - tempoMinimo) + tempoMinimo;
      minigameInterval = setTimeout(cicloDeSpawn, proximoSpawn);
    }

    // Inicia o primeiro ciclo
    cicloDeSpawn();
  }

  window.pararMinigame = function (excecao) {
    clearTimeout(minigameInterval);
    document.querySelectorAll(".maguinho-alvo").forEach((m) => {
      // Só remove o mago se ele NÃO for a exceção
      if (m !== excecao) {
        m.remove();
      }
    });
  };

  iniciarMinigame();
});

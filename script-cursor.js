document.addEventListener("DOMContentLoaded", () => {
  const cursorFalso = document.getElementById("cursor-falso");

  if (cursorFalso) {
    window.addEventListener("mousemove", (e) => {
      // Atualiza a posição do nosso div para seguir as coordenadas do mouse
      cursorFalso.style.left = e.clientX + "px";
      cursorFalso.style.top = e.clientY + "px";
    });

    // Opcional: esconde o cursor falso se o mouse sair da janela
    document.addEventListener("mouseleave", () => {
      cursorFalso.style.display = "none";
    });
    document.addEventListener("mouseenter", () => {
      cursorFalso.style.display = "block";
    });
  }
});

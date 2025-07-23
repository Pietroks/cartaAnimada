document.addEventListener("DOMContentLoaded", () => {
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const letter = document.getElementById("letter");
  const envelope = document.getElementById("envelope");
  const cardNivel1 = document.getElementById("cardNivel1");
  const body = document.body;

  let isOpen = false;
  let isFollowingMouse = true;
  let isAnimating = false;

  const handleCardClick = () => {
    window.location.href =
      "https://melhoreseusresultados.com.br/inscricao-escola-de-programadores";
  };

  const handleCardHover = () => {
    gsap.to(cardNivel1, {
      scale: 1.05, // Efeito de zoom sutil
      y: -100, // Levanta um pouco
      boxShadow: "0 15px 45px rgba(137, 7, 189, 0.3)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleCardHoverOut = () => {
    gsap.to(cardNivel1, {
      scale: 1,
      y: 0,
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Volta para a sombra original
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (e) => {
    if (!isFollowingMouse) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const x = gsap.utils.mapRange(0, innerWidth, -50, 50, clientX);
    const y = gsap.utils.mapRange(0, innerHeight, -30, 30, clientY);
    const rotateX = gsap.utils.mapRange(0, innerHeight, 15, -15, clientY);
    const rotateY = gsap.utils.mapRange(0, innerWidth, -15, 15, clientX);
    gsap.to(envelopeWrapper, {
      x,
      y,
      rotateX,
      rotateY,
      duration: 1.5,
      ease: "power2.out",
    });

    const mouseXPercent = (clientX / innerWidth) * 100;
    const mouseYPercent = (clientY / innerHeight) * 100;
    body.style.setProperty("--mouse-x", `${mouseXPercent}%`);
    body.style.setProperty("--mouse-y", `${mouseYPercent}%`);
  };
  window.addEventListener("mousemove", handleMouseMove);

  body.addEventListener("click", (event) => {
    // Verifica se o clique foi no envelope ou em algo dentro dele.
    // Se foi, a função para aqui e não faz nada.
    if (event.target.closest(".envelope-wrapper")) {
      return;
    }

    // Se a carta já estiver aberta, não permite apagar a luz.
    if (isOpen) {
      return;
    }

    // Se não foi no envelope, alterna a classe 'light-off' no body.
    body.classList.toggle("light-off");
  });

  function createTimelines() {
    const openTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        isAnimating = true;
        isFollowingMouse = false;
      },
      onComplete: () => {
        isAnimating = false;
        isFollowingMouse = true;
        cardNivel1.style.pointerEvents = "auto";
        cardNivel1.addEventListener("click", handleCardClick);
        cardNivel1.addEventListener("mouseenter", handleCardHover);
        cardNivel1.addEventListener("mouseleave", handleCardHoverOut);
      },
    });

    openTimeline
      .to(envelopeWrapper, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(
        [".envelope-front", ".envelope-back"],
        {
          opacity: 0,
          duration: 0.5,
          ease: "power1.in",
        },
        "start"
      )
      .to(
        [".envelope-open-top", ".envelope-open-bottom", ".envelope-middle"],
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
        },
        "start"
      )
      .to(
        letter,
        {
          y: -280,
          z: 280,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        "start+=0.3"
      )
      .to(
        envelope,
        {
          z: -600,
          y: 180,
          scale: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        "<"
      )
      .set(letter, { zIndex: 10 }, ">-0.4")
      .to(
        ".letter-top",
        { rotateX: 0, duration: 0.8, ease: "power2.inOut" },
        "<"
      )
      .to(
        ".letter-bottom",
        { rotateX: 0, duration: 0.8, ease: "power2.inOut" },
        "<+=0.2"
      )
      .to(
        letter,
        {
          scale: window.innerWidth < 768 ? 1.5 : 2,
          y: -window.innerHeight * 0.15,
          transformOrigin: "center 90%",
          width: "100%",
          height: "200%",
          duration: 1.2,
          ease: "power2.out",
        },
        "<+=0.2"
      )
      .to(
        letter,
        {
          boxShadow: "0 0 50px rgba(255, 255, 255, 0.3)",
          duration: 1,
        },
        "<"
      )
      .fromTo(
        cardNivel1,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          width: "100%",
          height: "100%",
          top: "110%",
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "<+=0.3"
      );

    const closeTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        isAnimating = true;
        isFollowingMouse = false;
        cardNivel1.style.pointerEvents = "none";
        cardNivel1.removeEventListener("click", handleCardClick);
        cardNivel1.removeEventListener("mouseenter", handleCardHover);
        cardNivel1.removeEventListener("mouseleave", handleCardHoverOut);
      },
      onComplete: () => {
        isAnimating = false;
        isFollowingMouse = true;
      },
    });

    closeTimeline
      .to(
        cardNivel1,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
          duration: 0.5,
          ease: "power1.inOut",
        },
        "fold"
      )
      .to(
        letter,
        {
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.5,
        },
        "fold"
      )
      .to(
        letter,
        {
          scale: 1,
          width: "90%",
          height: "250px",
          y: -300,
          duration: 1,
          ease: "power2.inOut",
        },
        "fold+=0.1"
      )
      .to(
        ".letter-top",
        {
          rotateX: -180,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "fold+=0.4"
      )
      .to(
        ".letter-bottom",
        {
          rotateX: 180,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "fold+=0.6"
      )
      .to(
        letter,
        {
          y: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        "fold+=1.1"
      )
      .set(letter, { zIndex: 3 }, "fold+=1.0")
      .to(
        envelope,
        {
          z: 0,
          y: 0,
          scale: 1,
          transformOrigin: "center center",
          duration: 1,
          ease: "power2.in",
        },
        "<"
      )
      .to(
        [".envelope-open-top", ".envelope-open-bottom", ".envelope-middle"],
        {
          opacity: 0,
          duration: 0.4,
          ease: "power1.in",
        },
        "swapBack"
      )
      .to(
        [".envelope-front", ".envelope-back"],
        {
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
        },
        "swapBack"
      );

    return { openTimeline, closeTimeline };
  }

  const { openTimeline, closeTimeline } = createTimelines();

  envelopeWrapper.addEventListener("click", () => {
    if (isAnimating || body.classList.contains("light-off")) return;

    if (event.target.classList.contains("envelope-open-top") && !isOpen) {
      return;
    }

    if (isOpen) {
      closeTimeline.restart();
    } else {
      openTimeline.restart();
    }
    isOpen = !isOpen;
  });
});

document.addEventListener("click", function (e) {
  const sparkle = document.createElement("div");
  sparkle.className = "magic-click";
  sparkle.style.left = e.pageX - 20 + "px";
  sparkle.style.top = e.pageY - 20 + "px";
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 1200);
});

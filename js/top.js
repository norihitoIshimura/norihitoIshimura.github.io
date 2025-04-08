if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const isFirstVisit = sessionStorage.getItem("isFirstVisit") === null;

  const logoContainer = document.getElementById("logo-container");
  logoContainer.style.display = "block";

  const hideElements = () => {
    document
      .querySelectorAll(
        ".nav, .timeMessage,.cmyk,.tonbo,.video-play,.scroll-indicator"
      )
      .forEach((el) => (el.style.visibility = "hidden"));
  };

  const showElements = () => {
    document
      .querySelectorAll(
        ".nav, .timeMessage,.cmyk,.tonbo,.video-play,.scroll-indicator"
      )
      .forEach((el) => (el.style.visibility = "visible"));
  };

  const setupHorizontalScroll = (container, text) => {
    const textWidth = text.scrollWidth;
    const viewportWidth = window.innerWidth;
    const horizontalScrollDistance = textWidth - viewportWidth;

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${horizontalScrollDistance * 2}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        gsap.to(text, {
          x: -self.progress * horizontalScrollDistance,
          ease: "none",
          duration: 0.1,
        });
      },
    });
  };

  const setupMobileTextAnimation = (container, text) => {
    const textContent = text.textContent.trim();
    text.innerHTML = "";

    const spans = textContent.split("").map((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.position = "relative";
      text.appendChild(span);
      return span;
    });

    gsap.to(spans, {
      scrollTrigger: {
        trigger: container,
        start: "top 100%",
        end: "bottom 20%",
        scrub: true,
      },
      opacity: 1,
      stagger: 0.05,
      x: 0,
      ease: "power3.out",
      duration: 1,
    });

    gsap.fromTo(
      spans,
      {
        x: (i) => (i % 2 === 0 ? "-80vw" : "80vw"),
      },
      {
        x: "0%",
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 100%",
          end: "bottom 50%",
          scrub: true,
        },
        ease: "power2.out",
      }
    );
  };

  const setupHorizontalScrollImage = () => {
    const area = document.querySelector(".js-area");
    const wrap = document.querySelector(".js-wrap");
    const items = document.querySelectorAll(".js-item");
    const num = items.length;

    if (area && wrap && items.length > 0) {
      gsap.registerPlugin(ScrollTrigger);

      if (window.innerWidth <= 580) {
        gsap.set(wrap, {
          width: "100%",
        });

        gsap.set(items, {
          width: "100%",
          opacity: 0,
          y: 50,
          rotate: -45,
          scale: 0.1,
          height: 33 + "vh",
          marginBottom: 20 + "px",
        });

        items.forEach((item, index) => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 1.2,
            delay: index * 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      } else {
        gsap.set(wrap, { width: num * 100 + "%", marginLeft: "10%" });
        gsap.set(items, { width: 100 / num + "%" });

        gsap.to(items, {
          xPercent: -100 * (num - 1) - 10,
          ease: "none",
          scrollTrigger: {
            trigger: area,
            start: "top",
            end: "+=6000",
            pin: true,
            scrub: true,
          },
        });
      }
    }
  };

  function setupIllustAnimation() {
    const illust = document.querySelector(".illust");

    if (illust) {
      gsap.set(illust, { opacity: 0, x: "100vw", rotation: 180 });

      gsap.to(illust, {
        scrollTrigger: {
          trigger: "#workImgS",
          start: "top 90%",
          end: "top 50%",
          scrub: 1,
          markers: false,
        },
        x: 0,
        rotation: 360,
        opacity: 1,
      });
    }
  }

  if (isFirstVisit) {
    const skipButton = document.getElementById("skipButton");
    if (skipButton) {
      skipButton.style.display = "block";
      skipButton.addEventListener("click", function () {
        sessionStorage.setItem("isFirstVisit", "false");
        location.reload();
      });
    }

    document.documentElement.style.overflowY = "hidden";
    hideElements();

    new Vivus(
      "logo",
      {
        type: "delayed",
        duration: 150,
        forceRender: false,
      },
      function (obj) {
        obj.el.classList.add("done");

        const moveDelay = 1000;
        const mainActivateDelay = 3000;

        setTimeout(() => {
          if (logoContainer) {
            logoContainer.classList.add("moveFin");
          }
        }, moveDelay);

        setTimeout(() => {
          const logoBox = document.querySelector(".logoBox");
          if (logoBox) {
            logoBox.style.height = "0";
            logoBox.style.transition = "height 1.2s ease";
          }
        }, mainActivateDelay);

        setTimeout(() => {
          document.documentElement.style.overflowY = "auto";
          showElements();
          const container = document.getElementById("container");
          const text = document.getElementById("text");

          const isMobile = window.matchMedia("(max-width: 580px)").matches;

          if (!isMobile && container && text) {
            setupHorizontalScroll(container, text);
          } else if (text) {
            setupMobileTextAnimation(container, text);
          }
        }, mainActivateDelay + 1200);

        setTimeout(() => {
          setupHorizontalScrollImage();
        }, mainActivateDelay + 1200);

        setTimeout(() => {
          setupIllustAnimation();
        }, mainActivateDelay + 1200);

        setTimeout(() => {
          if (skipButton) {
            skipButton.style.display = "none";
          }
        }, mainActivateDelay);

        sessionStorage.setItem("isFirstVisit", "false");
      }
    );
  } else {
    showElements();
    if (logoContainer) {
      logoContainer.classList.add("moveFin");
    }

    const logoBox = document.querySelector(".logoBox");
    if (logoBox) {
      logoBox.style.height = "0";
    }

    const container = document.getElementById("container");
    const text = document.getElementById("text");
    const isMobile = window.matchMedia("(max-width: 580px)").matches;

    if (!isMobile && container && text) {
      setupHorizontalScroll(container, text);
    } else if (text) {
      setupMobileTextAnimation(container, text);
    }

    setupHorizontalScrollImage();
    setupIllustAnimation();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const text = document.querySelector("#genTen h4");
  const originalText = text.textContent;
  text.textContent = "";

  const spans = Array.from(originalText).map((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    text.appendChild(span);
    return span;
  });

  function randomize() {
    const randomIndex = Math.floor(Math.random() * spans.length);
    const windowWidth = window.innerWidth;
    const marginValue = windowWidth <= 580 ? 40 : 0;

    spans.forEach((span, index) => {
      const waveEffect = Math.sin((index / spans.length) * Math.PI * 2) * 10;
      const x = Math.random() * 120 - 10 - marginValue;
      const y = Math.random() * 120 - 10 + waveEffect;
      const rotation = Math.random() * 40 - 10;
      const scale =
        index === randomIndex ? 1 + (Math.random() * 1.9 - 0.15) : 1;
      const opacity = index === randomIndex ? 1.0 : 0.3;

      gsap.to(span, {
        x,
        y,
        rotation,
        scale,
        opacity,
        duration: 3,
        ease: "power1.inOut",
      });
    });

    requestAnimationFrame(() => setTimeout(randomize, 3000));
  }

  randomize();
});

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("#filterButtons li");
  const items = document.querySelectorAll(".worksMoreFlex .item");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      items.forEach((item) => {
        item.classList.add("hidden");

        setTimeout(() => {
          if (filter === "All" || item.classList.contains(filter)) {
            item.classList.remove("hidden");
          }
        }, 400);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let moveDelay;

  const isFirstVisit = sessionStorage.getItem("isFirstVisit") === null;
  if (isFirstVisit) {
    moveDelay = 6500;
  } else {
    moveDelay = 0;
  }

  let isDisplaying = false;
  let formattedTime = "";

  function updateTime() {
    const now = new Date();
    const japanTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    formattedTime = japanTime.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const timeElement = document.getElementById("formattedTime");
    if (timeElement) {
      timeElement.innerText = `TOKYO ${formattedTime}`;
    }
  }

  setInterval(updateTime);

  setTimeout(() => {
    function displayMessage() {
      if (!isDisplaying) return;

      const now = new Date();
      const japanTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
      );
      const hour = japanTime.getHours();

      let message = "";
      if (hour >= 5 && hour < 12) {
        message =
          "おはようございます。\nデザイナーのノイです。\nウェブ・デザイン制作を行っています。\nシンプルで伝わるデザインを大切にし、\n目的に応じた表現で、想いを形にします。\nウェブ・ロゴ・印刷物のデザインから、\nHTML・CSS・JSでのコーディングまで。\n伝えたい事を、より分かりやすく効果的に。";
      } else if (hour >= 12 && hour < 18) {
        message =
          "こんにちは。\nデザイナーのノイです。\nウェブ・デザイン制作を行っています。\nシンプルで伝わるデザインを大切にし、\n目的に応じた表現で、想いを形にします。\nウェブ・ロゴ・印刷物のデザインから、\nHTML・CSS・JSでのコーディングまで。\n伝えたい事を、より分かりやすく効果的に。";
      } else {
        message =
          "こんばんは。\nデザイナーのノイです。\nウェブ・デザイン制作を行っています。\nシンプルで伝わるデザインを大切にし、\n目的に応じた表現で、想いを形にします。\nウェブ・ロゴ・印刷物のデザインから、\nHTML・CSS・JSでのコーディングまで。\n伝えたい事を、より分かりやすく効果的に。";
      }

      const lines = message.split("\n");
      let currentLine = 0;
      let charIndex = 0;

      function showNextLine() {
        if (!isDisplaying) return;

        if (currentLine >= lines.length) {
          currentLine = 0;
          charIndex = 0;
        }

        const messageContainer = document.getElementById("timeMessage");
        messageContainer.innerHTML = `<p id="formattedTime">TOKYO ${formattedTime}</p><p id="animatedText"></p>`;

        const line = lines[currentLine];
        const animatedText = document.getElementById("animatedText");

        animatedText.style.display = "inline-block";
        let lineLength = line.length;

        function showNextChar() {
          if (!isDisplaying) return;

          if (charIndex < lineLength) {
            const span = document.createElement("span");
            span.textContent = line[charIndex];
            span.style.opacity = "0";
            span.style.transition = "opacity 0.5s ease-in";
            animatedText.appendChild(span);

            setTimeout(() => {
              span.style.opacity = "1";
            }, charIndex * 150);

            charIndex++;
            setTimeout(showNextChar, 150);
          } else {
            currentLine++;
            charIndex = 0;
            setTimeout(showNextLine, 5000);
          }
        }

        showNextChar();
      }

      showNextLine();
    }

    document
      .getElementById("toggleButton")
      .addEventListener("click", function () {
        if (isDisplaying) {
          isDisplaying = false;
          document.getElementById(
            "timeMessage"
          ).innerHTML = `<p id="formattedTime">TOKYO ${formattedTime}</p><p style="width: 50%">&nbsp;</p>`;
          this.classList.remove("video_pause");
          this.classList.add("video-play");
        } else {
          isDisplaying = true;
          displayMessage();
          this.classList.remove("video-play");
          this.classList.add("video_pause");
        }
      });

    document.getElementById(
      "timeMessage"
    ).innerHTML = `<p id="formattedTime">TOKYO ${formattedTime}</p><p style="width: 50%">&nbsp;</p>`;
  }, moveDelay);
});

document.addEventListener("DOMContentLoaded", function () {
  let moveDelay;

  const isFirstVisit = sessionStorage.getItem("isFirstVisit") === null;
  if (isFirstVisit) {
    moveDelay = 9500;
  } else {
    moveDelay = 0;
  }

  gsap.registerPlugin(ScrollTrigger);

  setTimeout(() => {
    gsap.utils.toArray(".slideInRL, .slideInRL2").forEach((el) => {
      gsap.fromTo(
        el,
        { x: 200, y: -100, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 40%",
            end: "top 0%",
            scrub: true,
            toggleActions: "play none reverse none",
          },
        }
      );
    });
  }, moveDelay);
  setTimeout(() => {
    gsap.utils.toArray(".slideInLR, .slideInLR2").forEach((el) => {
      gsap.fromTo(
        el,
        { x: -200, y: -100, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 40%",
            end: "top 0%",
            scrub: true,
            toggleActions: "play none reverse none",
          },
        }
      );
    });
  }, moveDelay);
});

document.addEventListener("DOMContentLoaded", function () {
  let moveDelay = sessionStorage.getItem("isFirstVisit") === null ? 9500 : 0;

  if (moveDelay === 9500) {
    sessionStorage.setItem("isFirstVisit", "false");
  }

  gsap.registerPlugin(ScrollTrigger);

  const logo = document.getElementById("logo-container");

  setTimeout(() => {
    const firstScrollTrigger = ScrollTrigger.create({
      trigger: ".work-illust",
      start: "top 60%",
      end: "top 10%",
      scrub: 1,
      onEnter: () => {
        gsap.to(logo, {
          duration: 0.3,
          left: "-28px",
          top: "48px",
          scale: 0.4,
          rotation: 90,
          ease: "power2.inOut",
          force3D: true,
        });
      },
      onLeaveBack: () => {
        gsap.to(logo, {
          duration: 0.3,
          scale: 1,
          top: "49px",
          left: "36px",
          x: "0%",
          y: "0%",
          rotation: 0,
          ease: "power2.out",
          force3D: true,
        });
      },
    });

    const secondScrollTrigger = ScrollTrigger.create({
      trigger: "#end",
      start: "top 50%",
      end: "top 10%",
      scrub: 1,
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true,
      onEnter: () => {
        const windowWidth = window.innerWidth;
        const scaleValue = windowWidth <= 580 ? 3 : 5;
        gsap.to(logo, {
          duration: 0.3,
          scale: scaleValue,
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          rotation: "+=270",
          transformOrigin: "50% 50%",
          ease: "power2.out",
          immediateRender: false,
          force3D: true,
        });
      },

      onLeaveBack: () => {
        gsap.to(logo, {
          duration: 0.3,
          left: "14px",
          top: "79px",
          scale: 0.4,
          rotation: "+=450",
          ease: "power2.inOut",
          force3D: true,
        });
      },
    });

    ScrollTrigger.addEventListener("refresh", () => {
      firstScrollTrigger.refresh();
      secondScrollTrigger.refresh();
    });
  }, moveDelay);
});

function loadPopup(file) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      let popupInner = document.querySelector(".popup-inner");
      popupInner.innerHTML = data;

      document.getElementById("popup-content").style.display = "block";
      document.getElementById("blur").classList.add("blur");

      initializeSlider();
    })
    .catch((err) => {
      console.error("ファイルの読み込みに失敗しました", err);
    });
}

function closePopup() {
  document.getElementById("popup-content").style.display = "none";
  document.getElementById("blur").classList.remove("blur");
}

function initializeSlider() {
  setTimeout(() => {
    if ($(".slider").hasClass("slick-initialized")) {
      $(".slider").slick("unslick");
    }

    $(".slider").slick({
      autoplay: true,
      autoplaySpeed: 3500,
      dots: true,
      arrows: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
    });
  }, 300);
}

function changeBackground(color) {
  requestAnimationFrame(() => {
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
  });
}

window.addEventListener("hashchange", function () {
  history.replaceState(null, null, window.location.pathname);
});

function updateScrollIndicator() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-indicator").textContent = `${Math.round(
    scrollPercent
  )}%`;
}

window.addEventListener("scroll", updateScrollIndicator);

document.getElementById("contact-link").addEventListener("click", function () {
  let user = "noi.engineer.and.designer";
  let domain = "gmail.com";
  window.location.href = "mailto:" + user + "@" + domain;
});

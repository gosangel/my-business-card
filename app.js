(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const items = document.querySelectorAll(".reveal");
  const reveal = async (element) => {
    const image = element.querySelector("img");
    if (image) {
      try {
        // Wait for image pixels before starting the shared fade-in animation.
        await image.decode();
      } catch {
        // Keep the section accessible even if the image cannot be decoded.
      }
    }
    element.classList.add("visible");
  };
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            reveal(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    items.forEach((item) => observer.observe(item));
  }
  const video = document.getElementById("recursion");
  const toggle = document.getElementById("video-toggle");
  let manualPause = false;
  const sync = () => {
    toggle.textContent = video.paused ? "▶ Воспроизвести" : "Ⅱ Пауза";
    toggle.setAttribute(
      "aria-label",
      video.paused ? "Воспроизвести видео" : "Приостановить видео",
    );
  };
  toggle.addEventListener("click", async () => {
    if (video.paused) {
      manualPause = false;
      try {
        await video.play();
      } catch {
        toggle.textContent = "Повторить";
      }
    } else {
      manualPause = true;
      video.pause();
    }
  });
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !reduced.matches && !manualPause && !document.hidden)
          video.play().catch(sync);
        else video.pause();
      },
      { threshold: 0.25 },
    ).observe(video);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) video.pause();
  });
})();

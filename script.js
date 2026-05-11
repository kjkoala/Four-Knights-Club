class Carousel {
  constructor({
    container,
    track,
    items,

    prevBtn,
    nextBtn,

    counter,

    slidesToScroll = 1,

    autoplay = false,
    autoplaySpeed = 4000,

    loop = true,

    limitItems = null,

    // dots
    dots = false,
    dotsContainer = null,

    // responsive
    enableOnMobile = false,
    mobileBreakpoint = 768,
  }) {
    // elements
    this.container = document.querySelector(container);

    this.track = this.container.querySelector(track);

    const allItems = [...this.container.querySelectorAll(items)];

    this.items = limitItems ? allItems.slice(0, limitItems) : allItems;

    this.prevBtn = document.querySelector(prevBtn);

    this.nextBtn = document.querySelector(nextBtn);

    this.counter = counter && document.querySelector(counter);

    // settings
    this.slidesToScroll = slidesToScroll;

    this.autoplay = autoplay;
    this.autoplaySpeed = autoplaySpeed;

    this.loop = loop;

    // dots
    this.dotsEnabled = dots;

    this.dotsContainer = dotsContainer
      ? document.querySelector(dotsContainer)
      : null;

    this.dots = [];

    // responsive
    this.enableOnMobile = enableOnMobile;

    this.mobileBreakpoint = mobileBreakpoint;

    // state
    this.currentIndex = 0;

    this.timer = null;

    this.slidesToShow = 1;

    this.itemWidth = 0;
    this.itemGap = 0;
    this.stepSize = 0;

    this.isActive = true;

    this.init();
  }

  init() {
    this.updateSizes();

    this.createDots();

    this.bindEvents();

    this.checkMedia();

    this.updateButtons();

    if (this.enableOnMobile) {
      this.mediaQuery = window.matchMedia(
        `(max-width: ${this.mobileBreakpoint}px)`,
      );

      this.mediaQuery.addEventListener("change", () => {
        this.checkMedia();
      });
    }

    this.startAutoplay();

    window.addEventListener("resize", () => {
      this.updateSizes();
    });
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.startAutoplay();

        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.startAutoplay();

        this.next();
      });
    }
  }

  updateSizes() {
    if (!this.items.length) return;

    const containerWidth = this.container.offsetWidth;

    this.itemWidth = this.items[0].offsetWidth;

    const trackStyles = window.getComputedStyle(this.track);

    this.itemGap =
      parseInt(trackStyles.columnGap) || parseInt(trackStyles.gap) || 0;

    this.stepSize = this.itemWidth + this.itemGap;

    this.slidesToShow = Math.max(
      1,
      Math.floor(containerWidth / this.itemWidth),
    );

    this.move();
  }

  move() {
    if (!this.isActive) return;

    const translateX = -(this.currentIndex * this.stepSize);

    this.track.style.transform = `translateX(${translateX}px)`;

    if (this.counter) {
      this.counter.textContent = this.currentIndex + this.slidesToShow;
    }

    this.updateDots();

    this.updateButtons();
  }

  // ====================
  // BUTTONS
  // ====================

  updateButtons() {
    if (!this.prevBtn || !this.nextBtn) return;

    // если loop включен — кнопки всегда активны
    if (this.loop) {
      this.prevBtn.disabled = false;
      this.nextBtn.disabled = false;

      return;
    }

    const maxIndex = Math.max(
      0,
      this.items.length - this.slidesToShow,
    );

    // начало
    this.prevBtn.disabled = this.currentIndex <= 0;

    // конец
    this.nextBtn.disabled = this.currentIndex >= maxIndex;
  }

  next() {
    if (!this.isActive) return;

    const maxIndex = this.items.length - this.slidesToShow;

    if (this.currentIndex + this.slidesToScroll > maxIndex) {
      if (this.loop) {
        this.currentIndex = 0;
      } else {
        this.currentIndex = maxIndex;
      }
    } else {
      this.currentIndex += this.slidesToScroll;
    }

    this.move();
  }

  prev() {
    if (!this.isActive) return;

    if (this.currentIndex - this.slidesToScroll < 0) {
      if (this.loop) {
        this.currentIndex = this.items.length - this.slidesToShow;
      } else {
        this.currentIndex = 0;
      }
    } else {
      this.currentIndex -= this.slidesToScroll;
    }

    this.move();
  }

  startAutoplay() {
    if (this.autoplay && this.isActive) {
      this.stopAutoplay();

      this.timer = setInterval(() => {
        this.next();
      }, this.autoplaySpeed);
    }
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // ====================
  // DOTS
  // ====================

  createDots() {
    if (!this.dotsEnabled || !this.dotsContainer) {
      return;
    }

    this.dotsContainer.innerHTML = "";

    this.dots = this.items.map((_, index) => {
      const dot = document.createElement("button");

      dot.classList.add("carousel-dot");

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        this.currentIndex = index;

        this.move();

        this.startAutoplay();
      });

      this.dotsContainer.append(dot);

      return dot;
    });
  }

  updateDots() {
    if (!this.dots.length) return;

    this.dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add("active");
    }
  }

  // ====================
  // RESPONSIVE
  // ====================

  checkMedia() {
    if (!this.enableOnMobile) return;

    const isMobile = window.innerWidth <= this.mobileBreakpoint;

    if (isMobile) {
      this.enableSlider();
    } else {
      this.disableSlider();
    }
  }

  enableSlider() {
    if (this.isActive) return;

    this.isActive = true;

    this.move();

    this.startAutoplay();

    this.updateButtons();

    if (this.dotsContainer) {
      this.dotsContainer.style.display = "";
    }
  }

  disableSlider() {
    if (!this.isActive) return;

    this.isActive = false;

    this.stopAutoplay();

    this.track.style.transform = "translateX(0px)";

    if (this.prevBtn) {
      this.prevBtn.disabled = true;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = true;
    }

    if (this.dotsContainer) {
      this.dotsContainer.style.display = "none";
    }
  }
}

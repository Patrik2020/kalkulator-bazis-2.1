/* Accessible, dependency-free chart lightbox. Opt in with data-kb-chart-zoom on an image. */
(() => {
  "use strict";
  if (window.KB_CHART_ZOOM_READY) return;
  window.KB_CHART_ZOOM_READY = true;

  const triggers = [...document.querySelectorAll("img[data-kb-chart-zoom]")];
  if (!triggers.length) return;

  let dialog, image, surface, counter, opener, previousOverflow, previousPadding;
  let scale = 1, x = 0, y = 0, lastTap = 0;
  const pointers = new Map();
  let gesture = null;
  const MIN = 1, MAX = 5;
  const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const center = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const bounds = () => {
    const width = surface.clientWidth, height = surface.clientHeight;
    return { x: Math.max(0, (width * scale - width) / 2), y: Math.max(0, (height * scale - height) / 2) };
  };
  const draw = () => {
    const limit = bounds();
    x = clamp(x, -limit.x, limit.x);
    y = clamp(y, -limit.y, limit.y);
    image.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
    counter.textContent = `${Math.round(scale * 100)}%`;
    surface.classList.toggle("is-zoomed", scale > 1.01);
  };
  const zoom = (next, cx = surface.clientWidth / 2, cy = surface.clientHeight / 2) => {
    const before = scale;
    scale = clamp(next, MIN, MAX);
    const ox = cx - surface.clientWidth / 2, oy = cy - surface.clientHeight / 2;
    x = ox - (ox - x) * scale / before;
    y = oy - (oy - y) * scale / before;
    if (scale === 1) { x = 0; y = 0; }
    draw();
  };
  const reset = () => { scale = 1; x = 0; y = 0; draw(); };

  dialog = document.createElement("div");
  dialog.className = "kb-chart-lightbox";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Grafikon nagyított nézete");
  dialog.setAttribute("aria-hidden", "true");
  dialog.hidden = true;
  dialog.innerHTML = `<div class="kb-chart-toolbar">
    <span class="kb-chart-caption">Grafikon nagyítása</span>
    <span class="kb-chart-level" aria-live="off">100%</span>
    <button type="button" class="kb-chart-control" data-chart-action="out" aria-label="Kicsinyítés">−</button>
    <button type="button" class="kb-chart-control" data-chart-action="in" aria-label="Nagyítás">+</button>
    <button type="button" class="kb-chart-control kb-chart-close" data-chart-action="close" aria-label="Bezárás">×</button>
  </div>
  <div class="kb-chart-surface" aria-label="Két ujjal nagyítható grafikon">
    <img class="kb-chart-enlarged" alt="" draggable="false" />
  </div>
  <p class="kb-chart-hint">Két ujjal nagyítható · Húzással mozgatható · Dupla koppintással nagyítható</p>`;
  document.body.append(dialog);
  surface = dialog.querySelector(".kb-chart-surface");
  image = dialog.querySelector(".kb-chart-enlarged");
  counter = dialog.querySelector(".kb-chart-level");

  const close = () => {
    if (dialog.hidden) return;
    dialog.hidden = true;
    dialog.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPadding;
    pointers.clear(); gesture = null;
    image.removeAttribute("src");
    opener?.focus({ preventScroll: true });
    opener = null;
  };
  const open = (trigger) => {
    opener = trigger;
    previousOverflow = document.body.style.overflow;
    previousPadding = document.body.style.paddingRight;
    image.src = trigger.currentSrc || trigger.src;
    image.alt = trigger.alt;
    dialog.hidden = false;
    dialog.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    reset();
    dialog.querySelector(".kb-chart-close").focus({ preventScroll: true });
  };
  triggers.forEach((trigger) => {
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-label", (trigger.alt || "Grafikon") + " – megnyitás nagyításhoz");
    trigger.addEventListener("click", () => open(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(trigger); }
    });
  });

  dialog.addEventListener("click", (event) => {
    const action = event.target.closest("[data-chart-action]")?.dataset.chartAction;
    if (action === "close") close();
    if (action === "in") zoom(scale * 1.5);
    if (action === "out") zoom(scale / 1.5);
    if (event.target === dialog) close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key === "Tab") {
      const controls = [...dialog.querySelectorAll("button")];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.target.closest("button")) return;
    if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(scale * 1.25); }
    if (event.key === "-") { event.preventDefault(); zoom(scale / 1.25); }
    if (event.key === "0") { event.preventDefault(); reset(); }
  });
  surface.addEventListener("wheel", (event) => {
    if (dialog.hidden) return;
    event.preventDefault();
    const rect = surface.getBoundingClientRect();
    zoom(scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  surface.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    surface.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const list = [...pointers.values()];
    gesture = list.length === 2
      ? { type: "pinch", distance: distance(list[0], list[1]), scale, center: center(list[0], list[1]), x, y }
      : { type: "pan", point: list[0], x, y, moved: false };
  });
  surface.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const list = [...pointers.values()];
    if (list.length === 2) {
      const c = center(list[0], list[1]);
      if (!gesture || gesture.type !== "pinch") gesture = { type: "pinch", distance: distance(list[0], list[1]), scale, center: c, x, y };
      const nextScale = clamp(gesture.scale * distance(list[0], list[1]) / Math.max(1, gesture.distance), MIN, MAX);
      const ox = gesture.center.x - surface.getBoundingClientRect().left - surface.clientWidth / 2;
      const oy = gesture.center.y - surface.getBoundingClientRect().top - surface.clientHeight / 2;
      scale = nextScale;
      x = c.x - gesture.center.x + ox - (ox - gesture.x) * scale / gesture.scale;
      y = c.y - gesture.center.y + oy - (oy - gesture.y) * scale / gesture.scale;
      draw();
    } else if (list.length === 1 && gesture?.type === "pan") {
      const dx = list[0].x - gesture.point.x, dy = list[0].y - gesture.point.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) gesture.moved = true;
      if (scale > 1) { x = gesture.x + dx; y = gesture.y + dy; draw(); }
    }
  });
  const end = (event) => {
    const wasSingle = pointers.size === 1;
    const wasTap = wasSingle && gesture?.type === "pan" && !gesture.moved;
    pointers.delete(event.pointerId);
    if (wasTap) {
      const now = Date.now();
      if (now - lastTap < 320) {
        const rect = surface.getBoundingClientRect();
        zoom(scale > 1.1 ? 1 : 2.5, event.clientX - rect.left, event.clientY - rect.top);
        lastTap = 0;
      } else lastTap = now;
    }
    const list = [...pointers.values()];
    gesture = list.length === 1 ? { type: "pan", point: list[0], x, y, moved: false } : null;
  };
  surface.addEventListener("pointerup", end);
  surface.addEventListener("pointercancel", end);
  surface.addEventListener("lostpointercapture", (event) => { if (pointers.has(event.pointerId)) end(event); });
  window.addEventListener("resize", () => { if (!dialog.hidden) draw(); });
})();

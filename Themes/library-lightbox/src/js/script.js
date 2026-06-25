let lightbox, lightboxImg;

function createLightbox() {
  if (lightbox) return;

  lightbox = document.createElement("div");
  lightbox.id = "lb-main";

  lightboxImg = document.createElement("img");
  lightboxImg.id = "lb-img";

  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  let scale = 1;
  let isDragging = false;
  let startX,
    startY,
    translateX = 0,
    translateY = 0;

  // Close on background click
  lightbox.onclick = (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  };

  // Zoom with scroll
  lightbox.onwheel = (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 5);

    updateTransform();
  };

  // Drag to pan
  lightboxImg.onmousedown = (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lightboxImg.style.cursor = "grabbing";
  };

  // Double-click to reset zoom
  lightboxImg.ondblclick = () => {
    lightbox.reset();
  };

  window.onmouseup = () => {
    isDragging = false;
    lightboxImg.style.cursor = scale > 1 ? "grab" : "zoom-in";
  };

  // Copy image to clipboard on RMB
  lightboxImg.addEventListener("contextmenu", async (e) => {
    e.preventDefault();

    await copyImageToClipboard(lightboxImg.src);
  });

  window.onmousemove = (e) => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    updateTransform();
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox) {
      lightbox.style.display = "none";
    }
  });

  function updateTransform() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Reset function
  lightbox.reset = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  };

  //lightbox.style.display = "none";
}

function openLightbox(src) {
  createLightbox();

  lightboxImg.src = src;
  lightbox.style.display = "flex";
  lightbox.reset();
}

function enhanceImage(img) {
  if (img.dataset.enhanced === "true") return;
  img.dataset.enhanced = "true";

  const wrapper = document.createElement("div");
  wrapper.classList.add("lb-wrapper");

  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);

  // Overlay
  const overlay = document.createElement("div");
  overlay.classList.add("lb-overlay");

  // Icon
  const icon = document.createElement("div");
  icon.classList.add("lb-overlay-icon");
  icon.innerHTML = `
		<svg width="32" height="32" viewBox="0 0 24 24" fill="white">
			<path d="M10 2a8 8 0 105.293 14.293l4.207 4.207 1.414-1.414-4.207-4.207A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/>
		</svg>`;

  overlay.appendChild(icon);
  wrapper.appendChild(overlay);

  // Click anywhere on image
  wrapper.onclick = (e) => {
    e.stopPropagation();

    const fullSrc = img.src.replace(/\?.*$/, "");
    openLightbox(fullSrc);
  };

  // Copy image to clipboard on RMB
  wrapper.addEventListener("contextmenu", async (e) => {
    e.preventDefault();

    const fullSrc = img.src.replace(/\?.*$/, "");
    await copyImageToClipboard(fullSrc);
  });
}

function processPost(postContent) {
  const images = postContent.querySelectorAll("img:not([data-enhanced])");
  images.forEach(enhanceImage);
}

function scanForPosts(root) {
  const posts = root.querySelectorAll("._32mHvRSmD7AVK9OIOPlaFu");
  posts.forEach(processPost);
}

async function copyImageToClipboard(src) {
  try {
    const response = await fetch(src);
    const blob = await response.blob();

    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    const pngBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": pngBlob,
      }),
    ]);

    showToast("Image copied to clipboard");
  } catch (err) {
    console.error("[THEME HACK] Failed to copy image", err);
    showToast("Failed to copy image");
  }
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.classList.add("lb-toast");
  toast.textContent = text;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

function initObserver() {
  const modalRoot = document.querySelector("._37MAYpIjl0IDA1xVhhsuX8");
  if (!modalRoot) {
    console.log("[Millenium Plugin] Modal root not found, retrying...");
    setTimeout(initObserver, 1000);
    return;
  }

  console.log("[Millenium Plugin] Observer attached");

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Direct match
        if (node.matches?.("._32mHvRSmD7AVK9OIOPlaFu")) {
          processPost(node);
        }

        // Nested match
        const posts = node.querySelectorAll?.("._32mHvRSmD7AVK9OIOPlaFu");
        posts?.forEach(processPost);
      }
    }
  });

  observer.observe(modalRoot, {
    childList: true,
    subtree: true,
  });

  // Initial scan
  scanForPosts(modalRoot);
}

// Entry point
function main() {
  console.debug("[Steam-Library Lightbox Images] Loaded");
  initObserver();
}

main();

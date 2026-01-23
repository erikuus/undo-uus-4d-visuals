import "./style.css";
import { createVisualization as createSphereVis } from "./visualisations/four16-sphere-w-gate";
import { createVisualization as createTesseractVis } from "./visualisations/four01-tesseract";

type VisualizationId = "four16" | "four01";

const visualizations: Record<
  VisualizationId,
  {
    create: (canvas: HTMLCanvasElement) => { resize: () => void };
    title: string;
    description: string;
  }
> = {
  four16: {
    create: createSphereVis,
    title: "4D Sphere (S³) – W-Gated Stereo",
    description:
      "A 4D point cloud on the 3-sphere, with perceptual W-gate hiding half the space.",
  },
  four01: {
    create: createTesseractVis,
    title: "4D Tesseract – Rotating Hyperrectangle",
    description:
      "A 4D rectangular parallelepiped rotating through all six 4D planes.",
  },
};

function getVisIdFromHash(): VisualizationId | null {
  const hash = window.location.hash.slice(1);
  if (hash in visualizations) {
    return hash as VisualizationId;
  }
  return null;
}

function showLanding() {
  const container = document.getElementById("app");
  if (!container) return;

  container.innerHTML = `
    <div class="landing">
      <header class="landing-header">
        <h1>4D Visualisations</h1>
        <p class="subtitle">Reconstructions of Undo Uus's QBasic experiments (1997–2000)</p>
      </header>
      <div class="vis-grid">
        ${Object.entries(visualizations)
          .map(
            ([id, vis]) => `
          <a href="#${id}" class="vis-card">
            <div class="vis-card-icon">${id === "four16" ? "◉" : "⬡"}</div>
            <h2>${vis.title}</h2>
            <p>${vis.description}</p>
          </a>
        `,
          )
          .join("")}
      </div>
      <footer class="landing-footer">
        <p>Original experiments in 4-dimensional perception and stereoscopic rendering.</p>
      </footer>
    </div>
  `;
}

function showVisualization(id: VisualizationId) {
  const vis = visualizations[id];
  const container = document.getElementById("app");
  if (!container || !vis) return;

  container.innerHTML = `
    <div class="container">
      <nav class="vis-nav">
        <a href="#" class="back-link">← All Visualisations</a>
      </nav>
      <h1>${vis.title}</h1>
      <p>${vis.description}</p>
      <canvas id="canvas"></canvas>
      <footer>Reconstruction of Undo Uus's QBasic experiment (1997–2000).</footer>
    </div>
  `;

  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Expected a <canvas id="canvas"> element.');
  }

  const controller = vis.create(canvas);

  const resizeHandler = () => controller?.resize?.();
  window.addEventListener("resize", resizeHandler);

  // Store cleanup function
  (window as unknown as { __visCleanup?: () => void }).__visCleanup = () => {
    window.removeEventListener("resize", resizeHandler);
  };
}

function route() {
  // Cleanup previous visualization
  const cleanup = (window as unknown as { __visCleanup?: () => void })
    .__visCleanup;
  if (cleanup) {
    cleanup();
    delete (window as unknown as { __visCleanup?: () => void }).__visCleanup;
  }

  const visId = getVisIdFromHash();
  if (visId) {
    showVisualization(visId);
  } else {
    showLanding();
  }
}

window.addEventListener("hashchange", route);
route();

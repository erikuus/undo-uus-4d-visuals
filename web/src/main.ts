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
        <p class="subtitle">Reconstructions of Undo Uus's experiments in human perception (1997–2000)</p>
        <a href="https://github.com/erikuus/undo-uus-4d-visuals" class="github-link" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Source code and archival material
        </a>
      </header>

      <section class="intro">
        <p>
          Humans experience a three-dimensional world even though the images formed on the retina are two-dimensional.
          This is possible because the visual system detects invariant structure in changing projections — for example,
          recognizing a rigid 3D object from a sequence of 2D views.
        </p>
        <p class="question">
          These experiments explore a simple but unconventional question:
        </p>
        <p class="emphasis">
          Could the same perceptual mechanism, when supplied with the right kind of input,
          recognize a rigid four-dimensional object from dynamically changing three-dimensional projections?
        </p>
        <p>
          The visualizations presented here are modern reconstructions of programs written by Undo Uus between
          1997–2000 to generate such stimuli using stereoscopic rendering and mathematically correct
          four-dimensional rotations.
        </p>
      </section>

      <section class="experiments">
        <h2>Experiments</h2>
        <div class="vis-grid">
          ${Object.entries(visualizations)
            .map(
              ([id, vis]) => `
            <a href="#${id}" class="vis-card">
              <div class="vis-card-icon">${id === "four16" ? "◉" : "⬡"}</div>
              <h3>${vis.title}</h3>
              <p>${vis.description}</p>
            </a>
          `,
            )
            .join("")}
        </div>
      </section>

      <footer class="landing-footer">
        <div class="footer-legal">
          <p>© 1997–2000 Undo Uus (original experiments)</p>
          <p>© 2024–present Erik Uus (reconstructions and archival presentation)</p>
          <p class="disclaimer">This site is a research and archival project, not a commercial product.</p>
        </div>
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

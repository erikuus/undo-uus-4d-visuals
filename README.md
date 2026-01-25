# Undo Uus - 4D Visualisation Experiments (1997-2000)

This repository preserves and reconstructs a series of computational and perceptual experiments conducted by Undo Uus between approximately 1997 and 2000.

The experiments explore a single guiding question:

If the human visual system can infer a rigid 3-dimensional object from changing 2-dimensional projections, might it also infer a rigid 4-dimensional object from changing 3-dimensional projections?

The materials here are preserved as historical research artifacts, not as modern graphics software.

## Conceptual origin

The earliest known formulation of this idea appears in a letter sent by Undo Uus to philosopher and neuropsychiatrist John Smythies in 1997.

Primary source:

- [Letter to John Smythies (1997)](archive/letters/1997-letter-to-john-smythies.md)

This letter outlines the hypothesis, its perceptual motivation, and a concrete experimental proposal using stereoscopic computer graphics.

## Project notes (2000)

In 2000, after oral explanations by Undo Uus, his son Erik Uus wrote down a conceptual outline of the project as he understood it at the time. These notes were not reviewed or corrected by Undo Uus and are preserved unchanged for historical reasons.

Project notes:

- Estonian (original): [2000 - 4D project notes (ET)](archive/notes/2000-4d-project-notes-et.md)
- English (translation): [2000 - 4D project notes (EN)](archive/notes/2000-4d-project-notes-en.md)

These notes are interpretive and may contain simplifications or inaccuracies, but they document how the idea was transmitted and understood.

## QBasic experiment programs

Between ~1997 and 2000, Undo Uus implemented a series of QBasic programs exploring different visual stimuli for the proposed experiment.

These programs:

- generate 4D objects (hypercubes, lines, spheres)
- rotate them in 4D
- project them stereoscopically into 3D or split-screen 2D
- experiment with perceptual cues such as:
  - stereo disparity
  - brightness encoding of the W dimension
  - visibility gating

Original source files:

- [archive/bas/](archive/bas/)

Program catalog (archival overview):

- [4D visualisation experiments catalog](archive/bas/README.md)

The catalog describes each program as an experimental stimulus, not as optimized or corrected code.

## Scanned original materials

This repository also includes scans of original paper documents related to the project.
These scans serve as **primary archival evidence** and provide a reference point for
verifying the authenticity and correctness of transcribed materials.

In particular, the scans are important because:

- some QBasic source files may have been transcribed manually or via OCR
- minor transcription errors are possible
- the scans preserve the original formatting, annotations, and context

Scans of original documents:

- [archive/scans/](archive/scans/)

The scanned materials are preserved unchanged and are intended for historical
verification rather than everyday reading.

## Modern reconstruction (web)

To make these experiments accessible today, selected programs are being reconstructed for the web using modern technologies (TypeScript, Canvas/WebGL).

The goal is fidelity of stimulus, not visual enhancement.

Live site (GitHub Pages):

- https://erikuus.github.io/undo-uus-4d-visuals/

Modern implementation source:

- [web/](web/)

## Archival intent

This repository aims to preserve:

- the original idea
- the original implementations
- the historical context

Modern code exists to serve the archive, not to replace it.

Future extensions should prioritize:

- perceptual clarity
- minimalism
- faithfulness to the original experimental intent

## Status

This is an active archival and reconstruction project. Nothing here should be considered finished or definitive.

## Attribution

- **Original experiments & concept:** Undo Uus
- **Archival compilation, transcription, notes:** Erik Uus
- **Modern reconstructions:** Erik Uus (with AI assistance)

## License

This repository uses a split license:

- `archive/` is licensed under CC BY-NC 4.0 (see `LICENSE-ARCHIVE`).
- All other code and documentation is licensed under MIT (see `LICENSE`).

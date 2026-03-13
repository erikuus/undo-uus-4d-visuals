export type AnimationController = {
  resize: () => void;
  destroy: () => void;
};

export type ExplainerSlide = {
  id: string;
  title: string;
  body: string;
  prompt: string;
  answer: string;
  quote?: string;
  footerNote?: string;
  createAnimation: (canvas: HTMLCanvasElement) => AnimationController;
};

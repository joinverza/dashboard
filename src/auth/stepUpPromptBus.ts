type StepUpPromptState = {
  open: boolean;
  message: string;
};

type Listener = (state: StepUpPromptState) => void;

let currentMessage = "";
let activeRequest:
  | {
      resolve: (code: string) => void;
      reject: (error: Error) => void;
    }
  | null = null;
const listeners = new Set<Listener>();

const emit = (): void => {
  const state: StepUpPromptState = {
    open: activeRequest !== null,
    message: currentMessage,
  };
  for (const listener of listeners) {
    listener(state);
  }
};

export const subscribeStepUpPrompt = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener({ open: activeRequest !== null, message: currentMessage });
  return () => {
    listeners.delete(listener);
  };
};

export const requestStepUpCode = (message: string): Promise<string> => {
  if (activeRequest) {
    return Promise.reject(new Error("A step-up prompt is already active."));
  }
  currentMessage = message;
  return new Promise<string>((resolve, reject) => {
    activeRequest = { resolve, reject };
    emit();
  });
};

const clearRequest = (): void => {
  activeRequest = null;
  currentMessage = "";
  emit();
};

export const submitStepUpCode = (code: string): void => {
  const pending = activeRequest;
  if (!pending) return;
  if (!/^\d{6}$/.test(code)) {
    pending.reject(new Error("A valid 6-digit code is required."));
    clearRequest();
    return;
  }
  pending.resolve(code);
  clearRequest();
};

export const cancelStepUpCode = (): void => {
  const pending = activeRequest;
  if (!pending) return;
  pending.reject(new Error("Step-up was cancelled."));
  clearRequest();
};


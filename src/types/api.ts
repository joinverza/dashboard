export type ApiErrorShape = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown[];
  };
  detail?: string;
  requestId?: string;
};

export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
      requestId?: string;
      timestamp?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown[];
      };
      requestId?: string;
      timestamp?: string;
    };


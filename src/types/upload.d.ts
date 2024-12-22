declare namespace Upload {
  interface FileResponse {
    url: string;
    message: string;
  }

  interface UploadResponse {
    urls: string[];
    message: string;
  }

  interface UploadError {
    error: string;
    status: number;
  }

  interface UploadProps {
    onChange: (files: File[]) => void;
    value: string[];
    disabled?: boolean;
    maxFiles?: number;
    maxSize?: number;
  }

  interface UploadState {
    files: File[];
    previews: string[];
    uploading: boolean;
    error?: string;
  }
} 
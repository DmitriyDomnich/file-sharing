import { Reference } from "@angular/fire/compat/storage/interfaces";

export interface FileToDownload extends Reference {
  downloadUrl?: string;
  description?: string;
  type?: string;
  size?: number;
}
// file.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private fileContentSource = new BehaviorSubject<string | null>(null);
  fileContent$ = this.fileContentSource.asObservable();

  setFileContent(content: string): void {
    this.fileContentSource.next(content);
  }
}

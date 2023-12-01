import { Component } from '@angular/core';
import { CustomFile } from './file.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'correlation_website_poject';

  // FILE UPLOAD WORK

  uploadedFile: CustomFile | undefined;
  fileData: string[][] = [];

  onFileUploaded(file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const fileContent: string | ArrayBuffer = reader.result as string;
      this.fileData = this.parseCsvContent(fileContent);

      this.uploadedFile = {
        name: file.name,
        content: fileContent.toString(), // Convert ArrayBuffer to string
        extension: '' // You might want to extract the file extension here
      };

      console.log('Uploaded File Content(app):', fileContent);
    };

    reader.readAsText(file);
  }

  private parseCsvContent(content: string): string[][] {
    // Add your CSV parsing logic here
    // For simplicity, let's split the content by lines and then by commas
    return content.split('\n').map(row => row.split(','));
  }

  // MANUAL INPUT WORK

  // xValues: string = '';
  // yValues: string = '';

  // onCalculateClicked(event: { x: string, y: string }): void {
  //   // Check if the values are not empty
  //   if (event.x.trim() !== '' && event.y.trim() !== '') {
  //     // Set the xValues and yValues properties
  //     this.xValues = event.x;
  //     this.yValues = event.y;

  //     // Perform any additional logic or calculations if needed

  //     // Log the values (replace with actual logic)
  //     console.log('X Values:', this.xValues);
  //     console.log('Y Values:', this.yValues);
  //   } else {
  //     console.log('Values cannot be empty.');
  //   }
  // }

  // DATA SERVICE WORK LOGIC
  
  
}
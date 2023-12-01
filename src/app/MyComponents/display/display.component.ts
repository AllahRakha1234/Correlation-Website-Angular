import { Component, OnInit } from '@angular/core';
import {Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { CustomFile } from '../../file.model';
import { FileService } from '../../file.service';
import { DataService } from '../../data.service';
import { ArrayDataService } from '../../data.service';

// import { Papa } from 'ngx-papaparse';
// import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})


// export class DisplayComponent {
//   @Input() data: CustomFile | undefined;
//   fileData: any;

//   ngOnChanges(): void {
//     if (this.data) {
//       this.parseFile(this.data);
//     }
//   }

//   parseFile(file: CustomFile): void {
//     const reader: FileReader = new FileReader();

//     reader.onload = () => {
//       const csvContent: string = reader.result as string;
//       this.fileData = this.parseCsv(csvContent);

//       // Print the obtained data in the console
//       console.log('Obtained Data:', this.fileData);
//     };

//     reader.readAsText(new Blob([file.content])); // Read the file content as text
//   }

//   private parseCsv(csvContent: string): string[][] {
//     // Split CSV content into rows and columns
//     return csvContent.split('\n').map(row => row.split(','));
//   }
// }

export class DisplayComponent implements OnInit {
  selectedColumn1: string | undefined;
  selectedColumn2: string | undefined;
  fileData: any;

  constructor(private fileService: FileService, private dataService: DataService, private arrayDataService: ArrayDataService) {}

  ngOnInit(): void {
    this.fileService.fileContent$.subscribe((content) => {
      if (content) {
        this.parseCsv(content);
      }
    });
  }

  parseCsv(csvContent: string): void {
    // Split CSV content into rows and columns
    this.fileData = csvContent.split('\n').map((row) => row.split(','));

    // Remove the carriage return character from the last column of each row
    this.fileData = this.fileData.map((row: string[]) => row.map((column: string) => column.replace('\r', '')));

    this.fileData.pop(); // Remove the last row (empty row

    // convert to number for all rows leaving first row same
    for (var i = 1; i < this.fileData.length; i++) {
      for (var j = 0; j < this.fileData[i].length; j++) {
        this.fileData[i][j] = Number(this.fileData[i][j]);
      }
    }
    // Initialize selectedColumn1 and selectedColumn2 with the first two columns
    if (this.fileData[0] && this.fileData[0].length >= 2) {
      this.selectedColumn1 = this.fileData[0][0];
      this.selectedColumn2 = this.fileData[0][1];
    }

    // Print the obtained data in the console
    console.log('Obtained Data:', this.fileData);
  }

  // Add any additional logic based on selectedColumn1 and selectedColumn2
  // For example, you can log the selected values when they change
  onColumnsSelected(): void {
    console.log('Selected Column 1:', this.selectedColumn1);
    console.log('Selected Column 2:', this.selectedColumn2);
  }

  calculate(): void {
    console.log('Selected Column 1:', this.selectedColumn1);
    console.log('Selected Column 2:', this.selectedColumn2);

    // Extract selected columns' data
    const columnIndex1 = this.fileData[0].indexOf(this.selectedColumn1);
    const columnIndex2 = this.fileData[0].indexOf(this.selectedColumn2);

    // Extract selected columns' data as arrays
    const selectedColumn1Data: string[] = this.fileData.slice(1).map((row: string[]) => row[columnIndex1]);
    const selectedColumn2Data: string[] = this.fileData.slice(1).map((row: string[]) => row[columnIndex2]);

    // Emit the data as an object with x and y properties
    this.arrayDataService.emitCalculateClicked({ x: selectedColumn1Data, y: selectedColumn2Data });
  }
  
}

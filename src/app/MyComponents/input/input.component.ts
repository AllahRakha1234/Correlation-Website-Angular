import { Component } from '@angular/core';
import { Output, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { DataService } from '../../data.service';
import { ArrayDataService } from '../../data.service';  // Correct import
import { FileService } from '../../file.service';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})

export class InputComponent {

  xValues_input: string = '';
  yValues_input: string = '';

  // Add class properties to store values received from ArrayDataService
  xValues_display: string = '';
  yValues_display: string = '';

  // Flag to track whether changes have been made
  changesMade: boolean = false;

  @Output() fileUploaded = new EventEmitter<File>(); // Change the type to File

  constructor(
    private dataService: DataService,
    private arrayDataService: ArrayDataService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for manual change detection
  ) { }

  ngOnInit(): void {
    // Subscribe to the ArrayDataService to get data from DisplayComponent
    this.arrayDataService.calculateClicked$.subscribe((data) => {
      // Store the values in class properties
      this.xValues_display = JSON.stringify(data.x);
      this.yValues_display = JSON.stringify(data.y);
      console.log('xValues_input from display before: ', this.xValues_display);
      console.log('yValues_input from display before: ', this.yValues_display);
      // Parse JSON strings into arrays
      const xValuesArray = JSON.parse(this.xValues_display);
      const yValuesArray = JSON.parse(this.yValues_display);
      console.log('xValues_input from display: ', xValuesArray);
      console.log('yValues_input from display: ', yValuesArray);
      this.xValues_input = '[' + xValuesArray.join(', ') + ']';
      this.yValues_input = '[' + yValuesArray.join(', ') + ']';
      console.log('xValues_input from display after: ', this.xValues_input);
      console.log('yValues_input from display after: ', this.yValues_input);
      // Call calculate method
      this.calculate();
    });
  }


  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const reader: FileReader = new FileReader();
  
      reader.onload = () => {
        const fileContent: string | ArrayBuffer = reader.result as string;
  
        // Check the file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
  
        if (extension === 'csv') {
          // For CSV files, continue with the existing CSV parsing logic
          this.fileService.setFileContent(fileContent as string);
          console.log('CSV File Content (input):', fileContent);
        } else if (extension === 'xlsx') {
          // For XLSX files, use the read function from xlsx library
          const workbook = read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const csvContent = XLSX.utils.sheet_to_csv(sheet);
          
          this.fileService.setFileContent(csvContent);
          console.log('XLSX File Content (input):', csvContent);
        } else {
          alert('❌ ERROR: Unsupported file type. Please upload a CSV or XLSX file.');
        }
      };
  
      reader.readAsBinaryString(file); // Read the file as binary
    }
  }

  // MANUAL INPUT WORK

  @Output() calculateClicked = new EventEmitter<{ x: string, y: string }>();


  // Method to handle changes in the input
  handleInputChange(): void {
    this.changesMade = true;
  }

  // Method to handle saving changes
  saveChanges(): void {
    // VALIDATING COLUMN LENGTHS AND SYNTAX OF INPUTS
    // Regular expression to check if the values have the format [1,2,3,...]
    const formatRegex = /^\[\s?\d+(\s?,\s?\d+)*\]$/;

    // Parse JSON strings into arrays
    const xValuesArray = JSON.parse(this.xValues_input);
    const yValuesArray = JSON.parse(this.yValues_input);

    // Check if the arrays have the same number of elements
    if (xValuesArray.length !== yValuesArray.length) {
      alert('❌ ERROR: Columns lengths do not match.');
      return;
    }

    if (!formatRegex.test(this.xValues_input) || !formatRegex.test(this.yValues_input)) {
      alert('❌ ERROR: Invalid format. Please use the format [1,2,3,...]');
      return;
    } else {
      this.dataService.emitCalculateClicked({ x: this.xValues_input, y: this.yValues_input });
      this.changesMade = false; // Reset the changesMade flag after saving changes
      this.cdr.detectChanges(); // Trigger change detection manually
    }
  }

  calculate(): void {
    // VALIDATING COLUMN LENGTHS AND SYNTAX OF INPUTS
    // Regular expression to check if the values have the format [1,2,3,...]
    const formatRegex = /^\[\s?\d+(\s?,\s?\d+)*\]$/;
  
    if (this.xValues_input.length === 0 || this.yValues_input.length === 0) {
      alert('❌ ERROR: One or more columns are empty.');
      return;
    }
  
    try {
      // Log the values before parsing
      console.log('xValues_input before parsing:', this.xValues_input);
      console.log('yValues_input before parsing:', this.yValues_input);
  
      // Parse JSON strings into arrays
      const xValuesArray = JSON.parse(this.xValues_input);
      const yValuesArray = JSON.parse(this.yValues_input);
  
      // Log the values after parsing
      console.log('xValuesArray after parsing:', xValuesArray);
      console.log('yValuesArray after parsing:', yValuesArray);
  
      // Check if the arrays have the same number of elements
      if (xValuesArray.length !== yValuesArray.length) {
        alert('❌ ERROR: Columns lengths do not match.');
        return;
      }
  
      if (!formatRegex.test(this.xValues_input) || !formatRegex.test(this.yValues_input)) {
        alert('❌ ERROR: Invalid format. Please use the format [1,2,3,...]');
        return;
      } else {
        // Emit the event with x and y values directly to the service
        this.dataService.emitCalculateClicked({ x: this.xValues_input, y: this.yValues_input });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('❌ ERROR: Invalid JSON format. Please check your input.');
    }
  }
}
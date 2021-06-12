import { Component, OnInit, Output,NgZone, Input, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Output() onChange = new EventEmitter<any>();
  @Input() parentSubject :Subject<any>
  @Input() type :Number
  public imagesrc: String;
  public file: File
  public remove;
  public file_previewData:any;
  private hasBaseDropZoneOver: boolean = false;
  private uploader: FileUploader;
  private title: string;
  responses: Array<any>;

  constructor(private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient) {
      this.responses = [];

     }

  ngOnInit() {
if(this.parentSubject){
  this.parentSubject.subscribe((res)=>{
    //console.log(res);
    this.imagesrc =res
    console.log(this.imagesrc);
    
  })

}
  // Create the file uploader, wire it to upload to your account
  const uploaderOptions: FileUploaderOptions = {
    url: `https://api.cloudinary.com/v1_1/dgmepvauo/upload`,
    // Upload files automatically upon addition to upload queue
    autoUpload: true,
    // Use xhrTransport in favor of iframeTransport
    isHTML5: true,
    // Calculate progress independently for each uploaded file
    removeAfterUpload: true,
    // XHR request headers
    headers: [
      {
        name: 'X-Requested-With',
        value: 'XMLHttpRequest'
      }
    ]
  };
  this.uploader = new FileUploader(uploaderOptions);

  this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
    // Add Cloudinary's unsigned upload preset to the upload form
    form.append('upload_preset', "ml_default");
    // Add built-in and custom tags for displaying the uploaded photo in the list
    let tags = 'myphotoalbum';
    if (this.title) {
      form.append('context', `photo=${this.title}`);
      tags = `myphotoalbum,${this.title}`;
    }
    // Upload to a custom folder
    // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
    // In order to automatically create the folders based on the API requests,
    // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
    form.append('folder', 'angular_sample');
    // Add custom tags
    form.append('tags', tags);
    // Add file to upload
    form.append('file', fileItem);

    // Use default "withCredentials" value for CORS requests
    fileItem.withCredentials = false;
    return { fileItem, form };
  };

  // Insert or update an entry in the responses array
  const upsertResponse = fileItem => {

    // Run the update in a custom zone since for some reason change detection isn't performed
    // as part of the XHR request to upload the files.
    // Running in a custom zone forces change detection
    this.zone.run(() => {
      // Update an existing entry if it's upload hasn't completed yet

      // Find the id of an existing item
      const existingId = this.responses.reduce((prev, current, index) => {
        if (current.file.name === fileItem.file.name && !current.status) {
          return index;
        }
        return prev;
      }, -1);
      if (existingId > -1) {
        // Update existing item with new data
        this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        this.onChange.emit({
          thumbnail: this.responses,
  
        });
      } else {
        // Create new response
        this.responses.push(fileItem);
        this.onChange.emit({
          thumbnail: this.responses,
  
        });
      }
      
    });
  };
 

  // Update model on completion of uploading a file
  this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
    upsertResponse(
      {
        file: item.file,
        status,
        data: JSON.parse(response)
      }
    );

  // Update model on upload progress event
  this.uploader.onProgressItem = (fileItem: any, progress: any) =>
    upsertResponse(
      {
        file: fileItem.file,
        progress,
        data: {}
      }
    );
  }
  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }
}

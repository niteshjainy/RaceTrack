import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('publicHeader') publicHeader: ElementRef;
  constructor() { }
  sticky:number;


ngOnInit() {
  this.sticky = this.publicHeader.nativeElement.offsetTop;
  window.addEventListener('scroll', this.scrollEvent, true);
}

ngOnDestroy() {
  window.removeEventListener('scroll', this.scrollEvent, true);
}

scrollEvent = (event: any): void => {

  if (window.pageYOffset > this.sticky) {
    this.publicHeader.nativeElement.classList.add("sticky");
  } else {
    this.publicHeader.nativeElement.classList.remove("sticky");
  }
  
}

}

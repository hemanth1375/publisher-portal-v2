import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewapi',
  templateUrl: './viewapi.component.html',
  styleUrl: './viewapi.component.css'
})
export class ViewapiComponent implements OnInit {

  endpointInfo:any;

  ngOnInit(): void {
   const obj = history.state;
   console.log(obj?.body);
   this.endpointInfo = obj?.body;
   
  }

  
}

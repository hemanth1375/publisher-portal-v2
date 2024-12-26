import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-applicationoverview',
  templateUrl: './applicationoverview.component.html',
  styleUrl: './applicationoverview.component.css'
})
export class ApplicationoverviewComponent {

  receivedData: any

  constructor(private router: Router) {

  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.receivedData = navigation.extras.state['data'];
      console.log("*******88receivedData", this.receivedData);

    } else {
      console.warn('No data found in navigation state');
      this.receivedData = null; // Or set a default value
    }
  }
}

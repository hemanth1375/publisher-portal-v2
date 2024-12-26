import { Component } from '@angular/core';
import { MainService } from '../services/main.service';


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {

  endpointCards: any

  constructor(private mainSer: MainService) {


  }

  loadCards(userId: any) {
    this.mainSer.getEndpointCards(userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.endpointCards = res.endpointCards
        console.log("subscriptions:", this.endpointCards);
      },
      error: (err) => {
        console.error(err);
        // this.showError(err?.error?.message);
        // this.isShowNoApisCard=true
      }
    })
  }

  ngOnInit() {
    const userId = localStorage.getItem('userid')
    this.loadCards(userId)
  }

}

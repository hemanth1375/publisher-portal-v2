import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { CreateconsumerService } from '../services/createconsumer.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';


interface ConsumerCard {
  id: number
  username: string;
  email: string;
  firstname: string,
  lastname: string
}

@Component({
  selector: 'app-consumercards',
  templateUrl: './consumercards.component.html',
  styleUrl: './consumercards.component.css'
})
export class ConsumercardsComponent {

  isShowParent: boolean = true
  private subscription: Subscription;
  userId: any = localStorage.getItem('userid');

  // consumerCards: ConsumerCard[] = [{
  //   id: 1,
  //   username: "massil",
  //   email: "massil@gmail.com",
  //   firstname: "massil",
  //   lastname: "tech"
  // }]
  consumerCards: any


  consumerDelete(consumerId: any) {
    console.log("consumerDelete", consumerId);
    this.cconsumersrv.deleteConsumer(consumerId).subscribe({
      next: (result) => {
        this.showSuccess(result?.message);
        this.loadCards()
      },
      error: (err) => {
        this.showError(err?.message)
        console.log("error", err);
      }
    })
  }


  goToApplicationPage(consumerId: any) {
    // this.router.navigate([`viewgateway/${id}/dashboard`], { relativeTo: this.route })
    this.router.navigate([`${consumerId}/application`], { relativeTo: this.route })
    this.isShowParent = false
  }
  constructor(private router: Router, private route: ActivatedRoute, private communucationSer: CommunicationService,
    private cconsumersrv: CreateconsumerService, private toastService: ToastService) {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        if (this.router.url === '/consumers') {
          this.isShowParent = true;
        } else if (this.router.url === '/consumers/createconsumer') {
          this.isShowParent = false;
        }
      }
    });

    this.subscription = this.communucationSer.consumercreat$.subscribe(
      (updatedData: any) => {
        console.log('Updated data received from child component!', updatedData);
        this.loadCards();
      }
    );

  }
  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  goToCreateConsumer() {
    console.log("*************************this is go to create consumer");
    // this.communucationSer.updateShowParent(false);
    this.router.navigate(['createconsumer'], { relativeTo: this.route })
  }
  goTConsumerViewPage(item: any) {
    console.log("kkkkkkkkkkkkk");
    this.router.navigate(['viewconsumer/' + item.id], { relativeTo: this.route })
    this.isShowParent = false

  }

  ngOnInit() {
    this.cconsumersrv.getConsumer().subscribe({
      next: (res) => {
        this.consumerCards = res.consumers
        this.loadCards()
      },
      error: (err) => {
        console.log("error ****************8", err);
      }
    })
  }

  loadCards() {
    this.cconsumersrv.getConsumer().subscribe({
      next: (res) => {
        this.consumerCards = res.consumers
      },
      error: (err) => {
        console.log("error", err);
        this.consumerCards = []

      }
    })
  }

}

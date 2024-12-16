import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-gatewaycards',
  templateUrl: './gatewaycards.component.html',
  styleUrl: './gatewaycards.component.css'
})
export class GatewaycardsComponent {

  private subscription: Subscription;
  constructor(private router: Router, private route: ActivatedRoute, private mainSer: MainService, private communicationSer: CommunicationService,private toastService: ToastService) {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log(this.router.url);

        if (this.router.url === '/gateways') {
          this.isShowParent = true;


        } else if (this.router.url === '/gateways/creategateway') {
          this.isShowParent = false;
        }
      }
    });
    this.subscription = this.communicationSer.gatewayCreated$.subscribe(
      (updatedData: any) => {
        console.log('Updated data received from child component!', updatedData);
        this.loadGatewayCards();
    
      }
    );
  }


  gatewaysCards: any;

  showSuccess(message:string) {
    this.toastService.show(message, { type: 'success' });
  }


  showError(message:string){
    this.toastService.show(message , {type:"error"})
  }

  ngOnInit() {
    this.loadGatewayCards()
  }

  loadGatewayCards() {
    this.mainSer.getCards().subscribe({
      next: ((res: any) => {
        console.log(res);
        this.gatewaysCards = res.cards
      }),
      error: (err) => {
        this.showError(err?.message)
      }
    })
  }

  isShowParent: boolean = true;
  isShowNoGatewayCard = false;

  goToCreateGateway() {
    this.isShowParent = false;
    this.router.navigate(['creategateway'], { relativeTo: this.route })
  }

  goToGatewayViewPage(id: string) {
    this.isShowParent = false;
    this.router.navigate([`viewgateway/${id}/dashboard`], { relativeTo: this.route })
  }
}


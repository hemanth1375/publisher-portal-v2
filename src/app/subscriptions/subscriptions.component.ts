import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent{


  endpointCards: any[] = []
  // filteredEndpointCards: any[] = []
  // dataSource = new MatTableDataSource<PeriodicElement>([]); // Initially empty
  filteredEndpointCards = new MatTableDataSource<any>([]); // Initially empty

  displayedColumns: string[] = ['Api Name', 'state', 'plan', 'status', 'Action'];
  constructor(private mainSer: MainService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private communicationsrv: CommunicationService
  ) {

  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;


  // ngAfterViewInit() {
  //   this.filteredEndpointCards.paginator = this.paginator; // Assign paginator after view initialization
  // }

  loadCards(userId: any) {
    this.mainSer.getEndpointCards(userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.endpointCards = res.endpointCards
        // this.filteredEndpointCards = this.endpointCards.filter(
        //   (card:any) => card.isSubscribed === true || card.isSubscribed != undefined
        // );
        this.filteredEndpointCards.data = this.endpointCards.filter(
          (card: any) => card.isSubscribed === true
        );
        console.log("Filtered subscriptions:", this.filteredEndpointCards);
        console.log("subscriptions:", this.endpointCards);
      },
      error: (err) => {
        console.error(err);
        // this.showError(err?.error?.message);
        // this.isShowNoApisCard=true
      }
    })
  }
  applicationId: any;
  ngOnInit() {
    const userId = localStorage.getItem('userid')
    this.loadCards(userId)

    this.communicationsrv.showSubscriptionApplications$.subscribe(() => {
      this.loadCards(userId)
    })

    this.route?.parent?.paramMap.subscribe(params => {
      this.applicationId = params.get('applicationId');
      console.log('Application ID:', this.applicationId);
    });
    




  }
  openDialog(): void {
    const dialogRef = this.dialog.open(SubscriptionDialog, {
      data: { appId: this.applicationId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
export interface DialogData {
  // animal: string;
  // name: string;
  appId: string;
}
@Component({
  selector: 'subscription-dialog',
  templateUrl: 'subscription-dialog.html',
  styleUrls: ['./subscription-dialog.css']
})
export class SubscriptionDialog {
  constructor(
    public dialogRef: MatDialogRef<SubscriptionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private mainSer: MainService,
    private applicationSer: ApplicationService,
    private communicationsrv: CommunicationService
  ) { }
  apiCards: any = []
  displayedColumns: string[] = ['No', 'Name', 'Version', 'Status', 'Action'];
  ngOnInit() {
    console.log(this.data);

    const userId = localStorage.getItem('userid')
    if (userId) {
      this.loadCards(userId)
    }



  }

  loadCards(userId: any) {
    this.mainSer.getEndpointCards(userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.apiCards = res.endpointCards
      },
      error: (err) => {
        console.error(err);
        // this.showError(err?.error?.message);
        if (err?.error?.status == 400) {
          // this.isShowNoApisCard=true
        }

      }
    })
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  subscribeToBasic(endpointId:any){
    this.applicationSer.subscribeToBasic(endpointId, this.data.appId).subscribe({
      next: (res) => {
        this.communicationsrv.emitSubscriptions(true)
        console.log(res);
        const userId = localStorage.getItem('userid')
        if (userId) {
          this.loadCards(userId)
        }
        this.dialogRef.close();

      }
    })
  }

  unsubscribeToBasic(endpointId:any){
    this.applicationSer.unsubscribeToBasic(endpointId).subscribe({
      next: (res) => {
        this.communicationsrv.emitSubscriptions(true)
        const userId = localStorage.getItem('userid')
        if (userId) {
          this.loadCards(userId)
        }
        console.log(res);
        this.dialogRef.close();
      }
    })
  }

  subscribeToOAuth(endpointId: any) {
    this.applicationSer.subscribeToOAuth(endpointId, this.data.appId).subscribe({
      next: (res) => {
        this.communicationsrv.emitSubscriptions(true)
        console.log(res);
        const userId = localStorage.getItem('userid')
        if (userId) {
          this.loadCards(userId)
        }
        this.dialogRef.close();

      }
    })
  }
  unsubscribeToOAuth(endpointId: any) {
    this.applicationSer.unsubscribeToOAuth(endpointId).subscribe({
      next: (res) => {
        this.communicationsrv.emitSubscriptions(true)
        const userId = localStorage.getItem('userid')
        if (userId) {
          this.loadCards(userId)
        }
        console.log(res);
        this.dialogRef.close();

      }
    })
  }

  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }
}
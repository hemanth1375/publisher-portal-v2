import { Component, Inject, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent {

  endpointCards: any
  displayedColumns: string[] = ['Api Name','state','plan','status','Action'];
  constructor(private mainSer: MainService,public dialog: MatDialog,private router: Router,private route:ActivatedRoute) {


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
applicationId:any;
  ngOnInit() {
    const userId = localStorage.getItem('userid')
    this.loadCards(userId)
    this.route?.parent?.paramMap.subscribe(params => {
      this.applicationId = params.get('applicationId');
      console.log('Application ID:', this.applicationId);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(SubscriptionDialog, {
      data: {appId:this.applicationId},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
export interface DialogData {
  // animal: string;
  // name: string;
  appId:string;
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
    private mainSer:MainService,
    private applicationSer:ApplicationService
  ) {}
  apiCards:any=[]
  displayedColumns: string[] = ['No','Name', 'Version','Status','Action'];
  ngOnInit(){
    console.log(this.data);
    
    const userId=localStorage.getItem('userid')
    if(userId){
      this.loadCards(userId)
    }
  }

  loadCards(userId: any) {
    this.mainSer.getEndpointCards(userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.apiCards = res.endpointCards
      },
      error:(err)=>{
        console.error(err);
        // this.showError(err?.error?.message);
        if(err?.error?.status==400){
          // this.isShowNoApisCard=true
        }
        
      }
    })
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  subscribeToApi(endpointId:any){
    this.applicationSer.subscribeToApp(endpointId,this.data.appId).subscribe({
      next:(res)=>{
        console.log(res);
        this.dialogRef.close();
      }
    })
  }
  unsubscribeToApi(endpointId:any){
    this.applicationSer.unsubscribeToApp(endpointId).subscribe({
      next:(res)=>{
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
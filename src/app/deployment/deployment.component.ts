import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { switchMap } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrl: './deployment.component.css'
})
export class DeploymentComponent {

  constructor(private route:ActivatedRoute,public dialog: MatDialog){}
endpointId:any;
  ngOnInit(): void {
    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(GatewayDialog, {
       data: {
        endpointId:this.endpointId
       },
      
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}

export interface DialogData {
 endpointId:string
}
@Component({
  selector: 'gateway-link',
  templateUrl: 'gateway-link.html',
  styleUrls: ['./gateway-link.css']
})
export class GatewayDialog {
  constructor(
    public dialogRef: MatDialogRef<GatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private mainSer:MainService,
    private toastService:ToastService
  ) {}
  gatewayCards:any;

  showSuccess(message:string) {
    this.toastService.show(message, { type: 'success' });
  }

  showError(message:string){
    this.toastService.show(message , {type:"error"})
  }

  getGatewayCards(){
    this.mainSer.getCards().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.gatewayCards=res.cards;
      },
      error:(err:any)=>{
        console.log(err);
        this.showError(err?.message);
        
      }
    })
  }
  ngOnInit(){
    console.log(this.data);
    
    this.getGatewayCards()
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // toggleSelection(card: any): void {
  //   card.isSelected = !card.isSelected;
  //   console.log('Selected Card ID:', card.isSelected ? card.id : 'None');
  // }
  krakendId:any
  selectCard(selectedCard: any): void {
    // Deselect all cards
    this.gatewayCards.forEach((card:any) => (card.isSelected = false));
    // Select the clicked card
    selectedCard.isSelected = true;
    this.krakendId=selectedCard.id;
    console.log('Selected Card ID:', selectedCard.id);
  }

  linkAndDeploy(){
    
      this.mainSer.linkEndpointWithGateway(this.data.endpointId,this.krakendId).pipe(
        switchMap((firstApiResponse:any) => {
          console.log('First API Response:', firstApiResponse);
          // Use `firstApiResponse` if needed in the second API call
          return this.mainSer.deployEndpoint(this.krakendId);
        })
      ).subscribe({
        next: (secondApiResponse:any) => {
          console.log('Second API Response:', secondApiResponse);
          this.showSuccess(secondApiResponse?.message);
          this.dialogRef.close();
        },
        error: (error:any) => {
          console.error('Error occurred:', error);
          this.showError(error?.message);
          this.dialogRef.close();
        },
      });
    
  }
  // callFirstApi() {
  //   return this.http.get('https://api.example.com/first-endpoint');
  // }

  // callSecondApi() {
  //   return this.http.get('https://api.example.com/second-endpoint');
  // }

}

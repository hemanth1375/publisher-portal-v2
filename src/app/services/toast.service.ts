import { Injectable,TemplateRef } from '@angular/core';

export interface Toast {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

	toasts: any[] = [];

	// Add a new toast
	show(message: string, options: any = {}) {
	  this.toasts.push({ message, ...options });
	}
  
	// Remove a specific toast
	remove(toast: any) {
	  this.toasts = this.toasts.filter((t) => t !== toast);
	}
  
	// Clear all toasts
	clear() {
	  this.toasts = [];
	}

  
}

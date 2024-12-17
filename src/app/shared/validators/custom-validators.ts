import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static jsonValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // No value, no validation needed
      }
      try {
        JSON.parse(value); // Validate JSON
        return null; // Valid JSON
      } catch (error) {
        return { invalidJson: true }; // Return error if invalid JSON
      }
    };
  }
}

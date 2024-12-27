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

  static arrayNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return Array.isArray(value) && value.length === 0 ? { arrayEmpty: true } : null;
  }

  static cidrValidator(cidrArrayValue: any[]): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (cidrArrayValue.length === 0 && !control.value) {
        return { cidrRequired: 'one cidr is must' };
      }
      return null;
    };
  }

  static anyOfValidator(fields: string[]): (group: AbstractControl) => ValidationErrors | null {
    return (group: AbstractControl): ValidationErrors | null => {
      const atLeastOneFilled = fields.some(field => !!group.get(field)?.value);

      if (!atLeastOneFilled) {
        return { anyOfError: true }; // Return an error if neither field is filled
      }
      return null; // Validation passed
    };
  }

  static oneOfValidator(field1: string, field2: string): (group: AbstractControl) => ValidationErrors | null {
    return (group: AbstractControl): ValidationErrors | null => {
      const field1Value = group.get(field1)?.value;
      const field2Value = group.get(field2)?.value;

      if (!field1Value && !field2Value) {
        return { oneOf: `Either ${field1} or ${field2} must be provided.` };
      }
      if (field1Value && field2Value) {
        return { oneOf: `Only one of ${field1} or ${field2} can be provided.` };
      }
      return null; // Validation passes
    };
  }
  

}

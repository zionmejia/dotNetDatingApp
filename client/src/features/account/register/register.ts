import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { FormControl } from '@angular/forms';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  public currentStep = signal(1);
  public membersFromHome = input.required();
  public cancelRegister = output<boolean>();
  public registerForm: FormGroup = new FormGroup({});
  public profileForm: FormGroup = new FormGroup({});
  protected validationErrors = signal<string[]>([]);
  private accountService = new AccountService();
  private router = inject(Router);

  ngOnInit() {
    this.initialzeForm();
  }

  public initialzeForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      displayName: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
        this.matchValues('password'),
      ]),
    });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.profileForm = new FormGroup({
      gender: new FormControl('male', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });
  }

  public matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidatorFn | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      // @ts-ignore
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  public register() {
    if (this.profileForm.valid && this.registerForm.valid) {
      const formData = { ...this.registerForm.value, ...this.profileForm.value };

      this.accountService.register(formData).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.router.navigate(['/members']);
          }, 100); // 50ms is usually enough
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  public nextStep() {
    this.currentStep.update((value) => value + 1);
  }

  public prevStep() {
    this.currentStep.update((value) => value - 1);
  }

  public getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}

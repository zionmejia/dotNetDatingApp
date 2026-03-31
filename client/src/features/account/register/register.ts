import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../../interface/userInterface';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  public membersFromHome = input.required();
  public cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  private accountService = new AccountService();

  public register() {
    this.accountService.register(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        this.cancel();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}

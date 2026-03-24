import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
class Nav {
  public accountService = inject(AccountService);
  protected creds: any = {

  }

  login(){
    this.accountService.login(this.creds).subscribe({
      next: result => {
        this.creds = {};
      },
      error: error => alert(error.message)
    })
  }

  logout(){
    this.accountService.logout();
  }

}

export default Nav;

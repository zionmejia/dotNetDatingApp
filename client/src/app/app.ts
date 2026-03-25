import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Nav from '../layout/nav/nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // fixed typo: styleUrls instead of styleUrl
})
export class App  {
  protected router = inject(Router);

}

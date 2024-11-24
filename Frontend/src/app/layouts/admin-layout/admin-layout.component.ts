import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from 'express';
import { NavbarComponent } from "../../commons/navbar/navbar.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}

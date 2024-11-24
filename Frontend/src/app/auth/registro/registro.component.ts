import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  constructor(private router: Router){}

  redirigir(): void{
    this.router.navigate(['/login']);
  }
}

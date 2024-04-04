import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WujieForAngularModule } from 'wujie-for-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WujieForAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'example';

  onBeforeload = () => {
    console.log('beforeload');
  };
}

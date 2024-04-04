import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WujieAngularModule } from 'wujie-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WujieAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'example';

  onBeforeload = () => {
    console.log('beforeload');
  };
}

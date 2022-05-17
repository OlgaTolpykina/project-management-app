import { Component } from '@angular/core';
import { ProgressBarService } from '@core/services/loading/progress-bar.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor(public loadingService: ProgressBarService) {}
}

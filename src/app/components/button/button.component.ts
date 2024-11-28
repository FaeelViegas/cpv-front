import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTone } from 'src/app/util/tone';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() icon: string = '';
  @Input() href: string = '';
  @Input() submit: boolean = false;
  @Input() tone: ComponentTone = "neutral";
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;

  @Output() appButtonClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  onAppButtonClick(event: Event) {
    this.appButtonClick.emit();
    if (this.submit) {
      return;
    }
    event.preventDefault();
  }

  generateButtonAttributes(): { [key: string]: any } {
    const attributes = {
      'button': true,
      'has-icon': this.icon,
      [this.tone]: true
    };

    return attributes;
  }
}

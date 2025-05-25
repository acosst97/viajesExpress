import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgTemplateOutlet,CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
@Input() header: String;
  @ContentChild('body', { static: false }) bodyTemplateRef: TemplateRef<any>
  @ContentChild('options', { static: false }) optionsTemplateRef: TemplateRef<any>
}

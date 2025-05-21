import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, HostListener, Input, Output, signal, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { selectOptions } from '../../interfaces/usuarios';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: '0', opacity: 0, transform: 'translateY(-50px)', filter: "blur(5px)" }),
            animate('0.2s ease-out',
              style({ height: '100%', opacity: 1, transform: 'translateY(0px)', filter: "blur(0px)" }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: '100%', opacity: 1, transform: 'translateY(0px)', filter: "blur(0px)" }),
            animate('0.2s ease-in',
              style({ height: '0', opacity: 0, transform: 'translateY(-50px)', filter: "blur(5px)" }))
          ]
        )
      ]
    )
  ]
})
export class SelectComponent {
  @Input() set options(value: selectOptions[]) {
    this.optionsSignal.set(value);
    this.filteredOptions.set(value);
  }
  optionsSignal = signal<selectOptions[] | null>(null);
  filteredOptions = signal<selectOptions[] | null>(null); // Lista filtrada
  //'data' que recibirá los datos provenientes de otros componentes.
  // @Input() options: selectOptions[];
  @Output() optionSelected = new EventEmitter<any>();
  @Input() isDisabled: boolean = false; //controlar bloqueo de listas. 
  @Input() placeholder: string = 'opción'
  @Input() selectedOpt: any | null = null;

  showList: boolean = false;
  searchControl = new FormControl('');
  @Input() closeTrigger!: Subject<void>; // Escuchar el cierre del modal
  private destroy$ = new Subject<void>();



  @Input() set searchItem(value: selectOptions[]) {
    this.searchValue.set(value);
  }
  searchValue = signal<selectOptions[] | null>(null);

  // filteredOptions = computed(() => {
  //   const searchText = this.searchControl.value?.toLowerCase() || '';
  //   console.log("data encontrada", searchText);
  //   return this.optionsSignal()?.filter(option =>
  //     option.text.toLowerCase().includes(searchText)
  //   ) || [];
  // });

  //'selectedOption' almacenará la opción 
  rutaActual = this.route.url;
  selectedOption: any;
  touched: any;
  shortStyle: boolean;


  ngOnInit() {
    //*controlar el bloqueo por si se cierra la lista fuera de los modales. 
    if (this.closeTrigger) {
      this.closeTrigger.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.showList = false;
      });
    }
    this.searchControl.valueChanges.subscribe(value => {
      this.filterOptions(value);
    });
  }

  //Método para filtrar opciones basado en la búsqueda
  filterOptions(searchText: string) {
    const lowerSearch = searchText.toLowerCase();
    this.filteredOptions.set(this.optionsSignal()?.filter(option =>
      option.text.toLowerCase().includes(lowerSearch)
    ) || []);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef, private route: Router) {
    effect(() => {
      this.cdRef.detectChanges();
      if (this.rutaActual != '/dashboard/account-rollCash/see-movements') {
        if (this.optionsSignal() && this.optionsSignal().length > 0) {
          // console.log('Nuevo valor opciones:', this.optionsSignal());
          this.selectedOption = this.optionsSignal()[0];
          this.optionSelected.emit(this.selectedOption);
        }
      }
    });
  }

  //Método que muestra/oculta el listado de opciones.
  openSelectList() {
    if (this.isDisabled) return;  // Si está deshabilitado, no hace nada
    this.showList = !this.showList;
  }

  selectOption(option: any) {
    this.optionSelected.emit(option);
  }
  //Método para detectar si alguna opción fue seleccionada.
  chooseOption(itemSelected: any) {
    if (this.selectedOption === itemSelected) {
      this.showList = !this.showList;
    } else {
      this.selectedOption = itemSelected;
      this.optionSelected.emit(this.selectedOption);
      this.showList = false;
    }

    //*controlar por si se cierra la lista fuera de los modales.
    if (this.closeTrigger) {
      this.closeTrigger.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.showList = false;
      });
    }

    //Si la opción seleccionada por el usuario ya fue elegida se deselecciona.
    // this.selectedOption = this.selectedOption !== itemSelected ? itemSelected : undefined;
    // this.optionSelected.emit(this.selectedOption);
    // this.openSelectList();
  }

  //Detector de eventos click en el documento.
  @HostListener('document:click', ['$event'])
  closeSelectList(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showList = false;
    }
  }
  //Esperar que halla Data  para  seleccionar la primera opcion de la lista
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && this.options) {
      this.cdRef.detectChanges();
      if (this.rutaActual != '/dashboard/account-rollCash/see-movements') {
        if (this.options && this.options.length > 0) {
          this.selectedOption = this.options[0];
          this.optionSelected.emit(this.selectedOption);
        }
      }
    }
}
 }

import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, forwardRef, ViewChild, AfterViewInit } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService, BsDaterangepickerDirective, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-datapicker',
  templateUrl: './app-datepicker.component.html',
  styleUrls: ['./app-datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDatapickerComponent),
      multi: true
    }
  ]
})
export class AppDatapickerComponent implements OnInit, OnDestroy, ControlValueAccessor, AfterViewInit {
  @ViewChild('dp') datepicker!: BsDatepickerDirective | BsDaterangepickerDirective;

  @Input() config: Partial<BsDatepickerConfig> = {};
  @Input() useCurrentDate = false;
  @Input() placeholder = 'Selecione uma data';
  @Input() isRange = false;
  @Output() dateChange = new EventEmitter<Date[] | Date>();

  selectedDate: Date[] | Date | null = null;
  bsConfig: Partial<BsDatepickerConfig>;

  private scrollSubscription?: Subscription;
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(
    private localeService: BsLocaleService
  ) {
    const customPtBr = { ...ptBrLocale };
    customPtBr.invalidDate = 'Data inválida';

    defineLocale('pt-br', customPtBr);
    localeService.use('pt-br');
  }

  ngOnInit(): void {
    const defaultConfig: Partial<BsDatepickerConfig> = {
      dateInputFormat: this.isRange ? 'DD/MM/YYYY - DD/MM/YYYY' : 'DD/MM/YYYY',
      containerClass: 'theme',
      isAnimated: true,
      showWeekNumbers: false,
      showTodayButton: true,
      showClearButton: true,
      clearButtonLabel: 'Limpar',
      todayButtonLabel: "Hoje",
      rangeInputFormat: 'DD/MM/YYYY',
      selectFromOtherMonth: true,
      customTodayClass: 'custom-today-class',
      ranges: this.isRange ? [
        {
          value: [new Date(), new Date()],
          label: 'Hoje'
        },
        {
          value: [
            new Date(new Date().setDate(new Date().getDate() - 7)),
            new Date()
          ],
          label: 'Últimos 7 dias'
        },
        {
          value: [
            new Date(new Date().setDate(new Date().getDate() - 30)),
            new Date()
          ],
          label: 'Últimos 30 dias'
        }
      ] : undefined,
      clearPosition: 'right',
    }
    this.bsConfig = { ...defaultConfig, ...this.config };

    if (this.useCurrentDate) {
      this.selectedDate = this.isRange ? [new Date(), new Date()] : new Date();
    }

    this.scrollSubscription = fromEvent(window, 'scroll', { capture: true })
      .subscribe(() => {
        if (this.datepicker?.isOpen) {
          this.datepicker.hide();
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.datepicker) {
      this.datepicker.onShown.subscribe(() => {
        const dropdownContainer = document.querySelector('.bs-datepicker-container');
        if (dropdownContainer) {
          dropdownContainer.removeEventListener('scroll', () => this.datepicker.hide());
          dropdownContainer.addEventListener('scroll', () => this.datepicker.hide(), { once: true });
        }
      });
    }
  }


  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    const dropdownContainer = document.querySelector('.bs-datepicker-container');
    if (dropdownContainer) {
      dropdownContainer.removeEventListener('scroll', () => this.datepicker?.hide());
    }
  }

  onDateChange(newDate: (Date | undefined)[] | Date | undefined): void {
    if (!newDate) {
      this.selectedDate = null;
      this.onChange(null);
      this.dateChange.emit(undefined);
      return;
    }

    if (Array.isArray(newDate)) {
      const validDates = newDate.filter((date): date is Date => date instanceof Date);
      if (validDates.length === 2) {
        this.selectedDate = validDates as Date[];
        this.onChange(validDates);
        this.dateChange.emit(validDates);
      }
    } else if (newDate instanceof Date) {
      this.selectedDate = newDate;
      this.onChange(newDate);
      this.dateChange.emit(newDate);
    }
  }

  writeValue(value: Date[] | Date | null): void {
    if (Array.isArray(value)) {
      if (value.every(date => date instanceof Date)) {
        this.selectedDate = value;
      }
    } else if (value instanceof Date) {
      this.selectedDate = value;
    } else {
      this.selectedDate = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  formatInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const format = this.isRange
      ? this.bsConfig.rangeInputFormat || 'DD/MM/YYYY'
      : this.bsConfig.dateInputFormat || 'DD/MM/YYYY';

    let value = input.value.replace(/\D/g, '');

    const maxDigits = (format.match(/[DMY]/g) || []).length * (this.isRange ? 2 : 1);

    if (value.length > maxDigits) {
      value = value.substr(0, maxDigits);
    }

    let formattedValue = '';

    if (this.isRange) {
      const firstHalf = value.substr(0, value.length / 2);
      const secondHalf = value.substr(value.length / 2);

      formattedValue = this.formatDatePart(firstHalf, format);
      if (secondHalf.length > 0) {
        formattedValue += ' - ' + this.formatDatePart(secondHalf, format);
      }
    } else {
      formattedValue = this.formatDatePart(value, format);
    }

    input.value = formattedValue;
  }

  private formatDatePart(value: string, format: string): string {
    let formattedValue = '';
    let valueIndex = 0;

    for (let i = 0; i < format.length && valueIndex < value.length; i++) {
      if (format[i].match(/[DMY]/)) {
        formattedValue += value[valueIndex];
        valueIndex++;
      } else {
        formattedValue += format[i];
        if (valueIndex < value.length) {
          formattedValue += value[valueIndex];
          valueIndex++;
        }
      }
    }

    return formattedValue;
  }

  validateNumberOnly(event: KeyboardEvent): boolean {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    const format = this.isRange
      ? this.bsConfig.rangeInputFormat || 'DD/MM/YYYY'
      : this.bsConfig.dateInputFormat || 'DD/MM/YYYY';
    const separator = format.replace(/[DMY]/g, '')[0] || '/';

    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return true;
    }

    if (event.key === separator || event.key === '-') {
      return true;
    }

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
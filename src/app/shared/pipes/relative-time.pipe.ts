import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const diffMs = Date.now() - new Date(value).getTime();

    const MINUTE = 60_000;
    const HOUR = 3_600_000;
    const DAY = 86_400_000;
    const MONTH = 2_592_000_000;
    const YEAR = 31_536_000_000;

    if (diffMs < MINUTE) return 'hace un momento';
    if (diffMs < HOUR) {
      const mins = Math.floor(diffMs / MINUTE);
      return `hace ${mins} min`;
    }
    if (diffMs < DAY) {
      const hours = Math.floor(diffMs / HOUR);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    if (diffMs < MONTH) {
      const days = Math.floor(diffMs / DAY);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (diffMs < YEAR) {
      const months = Math.floor(diffMs / MONTH);
      return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    const years = Math.floor(diffMs / YEAR);
    return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionStatus'
})
export class TransactionStatusPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {

    const status = value.toLowerCase()

    switch (status) {
      case 'pend':
        return 'pending'
        break;
      case 'void':
        return 'voided'
        break;
      case 'del':
        return 'deleted'
        break;
      case 'cnl':
        return 'cancelled'
        break;
      case 'failed':
        return 'failed'
        break;
      case 'ins':
        return 'insufficient fund'
        break;
      case 'not_pend':
        return 'Not Pending'
        break;

      default:
        break;
    }
    return null;
  }

}

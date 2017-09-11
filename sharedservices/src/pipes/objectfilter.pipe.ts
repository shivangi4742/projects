import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'objectfilter',
  pure: false 
})
export class ObjectFilterPipe implements PipeTransform {
  transform(objs: any[], filter: any): any[] {
    if(!objs || !filter)
      return objs;

    return objs.filter(o => o[filter.key] == filter.value);
  }
}
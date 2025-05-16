import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(data: any[], valorBusqueda: any, columnaTablaBusqueda: any): any {

    let result: any = [];

    if (columnaTablaBusqueda === 'Todas las columnas') {

      //filtrar por todas las columnas

      for (let columna of Object.keys(data[0])) {

        let temporal = data.filter((elemento: any) => elemento[columna]?.toString().toLowerCase().includes(valorBusqueda.toLowerCase()));

        if (temporal[0] !== undefined) {

          result = temporal;

        }

        //agrega todas las conincidencias de cada una de las columnas

        // for (let item of temporal) {

        //     result.push(item);

        // }

        // //elimina las coincidencias repetidas

        // var hash: any = {};

        // result = result.filter((elemento: any) => hash[elemento[columna]] ? false : hash[elemento[columna]] = true);

      }

    } else {

      //filtra por un parametro dado

      result = data.filter((elemento: any) => elemento[columnaTablaBusqueda]?.toString().toLowerCase().includes(valorBusqueda.toLowerCase()));

    }

    return result;

  }

}

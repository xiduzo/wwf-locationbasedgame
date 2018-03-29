import { Injectable } from '@angular/core';

@Injectable()
export class GeolocationService {

  constructor() {}

  closeToPoint(currentLocation:any, point:any, threshold:number):boolean {
    const distance = this.distanceToPoint(currentLocation, point);

    return (distance * 1000 < threshold) ? true : false;
  }

  distanceToPoint(currentLocation:any, point:any):number {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((point.latitude - currentLocation.latitude) * p)/2 +
            c(currentLocation.latitude * p) * c(point.latitude * p) *
            (1 - c((point.longitude - currentLocation.longitude) * p))/2;

    // Return in meters
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
}

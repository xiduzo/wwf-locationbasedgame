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

    // Return in kilometers
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  // https://stackoverflow.com/a/27939662
  getBearing(lat1,lng1,lat2,lng2) {
      var dLon = this._toRad(lng2-lng1);
      var y = Math.sin(dLon) * Math.cos(this._toRad(lat2));
      var x = Math.cos(this._toRad(lat1))*Math.sin(this._toRad(lat2)) - Math.sin(this._toRad(lat1))*Math.cos(this._toRad(lat2))*Math.cos(dLon);
      var brng = this._toDeg(Math.atan2(y, x));
      return ((brng + 360) % 360);
  }

  _toRad(deg) { return deg * Math.PI / 180; }

  _toDeg(rad) { return rad * 180 / Math.PI; }

}

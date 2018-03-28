import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Constants } from '../../lib/constants'
import  'rxjs/add/operator/filter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public _map: any;
  public _locationMarker: any;
  public SUBSCRIPTION;
  public followPosition:boolean = false;
  public _pois:any = [
    {lat: 52.35615253511886, lon: 4.856342029571579, name: 'checkpoint 1'},
    {lat: 52.355156520991045, lon: 4.857371997833297, name: 'checkpoint 2'},
    {lat: 52.35509099295879, lon: 4.856277656555221, name: 'checkpoint 3'},
  ];

  constructor(
    public navCtrl: NavController,
    protected geolocation: Geolocation
  ) {
  }

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoieGlkdXpvIiwiYSI6ImNqZHU3bnBncjJpNDIyeHFvMWh6NjA2amoifQ.SzgCLkqb9wUmQbIpdNhwuA';
    let mapStyle:any = Constants.MAP_STYLE;
    mapStyle.sources.overlay = {
      type: "image",
      url: "http://localhost:8100/assets/imgs/maps/vondel.png",
      coordinates: [
        [4.85530151200328, 52.36360251297369],
        [4.882552755594588, 52.36360251297369],
        [4.882552755594588, 52.35187368967347],
        [4.85530151200328, 52.35187368967347]
      ]
    };
    // console.log(mapStyle.sources.overlay);
    // console.log(mapStyle.sources);
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [4.86, 52.356],
      zoom: 17,
      // minZoom: 15, //restrict map zoom - buildings not visible beyond 13
      maxZoom: 20,
      container: 'map'
    });

    this._map.on('movestart', () => {
      this.followPosition = false;
    });

    this.addPoiToMap();
  }

  ionViewWillEnter() {
    this.SUBSCRIPTION = this.geolocation.watchPosition()
    .filter((p) => p.coords !== undefined) //Filter Out Errors
    .subscribe(position => {
      if(this._locationMarker) { this._locationMarker.remove(); }

      var el = document.createElement('div');
      el.className = 'position__marker';
      this._locationMarker = new mapboxgl.Marker(el)
      .setLngLat([position.coords.longitude, position.coords.latitude])
      .addTo(this._map);

      this.checkIfNearPoi(position.coords);

      if(this.followPosition) {
        this.moveToMyLocation();
      }
    });
  }

  ionViewDidEnter() {
    this.moveToMyLocation();
  }

  ionViewWillLeave() {
    // We do not need to drain the users batery
    this.SUBSCRIPTION.unsubscribe();
  }

  // Get geolocation of phone
  moveToMyLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // Update the map
      this._map.flyTo({
        center: [resp.coords.longitude, resp.coords.latitude],
        zoom: 17
      });
      this.followPosition = true;
    }).catch((error) => {
      console.log('Error getting location', error)
    });
  }

  addPoiToMap() {
    this._pois.forEach(poi => {
        var el = document.createElement('div');
        el.className = 'flag_marker';
        new mapboxgl.Marker(el)
        .setLngLat([poi.lon, poi.lat])
        .addTo(this._map);
    });
  }

  checkIfNearPoi(coords) {
    this._pois.forEach(poi => {
      let distance = this.distanceToPoi(
        coords.latitude,
        coords.longitude,
        poi.lat,
        poi.lon
      );

      // Within X meters
      if(distance * 1000 < 10) {
        console.log("at checkpoint", poi.name);
      }
    });
  }

  distanceToPoi(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    // Return in meters
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

}

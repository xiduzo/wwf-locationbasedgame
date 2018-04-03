import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Constants } from '../../lib/constants'
import  'rxjs/add/operator/filter';

import { AlertController } from 'ionic-angular';

import { IntroductionModel } from '../models/introduction/introduction'
import { MapModel } from '../models/map/map'

import { GeolocationService } from '../../lib/geolocation';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public _map: any;
  public _locationMarker: any;
  public SUBSCRIPTION:any;
  public followPosition:boolean = false;
  public _pois:any = [
    {lat: 52.35615253511886, lon: 4.856342029571579, name: 'checkpoint 1', game: 'walkapath'},
    {lat: 52.355156520991045, lon: 4.857371997833297, name: 'checkpoint 2', game: 'makeapicture'},
    {lat: 52.35509099295879, lon: 4.856277656555221, name: 'checkpoint 3', game: 'sound'},
  ];

  constructor(
    public navCtrl: NavController,
    protected geolocation: Geolocation,
    public modalCtrl: ModalController,
    private geolocationService: GeolocationService,
    public alertCtrl: AlertController,
    private nativeAudio: NativeAudio
  ) {
  }

  ngOnInit() {
    const model = this.modalCtrl.create(MapModel);
    model.present();
    // Set complex volume doesnt seem to work, so made this quick sollution
    this.nativeAudio.preloadComplex('frogSound_close', '../../assets/sounds/frog.mp3', 1, 1, 0);
    this.nativeAudio.preloadComplex('frogSound_medium', '../../assets/sounds/frog.mp3', 0.75, 1, 0);
    this.nativeAudio.preloadComplex('frogSound_far', '../../assets/sounds/frog.mp3', 0.5, 1, 0);
    this.nativeAudio.preloadComplex('frogSound_start', '../../assets/sounds/frog.mp3', 0.25, 1, 0);

    mapboxgl.accessToken = Constants.ACCESS_TOKEN;
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
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [4.86, 52.356],
      zoom: 17,
      minZoom: 17, //restrict map zoom - buildings not visible beyond 13
      maxZoom: 17,
      container: 'homemap'
    });

    this._map.on('movestart', () => {
      this.followPosition = false;
    });

    this.addPoiToMap();
  }

  ionViewWillEnter() {
    this.watchPosition();
  }

  ionViewDidEnter() {
    this.moveToMyLocation();
  }

  ionViewWillLeave() {
    // We do not need to drain the users batery
    if(this.SUBSCRIPTION) this.SUBSCRIPTION.unsubscribe()
  }

  watchPosition() {
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

      if(this.followPosition) this.moveToMyLocation()
    });
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
      console.log('Error getting location', JSON.stringify(error));
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
      const closeToPoint = this.geolocationService.closeToPoint(
        {latitude: coords.latitude, longitude: coords.longitude},
        {latitude: poi.lat, longitude: poi.lon},
        10
      );

      if(poi.game === 'sound') {
        const distance1 = this.geolocationService.closeToPoint(
          {latitude: coords.latitude, longitude: coords.longitude},
          {latitude: poi.lat, longitude: poi.lon},
          10
        );
        const distance2 = this.geolocationService.closeToPoint(
          {latitude: coords.latitude, longitude: coords.longitude},
          {latitude: poi.lat, longitude: poi.lon},
          30
        );
        const distance3 = this.geolocationService.closeToPoint(
          {latitude: coords.latitude, longitude: coords.longitude},
          {latitude: poi.lat, longitude: poi.lon},
          50
        );

        if(distance1) {
          this.nativeAudio.play('frogSound_close');
        } else if(distance2) {
          this.nativeAudio.play('frogSound_medium');
        } else if(distance3) {
          this.nativeAudio.play('frogSound_far');
        } else {
          this.nativeAudio.play('frogSound_start');
        }

        console.log(distance1, distance2, distance3);
      }

      if(closeToPoint) this.showModel(poi, coords)
    });
  }

  showModel(poi, coords) {
    // Dont need to watch position anymore
    if(this.SUBSCRIPTION) this.SUBSCRIPTION.unsubscribe()

    const model = this.modalCtrl.create(IntroductionModel, {poi: poi, coords: coords});

    model.onDidDismiss((watch) => {
      if(watch) this.watchPosition()
    });

    model.present();
  }

}

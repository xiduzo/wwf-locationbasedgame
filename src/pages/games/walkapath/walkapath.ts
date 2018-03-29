import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Constants } from '../../../lib/constants'
import  'rxjs/add/operator/filter';


import { GeolocationService } from '../../../lib/geolocation';

@Component({
  selector: 'walk-a-path',
  templateUrl: 'walkapath.html'
})
export class WalkAPathGame {

  // Besic requirements for location
  private _map:any;
  private _locationMarker:any;
  private SUBSCRIPTION;

  private _coords:any;
  private _pathToWalk:any = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            // longitude , latitude
            [4.856323433637954, 52.356121652592265],
            [4.856248331785537, 52.35599387562989],
            [4.856060577154494, 52.356077422147116],
            [4.856060577154494, 52.356077422147116],
            [4.856114221334792, 52.35619209358025],
          ]
        }
      }
    ]
  };
  private _walkedPath:any = {
    type: 'FeatureCollection',
    features: [{type: 'Feature', geometry: {type: 'LineString',coordinates: []}}]
  };


  constructor(
    public navCtrl: NavController,
    protected geolocation: Geolocation,
    private params: NavParams,
    private geolocationService: GeolocationService
  ) {
  }

  ngOnInit() {
    this._coords = this.params.get('coords');
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

      this.moveToMyLocation();
    });
  }

  ionViewDidLoad() {
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
      center: [this._coords.longitude, this._coords.latitude],
      zoom: 18,
      maxZoom: 20,
      container: 'walkapathmap'
    });

    this._map.on('load', () => {
      this.addPathToMap("routeToFollow", this._pathToWalk, '#888');
      this.addPathToMap("walkedPath", this._walkedPath, '#001aff');
    })
  }

  addPathToMap(id, path, color) {
    this._map.addSource(id, { type: 'geojson', data: path });
    this._map.addLayer({
      id: id,
      type: "line",
      source: id,
      "paint": { "line-color": color, "line-width": 8 }
    });
  }

  moveToMyLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this._map.flyTo({center: [resp.coords.longitude, resp.coords.latitude]});

      // Add coords to my walked path
      this._walkedPath.features[0].geometry.coordinates.push([resp.coords.longitude, resp.coords.latitude]);

      // Update the walked path
      if(this._map.getSource('walkedPath')) {
        this._map.getSource('walkedPath').setData(this._walkedPath);
      }

      const closeToPoint = this.geolocationService.closeToPoint(
        {latitude: resp.coords.latitude, longitude: resp.coords.longitude},
        {latitude: 52.35619209358025, longitude: 4.856114221334792},
        5
      );

      console.log(closeToPoint);

    }).catch((error) => {
      console.log('Error getting location', error)
    });
  }
}

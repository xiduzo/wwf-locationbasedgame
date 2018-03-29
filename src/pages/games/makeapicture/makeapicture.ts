import { Component } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'make-a-picture',
  templateUrl: 'makeapicture.html'
})
export class MakeAPictureGame {

  private _cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  public _img:string;
  public _takenImage:boolean = false;

  constructor(
    private camera: Camera
  ) {

  }

  getButton() {
    const button = document.querySelectorAll('.cordova-camera-capture > button')[0];

    if(!button) {
      setTimeout(() => {
        this.getButton();
      }, 200);
    } else {
      button.innerHTML = '<span class="button-inner"><ion-icon name="camera" role="img" class="icon icon-md ion-md-camera" aria-label="camera" ng-reflect-name="camera"></ion-icon></span>';
    }
  }

  makePicture() {
    this.getButton();

    this.camera.getPicture(this._cameraOptions).then((imageData) => {
      this._img = 'data:image/jpeg;base64,' + imageData;
      this._takenImage = true;
      }, (err) => {
      // Handle error
    });
  }

}

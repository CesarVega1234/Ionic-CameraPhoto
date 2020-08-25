import { Injectable } from '@angular/core';
import {
    Plugins,
    CameraResultType,
    Capacitor,
    FilesystemDirectory,
    CameraPhoto,
    CameraSource
  } from '@capacitor/core';
import {Photo} from '../models/photo.interface';

const {Camera, Fylesystem,Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor() { }

  public async addNewToGallery(){

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality:100
    })

    const saveImageFile = await this.savePicture(capturedPhoto);

    this.photos.unshift(saveImageFile);
  }

  public getPhotos(): Photo[] {
    return this.photos;
  }

  private async savePicture(cameraPhoto:CameraPhoto){

    const base64Data = await this.readAsbBase64(cameraPhoto);

    const fileName = new Date().getTime() + '.jpg';
    
    await Filesystem.writeFile({
      path:fileName,
      data:base64Data,
      directory:FilesyystemDirectory.Data
    })
    return await this.getPhotoFile(cameraPhoto, fileName);
  }

  private async readAsbBase64(cameraPhoto:CameraPhoto){
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = () => new Promise((resolve,reject)=>{
    const reader = new FileReader;
    reader.onError = reject;
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob);
  })

}

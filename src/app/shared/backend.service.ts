import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sensor } from '../Sensor';
import { Sensorendata } from '../Sensorendata';
import { SensorendataResponse } from '../SensorendataResponse';
import { ErrorService } from './error.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  port = 55000;
  callback: Function;

  constructor(private storeService: StoreService, private http: HttpClient, private readonly errorService: ErrorService) { }

  sensoren: Sensor[] = [];

  public async getSensoren() {
    this.sensoren = await firstValueFrom(this.http.get<Sensor[]>(`http://localhost:${this.port}/sensors`));
    this.storeService.sensoren = this.sensoren;
  }

  public async getSensorenDaten() {
    try {
      const sensorenDataResponse = await firstValueFrom(this.http.get<SensorendataResponse[]>(`http://localhost:${this.port}/sensorsData`));
      const sensorenData: Sensorendata[] = sensorenDataResponse.map(data => {
        const sensor: Sensor = this.sensoren.filter(sensor => sensor.id == data.sensorId)[0];
        return { ...data, sensor }
      });
      sensorenData.sort((sd1, sd2) => new Date(sd2.date).getTime() - new Date(sd1.date).getTime());
      this.storeService.sensorenDaten = sensorenData;

      this.callback();
    } catch (e) {
      this.errorCallback(e);
    }
  }

  public async addSensorsData(sensorenData: Sensorendata[]) {
    try {
      await firstValueFrom(this.http.post(`http://localhost:${this.port}/sensorsData`, sensorenData));
      await this.getSensorenDaten();
    } catch (e) {
      this.errorCallback(e);
    }
  }

  public async deleteSensorsDaten(sensorId: number) {
    try {
      await firstValueFrom(this.http.delete(`http://localhost:${this.port}/sensorsData/${sensorId}`));
      await this.getSensorenDaten();
    } catch (e) {
      this.errorCallback(e);
    }
  }

  public registerReloadCallback(callback: Function) {
    this.callback = callback;
  }

  private errorCallback(error: any): any {
    this.errorService.showError(error.message);
  }
}

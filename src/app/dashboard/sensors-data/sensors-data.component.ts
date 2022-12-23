import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SensorPosition } from 'src/app/Sensor';
import { Sensorendata } from 'src/app/Sensorendata';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  styleUrls: ['./sensors-data.component.scss']
})
export class SensorsDataComponent implements OnInit, AfterViewInit {
  loading = false;

  displayedColumns: string[] = ['sensor', 'date', 'temperature', 'humidity', 'location', 'position', 'delete'];

  dataSource = new MatTableDataSource<Sensorendata>();

  deleting: Number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public get SensorPosition() {return SensorPosition; }

  constructor(private backendService: BackendService, public storeService: StoreService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {
    this.loading = true;
    this.backendService.registerReloadCallback(() => {
      this.initDataSource();
    });
    await this.backendService.getSensoren();
    await this.backendService.getSensorenDaten();
    this.initDataSource();
    this.loading = false;
  }

  async deleteSensordata(id: number) {
    this.deleting = id;
    await this.backendService.deleteSensorsDaten(id);
    this.deleting = -1;
  }

  initDataSource() {
    this.dataSource.data = this.storeService.sensorenDaten;
    this.dataSource.paginator = this.paginator;
  }
}

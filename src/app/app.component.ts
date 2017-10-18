import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // default map settings
  lat: number = 52.0;
  lng: number = 20.0;
  zoom: number = 4;

  // marker placed by user
  markerLat: number = null;
  markerLng: number = null;

  // for current weather conditions
  sky: string = null;
  icon: string =null;
  temperature: number = null;
  windSpeed: number = null;
  windDir: string = null;
  rain: number = null;
  snow: number = null;

  // forecast for upcoming days
  forecast: any = [];
  showForecast: boolean = false; 

  // entered city
  city: string = '';


  constructor(private dataService: DataService) {
	}


  // handling click on the map
  mapClicked(event) {
    this.markerLat = event.coords.lat;
    this.markerLng = event.coords.lng;
    this.city = '';
    
    // getting current weather data for clicked place
    this.dataService.getCurrentWeatherByCoodrs(event.coords.lat, event.coords.lng).subscribe(response => {
      this.sky = response.weather[0].description;
      this.icon = response.weather[0].icon;
      this.temperature = Math.round(response.main.temp - 273.15);
      this.windSpeed = response.wind.speed;
      this.windDir = this.mapWindDir(response.wind.deg);
      this.rain = (response.rain) ? response.rain['3h'] : 0;
      this.snow = (response.snow) ? response.snow['3h'] : null;
    });
  }


  // replacing wind dierenction in degrees with arrow
  mapWindDir(deg) {
    const value = Math.floor((deg / 45) + 0.5);
    const arrows = ['&#8595;', '&#8601;', '&#8592;', '&#8598;', '&#8593;', '&#8599;', '&#8594;', '&#8600;', '&#8595;'];
    return arrows[value % 8];
  }


  // handling entering city name
  findByCity(e) {
    e.preventDefault();

    // getting current weather data for entered city
    this.dataService.getCurrentWeatherByCity(this.city).subscribe(
      response => {
        // placing makrer on the map
        this.lat = response.coord.lat;
        this.lng = response.coord.lon;
        this.markerLat = response.coord.lat;
        this.markerLng = response.coord.lon;
        this.zoom = 8;

        this.sky = response.weather[0].description;
        this.icon = response.weather[0].icon;
        this.temperature = Math.round(response.main.temp - 273.15);
        this.windSpeed = response.wind.speed;
        this.windDir = this.mapWindDir(response.wind.deg);
        this.rain = (response.rain) ? response.rain['3h'] : 0;
        this.snow = (response.snow) ? response.snow['3h'] : null;
      },
      error => { // resetting map is no such place exists
        this.resetMap();
      }
    );
  }


  // handling click on "Forecast" button
  forecastButtonClicked() {
    // getting 10 days forecast for given place
    this.dataService.getForecastByCoords(this.markerLat, this.markerLng).subscribe(response => {
      this.forecast = response.list;
      this.showForecast = true;
     });
  }


  // handling click on "X" button - closing modal
  closeForecastModal() {
    this.showForecast = false;
  }


  // rounding temperature to full degrees Celcuis
  roundTemperature(temp) {
    return Math.round(temp - 273.15);
  }


  // returning date string in DD.MM.YYYY format
  getDateString(dt) {
    const date = new Date(dt*1000);
    return date.toLocaleDateString();
  }


  // returning day of the week based on day number (0-6)
  getDay(dt) {
    const date = new Date(dt*1000);
    const day = date.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }


  // resetting map and all weather conditions / forecasts
  resetMap() {
    this.lat = 52.0;
    this.lng = 20.0;
    this.markerLat = null;
    this.markerLng = null;
    this.zoom = 4;
    this.sky = null;
    this.icon = null;
    this.temperature = null;
    this.windSpeed = null;
    this.windDir = null;
    this.rain = null;
    this.snow = null;
    this.forecast = [];
  }

}

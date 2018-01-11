import { Component } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';
import { MouseEvent } from '@agm/core';
import { Marker } from './marker';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  // google maps zoom level
  zoom: number = 8;
  
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    console.log($event.coords);
    let marks = this.markers;
    let len = marks.length;
    marks.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      label: String.fromCharCode(len+65),
      draggable: true
    });
  }
  
  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  markers: Marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]

  remove_marker(item) {
    let str = this.tours.map(t => t.itinerary).join(',')
    let isAssociated = str.indexOf(item.label) > -1
    if (isAssociated) {
      alert("The Waypoint is associated within a tour");
    } else {
      let idx = this.markers.findIndex(x => x.label==item.label)
      this.markers.splice(idx, 1)
    }
  }

  tourId: null
  tour: Marker[] = []
  exists = false

  remove_tour_marker(event, item) {
    let arr = this.tour;
    let idx = arr.findIndex(x => x.label==item.label)
    this.tour.splice(idx, 1)
    event.target.parentElement.remove()
    console.log(this.tour)
  }

  clone1Options: SortablejsOptions = {
    group: {
      name: 'clone-group',
      pull: 'clone',
      put: false,
    },

    onChoose: (event) => {
      let idx = event.oldIndex
      console.log(idx)
      this.exists = this.tour.findIndex(x => x.label==this.markers[idx].label) > -1
    },

    onRemove: (event) => {
      if (this.exists) {
        this.exists = false
      }
    }
  };

  clone2Options: SortablejsOptions = {
    group: 'clone-group',

    onAdd: (event) => {
      if (this.exists) {
        this.exists = false
      }
    }
  };

  tourListView = true
  tours = []
  tourIterator = 1

  create_tour() {
    this.tourListView = false;
  }

  edit_tour(item) {
    this.tourId = item.id
    this.tour = item.locations
    this.tourListView = false;
  }

  remove_tour(idx) {
    this.tours.splice(idx, 1)
  }

  save_tour() {
    let tour = this.tour
    let itinerary
    if (tour.length) {
      itinerary = tour.map(x => x.label).join('-->')
      if (this.tourId) {
        let idx = this.tours.findIndex(x => x.id=this.tourId)
        this.tours[idx] = {id: this.tourId, itinerary: itinerary, locations: tour}
      } else {
        this.tours.push({id: this.tourIterator, itinerary: itinerary, locations: tour});
        this.tourIterator += 1
      }
    } else {
      if (this.tourId) {
        let idx = this.tours.findIndex(x => x.id=this.tourId)
        this.remove_tour(idx);
      }
    }
    this.tourListView = true;
    this.tour = [];
    this.tourId = null;
  }
}
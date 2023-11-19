import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, fromEvent } from 'rxjs';
import { every, map, mergeMap } from 'rxjs/operators';

let search = {
  display_name: '',
  lat: '',
  lon: '',
  time_from: '',
  time_to: '',
};

const printData = (data) => {
  console.log(data)

}




const data = JSON.parse(localStorage.getItem('DATA'))
printData(data.data[0].coordinates[0].dates)

const TOKEN =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoxLCJ1c2VyIjoiMV95dXJpaV9kbXl0cnVrIiwiaXNzIjoibG9naW4ubWV0ZW9tYXRpY3MuY29tIiwiZXhwIjoxNzAwMzkxMzk2LCJzdWIiOiJhY2Nlc3MifQ.A9RmPfepokJ-PT95l19e1hgHWT_J0n8fx2cL59Bncg2hyGZ03kCsczXvEQar1qTEHWBz5NkGnC8Q5l6pFOVOCg';
const QUERY = 'Lviv';

fromEvent(document.getElementById('searchInput'), 'input').subscribe(
  (event) => {
    fromFetch(`https://geocode.maps.co/search?q=${event.target.value}`)
      .pipe(
        switchMap((response) => {
          if (response.ok) {
            const result = response
              .json()
              .then((result) =>
                result
                  .map(
                    (city) =>
                      `<a class="dropdown-item" href="#" id="searchOption" lat="${city.lat}" lon="${city.lon}">${city.display_name}</a>`
                  )
                  .join('')
              );
            return result;
          } else {
            return of({ error: true, message: `Error ${response.status}` });
          }
        }),
        catchError((err) => {
          console.error(err);
          return of({ error: true, message: err.message });
        })
      )
      .subscribe({
        next: (result) =>
          (document.getElementById('dropDownSearch').innerHTML = result),
      });
  }
);

fromEvent(document.getElementById('dropDownSearch'), 'click').subscribe(
  (event) => {
    const clickedElement = event.target;
    if (clickedElement.matches('.dropdown-item')) {
      search = {
        ...search,
        display_name: clickedElement.textContent,
        lat: clickedElement.getAttribute('lat'),
        lon: clickedElement.getAttribute('lon'),
      };
      getTimeRange();
      document.getElementById('searchInput').value = clickedElement.textContent;
    }
  }
);

fromEvent(document.getElementById('submitButton'), 'click').subscribe(() => {
  /*if (search.lat !== '') {
    fromFetch(
      `https://api.meteomatics.com/${search.time_from}--${search.time_to}:PT1H/t_2m:C/${search.lat},${search.lon}/json?access_token=${TOKEN}`
    )
      .pipe(
        switchMap((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return of({ error: true, message: `Error ${response.status}` });
          }
        }),
        catchError((err) => {
          console.error(err);
          return of({ error: true, message: err.message });
        })
      )
      .subscribe({
        next: (result) => console.log(result),
        complete: () => console.log('done'),
      });
  }*/
});

const getTimeRange = () => {
  const now = new Date();

  // Calculate the day before now
  const timeFrom = new Date(now);
  timeFrom.setDate(now.getDate());
  timeFrom.setHours(0, 0, 0, 0);

  // Calculate 10 days after the current day
  const timeTo = new Date(now);
  timeTo.setDate(now.getDate() + 10);
  timeTo.setHours(0, 0, 0, 0);

  const timeFromStr = timeFrom.toISOString().slice(0, 19);
  const timeToStr = timeTo.toISOString().slice(0, 19);

  search = {
    ...search,
    time_from: timeFromStr + 'Z',
    time_to: timeToStr + 'Z',
  };
};

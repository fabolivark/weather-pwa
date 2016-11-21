(function() {
  'use strict';

  var app = {
    cards: {},
    cardTemplate: document.querySelector('.js-card-template'),
    container: document.querySelector('.js-weather-container'),
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    var card = app.cards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('js-card-template');
      card.classList.remove('card-template');
      card.querySelector('.js-card-label').textContent = data.label;
      app.container.appendChild(card);
      app.cards[data.key] = card;
    }

    var nextDays = card.querySelectorAll('.js-forecast-day');
    var today = new Date();
    today = today.getDay();

    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.js-forecast-date').textContent =
          app.daysOfWeek[(i + today) % 7];
        nextDay.classList.add(app.daysOfWeek[(i + today) % 7].toLowerCase());
        nextDay.querySelector('.js-forecast-icon').classList.add(app.getIconClass(daily.code));
        nextDay.querySelector('.js-forecast-temp-high').textContent =
          Math.round(app.FtoC(daily.high)) + '°';
        nextDay.querySelector('.js-forecast-temp-low').textContent =
          Math.round(app.FtoC(daily.low)) + '°';
      }
    }
  };

  app.FtoC = function(temp) {
    return Math.round((temp - 32) / (9 / 5));
  }

  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
     app._request = function(){
      fetch(url)  
      .then(
        function(response) {  
          if (response.status !== 200) {  
            console.log(  
            response.status);  
            return;  
          }
          response.json().then(function(data) {
           var results = data.query.results;
           results.key = key;
           results.label = results.channel.location.city;
           results.created = data.query.created;
           app.updateForecastCard(results);
         });  
        }  
      )  
      .catch(function(err) {  
        console.log('Fetch Error :-S', err);  
      });
    }
    app._request();
  };

  app.getForecast('368151');

  app.getIconClass = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'icon--clear-day';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'icon--rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'icon--thunderstorms';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'icon--snow';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'icon--fog';
      case 24: // windy
      case 23: // blustery
        return 'icon--windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'icon--cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'icon--partly-cloudy-day';
    }
  };

  var elems = document.querySelectorAll('input[type="checkbox"]');
  for (var i=elems.length; i--;) {
    if (elems[i].addEventListener) {
      elems[i].addEventListener ('change',fn,false);
    }else if (elems[i].attachEvent) {
      elems[i].attachEvent ('onchange',fn); 
    }
  }

  function fn() {
    var rel   = this.value;
    if(this.checked){
      document.querySelector('.js-forecast-day.' + rel).style.display = 'initial';
    }else{
      document.querySelector('.js-forecast-day.' + rel).style.display = 'none';
    }
  }

})();
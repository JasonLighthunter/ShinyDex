angular.module('starter.services', [])

.factory('Pokemon', function($http, $q, $window) {
  // Might use a resource here that returns a JSON array

  $window.localStorage;

  var baseUrl = 'http://pokeapi.co/api/v2/pokemon';
  var pokemonList = [];
  var pokemon = {};


  function getPokemonListFromLocalStorage(currentNr){
    var idList = JSON.parse(window.localStorage.getItem('pokemonList/metadata')).idList;
    var pokemonCount = idList.length;
    var current = idList.indexOf(currentNr)+1;

    if(current < pokemonCount){
      var returnList = [];
      if(current+20 < pokemonCount){
        var listEnd = current+20;
      }
      else{
        var listEnd = pokemonCount;
      }
      for(var i = current; i<listEnd; i++){
        returnList = returnList.concat(JSON.parse(window.localStorage.getItem('pokemonList/'+idList[i])));
      }
      return returnList;
    }
    return false;
  }

  function getPokemonList(lastPokemonId) {
    if (canGetPokemonList()){
      console.log("no promise");
      return getPokemonListFromLocalStorage(lastPokemonId);
    }
    else{
      console.log("promise");
      return getPokemonListFeed().then(function(res){
        return getPokemonListFromLocalStorage(lastPokemonId);
      })
    }
  }

  function canGetPokemonList(){
    if(JSON.parse(window.localStorage.getItem('pokemonList/metadata'))) {
      if (!JSON.parse(window.localStorage.getItem('pokemonList/metadata')).filled) {
        console.log("false: bool empty");
        return false;
      }
      else {
        if ((Date.now() - JSON.parse(window.localStorage.getItem('pokemonList/metadata')).lastAcces) / 86400000 >= 7) {
          console.log("false: date passed");
          return false;
        } else {
          console.log("true: succes");
          return true;
        }
      }
    }
    console.log("false: undefined");
    return false;
  }

  /*
  pokemonList.push() wordt gebruikt om de data aan de lijst toe te voegen

  angular.copy(foo) wordt gebruikt om een deep copy te maken van de resultaten van de http.get

  als er geen deep copy wordt gemaakt van de resultaten zullen de resultaten binnen de PokemonList na elke request
  worden aangepast, waardoor er een lijst ontstaat van gelijke objecten.

  verder werkt deze query recursief waardoor in een keer de gehele lijst wordt ingeladen.
   */
  function getPokemonListFeed(){
        return getPokemonListFeedRecursive(baseUrl + '?offset=760').then(function () {
          var idList = [];

          for (var i = 0; i < pokemonList.length; i++) {
            pokemonList[i].nr = getPokemonNumber(pokemonList[i].url);
            $window.localStorage.setItem('pokemonList/'+pokemonList[i].nr, JSON.stringify({
              name: pokemonList[i].name,
              url: pokemonList[i].url,
              nr: pokemonList[i].nr
            }));
            idList = idList.concat(angular.copy(pokemonList[i].nr));
          }

          $window.localStorage.setItem('pokemonList/metadata', JSON.stringify(
            {
            lastAcces: Date.now(),
            filled: true,
            idList: idList,
          }));

          return pokemonList;
        });
  }

  function getPokemonListFeedRecursive (apiURL){
    return $http.get(apiURL)
      .then(function(response){
        if(response.data) {
          pokemonList = pokemonList.concat(angular.copy(response.data.results));
          if (response.data.next !== null) {
            console.log(response.data.next);
            return getPokemonListFeedRecursive(response.data.next);
          }
        }
      });
  }

  function getPokemon(pokemonId) {
    return $http.get(baseUrl + '/' + pokemonId)
      .then(function(response){
        if(response.data) {
          pokemon = response.data;
        }
        return pokemon;
      });
  }

  function getPokemonNumber(pokemonUrl){
    var urlString = angular.copy(pokemonUrl);
    if(urlString.lastIndexOf("/") == urlString.length-1) {
      urlString = urlString.substr(0, urlString.lastIndexOf("/"));
    }
    urlString = urlString.substr(urlString.lastIndexOf("/") + 1);
    return(urlString);
  }

  return {
    getPokemonList: function(lastPokemonId){
      if(!lastPokemonId || lastPokemonId<1) lastPokemonId = 1;
      var myPromise = getPokemonList(lastPokemonId);
      return $q.when(
        myPromise).then(function(res) {
          return res;
        });
    },
    get: function(pokemonId) {
      return getPokemon(pokemonId);
   }
  };
});

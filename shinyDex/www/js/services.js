angular.module('starter.services', [])

.factory('Pokemon', function($http, $cacheFactory, $q) {
  // Might use a resource here that returns a JSON array

  var pokemonCache = $cacheFactory('pokemonCache');
  var baseUrl = 'http://pokeapi.co/api/v2/pokemon';
  var pokemonList = [];
  var pokemon = {};

  //expect($cacheFactory.get('cacheId')).toBe(pokemonCache);
  //expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();

  function getPokemonListFromCache(currentNr){
    var idList = pokemonCache.get('/pokemonList/metadata').idList;
    var pokemonCount = pokemonCache.get('/pokemonList/metadata').pokemonCount;
    var current = idList.indexOf(currentNr)+1;

    if(current < pokemonCount){
      var returnList = [];
      if(current+20 < pokemonCount){
        var listEnd = current+20;
      }
      else{
        var listEnd = pokemonCount;
      }
      for(var i = current; i<current+20; i++){
        returnList = returnList.concat(pokemonCache.get('/pokemonList/'+idList[i]));
      }
      return returnList;
    }
    return false;
  }

  function getPokemonList(lastPokemonId) {
    if (canGetPokemonList()){
      console.log("no promise");
      return getPokemonListFromCache(lastPokemonId);
    }
    else{
      return getPokemonListFeed().then(function(res){
        return getPokemonListFromCache(lastPokemonId);
      })
    }
  }

  function canGetPokemonList(){
    if(pokemonCache.get('pokemonList/DoA')) {
      if (!pokemonCache.get('/pokemonList/DoA').filled) {
        return false;
      }
      else {
        if ((Date.now() - pokemonCache.get('/pokemonlist/DoA').lastAcces) / 86400000 >= 7) {
          return false;
        } else {
          return true;
        }
      }
    }
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
          var count = 0;

          for (var i = 0; i < pokemonList.length; i++) {
            pokemonList[i].nr = getPokemonNumber(pokemonList[i].url);
            pokemonCache.put('/pokemonList/' + pokemonList[i].nr, {
              name: pokemonList[i].name,
              url: pokemonList[i].url,
              nr: pokemonList[i].nr
            });
            idList = idList.concat(angular.copy(pokemonList[i].nr));
            count = i;
          }

          pokemonCache.put('/pokemonList/metadata', {
            lastAcces: Date.now(),
            filled: true,
            idList: idList,
            pokemonCount: count
          });

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

  function getPokemonNumber(pokemonUrl){
    var urlString = angular.copy(pokemonUrl);
    if(urlString.lastIndexOf("/") == urlString.length-1) {
      urlString = urlString.substr(0, urlString.lastIndexOf("/"));
    }
    urlString = urlString.substr(urlString.lastIndexOf("/") + 1);
    return(urlString);
  }

  return {
    getFeed: function() {
      return getPokemonListFeed();
    },
    getPokemonList: function(lastPokemonId){
      if(!lastPokemonId) lastPokemonId = 10040;
      var myPromise = getPokemonList(lastPokemonId);
      console.log(myPromise);
      return $q.when(
        myPromise.then(function(res) {
          return res;
        }));
    },
    get: function(pokemonId) {
     for (var i = 0; i < pokemonList.length; i++) {
       if (pokemonList[i].id === parseInt(pokemonId)) {
         return pokemonList[i];
       }
     }
     return null;
   }
  };
});

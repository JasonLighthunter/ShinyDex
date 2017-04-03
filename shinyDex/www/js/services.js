angular.module('starter.services', [])

.factory('Pokemon', function($http, $cacheFactory) {
  // Might use a resource here that returns a JSON array

  var pokemonCache = $cacheFactory('pokemonCache');
  var baseUrl = 'http://pokeapi.co/api/v2/pokemon';
  var pokemonList = [];
  var pokemon = {};

  //expect($cacheFactory.get('cacheId')).toBe(pokemonCache);
  //expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();

  /*
  pokemonList.push() wordt gebruikt om de data aan de lijst toe te voegen

  angular.copy(foo) wordt gebruikt om een deep copy te maken van de resultaten van de http.get

  als er geen deep copy wordt gemaakt van de resultaten zullen de resultaten binnen de PokemonList na elke request
  worden aangepast, waardoor er een lijst ontstaat van gelijke objecten.

  verder werkt deze query recursief waardoor in een keer de gehele lijst wordt ingeladen.
   */
  function getPokemonList(){
    return getPokemonLists(baseUrl+'?offset=760').then(function(){
      console.log(pokemonCache.get('/pokemonList/10040'));
      for(var i = 0; i<pokemonList.length; i++){
        pokemonList[i].nr = getPokemonNumber(pokemonList[i].url);
        pokemonCache.put('/pokemonList/'+pokemonList[i].nr, {
          name: pokemonList[i].name,
          url: pokemonList[i].url,
          nr: pokemonList[i].nr
        });
      }
      console.log(pokemonCache.get('/pokemonList/10040'));
      return pokemonList;
    });
  }

  function getPokemonLists (apiURL){
    return $http.get(apiURL)
      .then(function(response){
        if(response.data) {
          pokemonList = pokemonList.concat(angular.copy(response.data.results));
          if (response.data.next !== null) {
            console.log(response.data.next);
            return getPokemonLists(response.data.next);
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
    getFeed: function() {
      return getPokemonList();
    },
    get: function(pokemonId) {
      return getPokemon(pokemonId);
   }
  };
});

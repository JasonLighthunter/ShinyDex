angular.module('starter.services', [])

.factory('Pokemon', function($http, $cacheFactory) {
  // Might use a resource here that returns a JSON array

  var pokemonCache = $cacheFactory('pokemonCache');
  var baseUrl = 'http://pokeapi.co/api/v2/pokemon?limit=5&offset=257';
  var pokemonList = [];
  var pokemon = {};

  expect($cacheFactory.get('cacheId')).toBe(pokemonCache);
  expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();

  // Some fake testing data
  // var pokemonList = [{
  //   Nr: 1,
  //   name: 'Bulbasaur',
  //   typeOne: { name: "grass"},
  //   typeTwo: { name: "poison"},
  //   caughtImage: 'img/gsball.png',
  //   pictogram: 'img/ben.png'
  // }, {
  //   Nr: 2,
  //   name: 'Ivysaur',
  //   typeOne: { name: "grass"},
  //   typeTwo: { name: "poison"},
  //   caughtImage: 'img/pokeball.png',
  //   pictogram: 'img/max.png'
  // }, {
  //   Nr: 3,
  //   name: 'Venosaur',
  //   typeOne: { name: "grass"},
  //   typeTwo: { name: "poison"},
  //   caughtImage: 'img/pokeball.png',
  //   pictogram: 'img/adam.jpg'
  // }, {
  //   Nr: 4,
  //   name: 'Charmander',
  //   typeOne: { name: "fire"},
  //   caughtImage: 'img/pokeball.png',
  //   pictogram: 'img/perry.png'
  // }, {
  //   Nr: 5,
  //   name: 'Charmeleon',
  //   typeOne: { name: "fire"},
  //   caughtImage: 'img/gsball.png',
  //   pictogram: 'img/mike.png'
  // }];

  function updatePokemonList() {
    var newBase = baseUrl;

    //newBase = newBase.replace('<<search>>', query);

    pokemonList.$promise = $http.get(newBase).then(function (res) {
      angular.copy(res.data, pokemonList);
      pokemonList.forEach(function(listPokemon){
        pokemonCache.put('pokemonList/'+listPokemon.name, listPokemon)
      });
      return pokemonList;
    });
    return pokemonList.$promise;
  };

  function getPokemon(url) {

      pokemon.promise = $http.get(url).then(function (res) {
        pokemon = res.data;
        pokemon.loaded = true;
        return pokemon;
      })
      return pokemon.promise;
  }

  return {
    all: function() {
      if(pokemonList.length < 1) {
        return updatePokemonList();
      }
    },
    remove: function(pokemon) {
      pokemonList.splice(pokemonList.indexOf(pokemon), 1);
    },
    get: function(url) {
      //console.log(pokemonList);

      // for (var i = 0; i < pokemonList.length; i++) {
      //   if (pokemonList[i].url === url) {
          //if(pokemonList[i].loaded == true){
            //return pokemonList[i]
          //} else {
            return getPokemon(url)
          //}
        //}
      //}
       //return null;
    }
  };
});

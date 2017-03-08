angular.module('starter.services', [])

.factory('Pokemon', function($http, $cacheFactory) {
  // Might use a resource here that returns a JSON array

  var pokemonCache = $cacheFactory('pokemonCache');
  var baseUrl = 'http://pokeapi.co/api/v2/pokemon?offset=760';
  var pokemonList = [];
  var newResults = [];
  var testList = [];
  var pokemon = {};

  //expect($cacheFactory.get('cacheId')).toBe(pokemonCache);
  //expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();

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

  // function getPokemonList(pageUrl){
  //
  //   console.log('pageUrl');
  //   if(pageUrl != null && pageUrl != undefined){
  //
  //     return $http.get(pageUrl).then(function(res){
  //       angular.copy(res.data.results, newResults);
  //       if(res.data.next != null){
  //         pokemonList.concat(getPokemonList(res.data.next));
  //       }
  //       console.log(pokemonList);
  //       console.log(pokemonList);
  //       return newResults;
  //     });
  //
  //   }
  //   return null;
  // }

  function getPokemonListFeed(pageUrl){

    if(pageUrl != null && pageUrl != undefined) {
      return getPokemonList(pageUrl).then(function(res){
        // testList[pageUrl] = res.results;
        pageUrl = res.next;
        pokemonList.push(res.results);
        // console.log(testList)
        getPokemonListFeed(pageUrl);
          return pokemonList;
      });
    }
  }

  function getPokemonList(pageUrl){
    if(pageUrl != null && pageUrl != undefined) {
      return $http.get(pageUrl).then(function (res) {
        angular.copy(res.data, newResults);
        return newResults;
      });
    }
    return null;
  }

  // function updatePokemonList(nextUrl) {
  //   console.log('more succes, sort of');
  //   if(nextUrl != undefined) {
  //     var newBase = nextUrl;
  //
  //     pokemonList.$promise = $http.get(newBase).then(function (res) {
  //       //console.log(res);
  //       this.pokemonList = res.data.results
  //       if(res.data.next != null){
  //         this.pokemonList.concat(updatePokemonList(res.data.next));
  //       }
  //       return this.pokemonList;
  //     });
  //     return pokemonList.$promise;
  //   }
  //   return null;
  // };
  //
  // function getPokemonListFeed() {
  //   console.log('loading more pokémon');
  //   var newBase = baseUrl;
  //
  //   pokemonList.$promise = $http.get(newBase).then(function (res) {
  //     console.log('actual succes, sort of');
  //     angular.copy(res.data.results, pokemonList);
  //     if(res.data.next != null){
  //       pokemonList.concat(updatePokemonList(res.data.next).results);
  //     }
  //     console.log(pokemonList);
  //     return pokemonList;
  //   });
  //   return pokemonList.$promise;
  // };

  // function getPokemon(url) {
  //
  //     pokemon.promise = $http.get(url).then(function (res) {
  //       pokemon = res.data;
  //       return pokemon;
  //     })
  //     return pokemon.promise;
  // }

  return {
    getFeed: function(pageUrl) {
      return getPokemonListFeed(pageUrl);
    },
    getNext: function(nextUrl) {
      return updatePokemonList(nextUrl);
    }
    // get: function(url) {
    //   //console.log(pokemonList);
    //
    //   // for (var i = 0; i < pokemonList.length; i++) {
    //   //   if (pokemonList[i].url === url) {
    //       //if(pokemonList[i].loaded == true){
    //         //return pokemonList[i]
    //       //} else {
    //         return getPokemon(url)
    //       //}
    //     //}
    //   //}
    //    //return null;
    // }
  };
});

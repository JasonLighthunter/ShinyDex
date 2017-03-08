angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {

  $scope.pokemonList = [];


  //$scope.pokemonList = Pokemon.getFeed('http://pokeapi.co/api/v2/pokemon?offset=760');
  Pokemon.getFeed('http://pokeapi.co/api/v2/pokemon?offset=760').then(
    function(res) {
      console.log(res);
      // res.forEach(function(resultList){
      //   $scope.pokemon.concat(resultList);
      // });
      //
//$scope.pokemonList = res.results;
    }
  );
      // res.results.forEach(function (resultPokemon) {
      //   console.log(resultPokemon);
      //   Pokemon.get(resultPokemon.url).then(function(result) {
      //     result.types.sort(function(a, b){return (a.slot - b.slot);});
      //     $scope.pokemonList.push(result);
      //     $scope.pokemonList.sort(function(a, b){ return (a.id - b.id);});
      //   });
      // });
      // console.log($scope.pokemonList);
  //   }
  // );

  // $scope.loadMore = function() {
  //   Pokemon.getNext($scope.next).then(function(items){
  //     console.log(items);
  //     $scope.pokemonList = $scope.pokemonList.concat(items.results);
  //
  //     $scope.$broadcast('scroll.infiniteScrollComplete');
  //     $scope.next = items.next;
  //    });
  // };
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  $scope.pokemon = Pokemon.get($stateParams.pokemonId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

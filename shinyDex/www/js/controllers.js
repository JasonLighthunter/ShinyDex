angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {

  $scope.pokemonList = [];

  Pokemon.all().then(
    function(res){
      $scope.pokemonList = res;
      // res.results.forEach(function (resultPokemon) {
      //   console.log(resultPokemon);
      //   Pokemon.get(resultPokemon.url).then(function(result) {
      //     result.types.sort(function(a, b){return (a.slot - b.slot);});
      //     $scope.pokemonList.push(result);
      //     $scope.pokemonList.sort(function(a, b){ return (a.id - b.id);});
      //   });
      // });
      // console.log($scope.pokemonList);
    }
  );

  $scope.remove = function(pokemon) {
    Pokemon.remove(pokemon);
  };
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  $scope.pokemon = Pokemon.get($stateParams.pokemonId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

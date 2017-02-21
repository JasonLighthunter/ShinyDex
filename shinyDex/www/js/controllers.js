angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {
  $scope.pokemonList = Pokemon.all();

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

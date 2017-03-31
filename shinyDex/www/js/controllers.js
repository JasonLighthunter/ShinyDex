angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {

  $scope.pokemonList = [];


  //$scope.pokemonList = Pokemon.getFeed('http://pokeapi.co/api/v2/pokemon?offset=760');
  Pokemon.getFeed().then(
    function(res) {
      console.log(res);
      $scope.pokemonList = res;
    }
  );
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  $scope.pokemon = Pokemon.get($stateParams.pokemonId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

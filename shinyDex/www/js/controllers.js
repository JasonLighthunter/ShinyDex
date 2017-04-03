angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon, $q, $location) {

  $scope.pokemonList = [];
  $scope.canLoadMore = true;


  $scope.loadMore = function() {
    if($scope.pokemonList.length > 0){
      var number = $scope.pokemonList[$scope.pokemonList.length-1].nr;
    }
    $q.when(Pokemon.getPokemonList(number)).then(function(res) {
      if (res) {
        $scope.pokemonList = $scope.pokemonList.concat(res);
        $scope.canLoadMore = true;
      }
      else{
        console.log("can't load any more data.");
        $scope.canLoadMore = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });

  $scope.goto = function(path) {
    $location.url('/tab'+path);
  };
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  console.log($stateParams.pokemonId);
  Pokemon.get($stateParams.pokemonId)
    .then(function(res) {
      $scope.pokemon = res;
    });

  $scope.doBrag = function() {
    window.open('http://www.reddit.com/r/shinypokemon', '_system', 'location=yes');
  };
})

.controller('SettingsCtrl', function($scope, CameraFactory, $cordovaCamera) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.cameraButtonLabel = 'take picture';
  $scope.imageSrc = undefined;

  $scope.takePicture = function() {
    var options = CameraFactory.options;

    $cordovaCamera.getPicture(options).then(
      function(imageData) {
        $scope.imageSrc = 'data:image/jpeg;base64,' + imageData;
      },
      function(err) {
        console.log('Error Encountered');
      }
    );
  };
});


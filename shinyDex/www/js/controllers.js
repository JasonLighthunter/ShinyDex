angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon, $q) {

  $scope.pokemonList = [];
  $scope.canLoadMore = true;


  $scope.loadMore = function() {
    if($scope.pokemonList.length > 0){
      var number = $scope.pokemonList[$scope.pokemonList.length-1].nr;
    }
    $q.when(Pokemon.getPokemonList(number)).then(function(res) {
      if (res) {
        console.log("")
        console.log(res);
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

  // $q.when(Pokemon.getPokemonList().then(function(res) {
  //   if (res) {
  //     console.log(res);
  //     $scope.pokemonList = $scope.pokemonList.concat(res);
  //   }
  // }));
  //$scope.pokemonList = Pokemon.getFeed('http://pokeapi.co/api/v2/pokemon?offset=760');



  // Pokemon.getFeed().then(
  //   function(res) {
  //     console.log(res);
  //     $scope.pokemonList = res;
  //   }
  // );
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  $scope.pokemon = Pokemon.get($stateParams.pokemonId);
  $scope.test    = 'test';
})

.controller('SettingsCtrl', function($scope, $ionicPlatform, $cordovaCamera) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.cameraButtonLabel = 'take picture';
  $scope.imageSrc          = undefined;

  $scope.takePicture = function() {
    var options = {
      quality            : 50,
      destinationType    : Camera.DestinationType.DATA_URL,
      sourceType         : Camera.PictureSourceType.CAMERA,
      allowEdit          : false,
      encodingType       : Camera.EncodingType.JPEG,
      targetWidth        : 300,
      targetHeight       : 300,
      popoverOptions     : CameraPopoverOptions,
      saveToPhotoAlbum   : false,
      correctOrientation : true
    };

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

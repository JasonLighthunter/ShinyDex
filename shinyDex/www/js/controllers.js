angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {
  $scope.pokemonList = Pokemon.all();

  $scope.remove = function(pokemon) {
    Pokemon.remove(pokemon);
  };
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

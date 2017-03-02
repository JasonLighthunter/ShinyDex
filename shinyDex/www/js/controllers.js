angular.module('starter.controllers', [])

.controller('PokemonCtrl', function($scope, Pokemon) {
  $scope.pokemonList = Pokemon.all();

  $scope.remove = function(pokemon) {
    Pokemon.remove(pokemon);
  };
})

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon) {
  $scope.pokemon = Pokemon.get($stateParams.pokemonId);
  $scope.test  = 'test';
})

.controller('SettingsCtrl', function($scope, $ionicPlatform, $cordovaCamera) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.label = "Hello World!";
  $scope.changeButtonLabel = "Change Label";
  $scope.cameraButtonLabel = 'take picture';

  $scope.changeLabel = function() {
    $scope.label = "Bye World";
  };

  $scope.takePicture = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(
      function(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
      }, 
      function(err) {
        console.log('Error Encountered');
      }
    );
  };
});

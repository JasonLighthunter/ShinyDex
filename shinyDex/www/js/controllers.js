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

.controller('PokemonDetailCtrl', function($scope, $stateParams, Pokemon, ShareFactory, CameraFactory, $cordovaCamera) {
  Pokemon.get($stateParams.pokemonId)
    .then(function(res) {
      $scope.pokemon = res;
      $scope.proofImageSrc = Pokemon.getProof($scope.pokemon.name);
      
      $scope.doBrag = function() {
        $scope.testLabel = $scope.proofImageSrc.toString();
        if($scope.proofImageSrc !== undefined) {
          ShareFactory.shareViaWhatsApp(res.name);
        }
      };
      
      $scope.doRegister = function() {
        var options = CameraFactory.options;

        $cordovaCamera.getPicture(options).then(
          function(imageData) {
            $scope.proofImageSrc = 'data:image/jpeg;base64,' + imageData;
            Pokemon.register($scope.pokemon.name, $scope.proofImageSrc);
          },
          function(err) {
            console.log('Error Encountered');
          }
        );
      };
    });
})

.controller('testCtrl', function($scope, $ionicPlatform, $cordovaDeviceMotion){
  $scope.testLabel = 0;

  // watch Acceleration options
  $scope.options = {
    frequency: 100, // Measure every 100ms
    deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
  };

  // Current measurements
  $scope.measurements = {
    x : null,
    y : null,
    z : null,
    timestamp : null
  };

  // Previous measurements
  $scope.previousMeasurements = {
    x : null,
    y : null,
    z : null,
    timestamp : null
  };

  // Watcher object
  $scope.watch = null;

  // Start measurements when Cordova device is ready
  $ionicPlatform.ready(function() {

    //Start Watching method
    $scope.startWatching = function() {

        // Device motion configuration
        $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);

        // Device motion initilaization
        $scope.watch.then(null, function(error) {
          console.log('Error');
        console.log(error);
      },function(result) {

        // Set current data
        $scope.measurements.x = result.x;
        $scope.measurements.y = result.y;
        $scope.measurements.z = result.z;
        $scope.measurements.timestamp = result.timestamp;

        // Detecta shake
        $scope.detectShake(result);

      });
    };

    // Stop watching method
    $scope.stopWatching = function() {
      $scope.watch.clearWatch();
    };

    // Detect shake method
    $scope.detectShake = function(result) {

      //Object to hold measurement difference between current and old data
      var measurementsChange = {};

      // Calculate measurement change only if we have two sets of data, current and old
      if ($scope.previousMeasurements.x !== null) {
        measurementsChange.x = Math.abs($scope.previousMeasurements.x, result.x);
        measurementsChange.y = Math.abs($scope.previousMeasurements.y, result.y);
        measurementsChange.z = Math.abs($scope.previousMeasurements.z, result.z);
      }

      // If measurement change is bigger then predefined deviation
      if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation) {
        $scope.stopWatching();  // Stop watching because it will start triggering like hell

        $scope.testLabel += 1;

        console.log('Shake detected'); // shake detected
        setTimeout($scope.startWatching(), 1000);  // Again start watching after 1 sec

        // Clean previous measurements after succesfull shake detection, so we can do it next time
        $scope.previousMeasurements = {
          x: null,
          y: null,
          z: null
        };

      } else {
        // On first measurements set it as the previous one
        $scope.previousMeasurements = {
          x: result.x,
          y: result.y,
          z: result.z
        };
      }

    };

  });

  $scope.$on('$ionicView.afterEnter', function(){
    $scope.testLabel = 0;
    $scope.startWatching();
  });

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.watch.clearWatch(); // Turn off motion detection watcher
  });
})

.controller('SettingsCtrl', function($scope, CameraFactory, $cordovaCamera) {
});


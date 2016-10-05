(function () {
  'use strict';

  angular.module('HyperPerform.pages.dashboard').config(chartJsConfig)
      .controller('chartJs1DCtrl', chartJs1DCtrl);

  function chartJsConfig(ChartJsProvider, baConfigProvider) {
    var layoutColors = baConfigProvider.colors;
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: [ layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default, layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight],
      responsive: true,
      scaleFontColor: layoutColors.defaultText,
      scaleLineColor: layoutColors.border,
      pointLabelFontColor: layoutColors.defaultText
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });
  }
  // @ngInject
  // function chartJs1DCtrl($scope) {
  //
  //   $scope.labels =["PA Score"];
  //   $scope.data = [4.23];
  //   $scope.options = {
  //     segmentShowStroke : false
  //   };
  //
  //   $scope.polarOptions = {
  //     scaleShowLabelBackdrop : false,
  //     segmentShowStroke : false
  //   };
  //
  // }
  angular.module('demo', ['angular-svg-round-progressbar']).controller('chartJs1DCtrl', chartJs1DCtrl);

  function chartJs1DCtrl($scope, $interval, $timeout, $window, roundProgressService, $http, $rootScope){
    $rootScope.$on("pa", function(){
      $scope.loadPA();
    });
    $scope.loadPA = function() {
      var n = getCookie('hpkey').split("#")[0];
      var t1 = $('#time1').html();
      var t2 = $('#time2').html();
      var d1 = $('#date1').html().trim();
      var d2 = $('#date2').html().trim();
      $http({
        method: "POST",
        url: "https://hyperperform.me:8443/hyperperform-system-1.0-SNAPSHOT/rs/report/getScore",
        data: JSON.stringify({name: n, startDate: d1 + t1, endDate: d2 + t2}),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }).then(function (response) {

        // $scope.current = 4.0325698;
        $scope.current = response.data.score;
        // alert($scope.current);

        // $scope.current = 3;
        if ($scope.current < 2.0) {
          $scope.gradient = false;
          $scope.currentColor = 'red';
          $scope.performance = "<h4 align='center' style='color: red;'>Non Performer</h4>";
        }
        if ($scope.current >= 2.0 && $scope.current < 3.0) {
          $scope.gradient = true;
          $scope.stopColor = "<stop offset=\"33%\" stop-color=\"red\"/>" +
              "<stop offset=\"90%\" stop-color=\"#FF7200\"/>";

          $scope.performance = "<h4 align='center' style='color: #FF9200;'>Standard Performer</h4>";
        }
        // if($scope.current >= 3.0 && $scope.current < 4.0) {
        //   $scope.gradient = true;
        //   $scope.stopColor = "<stop offset=\"20%\" stop-color=\"#FF7200\"/>" +
        //       "<stop offset=\"80%\" stop-color=\"#FFAB00\"/>";
        //   $scope.performance = "<h4 align='center' style='color: #0EA5A5;'>Standard Plus Performer</h4>";
        // }
        if ($scope.current >= 3.0 && $scope.current <= 4.0) {
          $scope.gradient = true;
          $scope.stopColor = "<stop offset=\"30%\" stop-color=\"#FF9200\"/>" +
              "<stop offset=\"99%\" stop-color=\"lawngreen\"/>";

          $scope.performance = "<h4 align='center' style='color: #0EA5A5;'>Standard Plus Performer</h4>";
        }
        if ($scope.current > 4.0) {
          $scope.gradient = true;

          $scope.stopColor = "<stop offset=\"20%\" stop-color=\"#00FF44\"/>" +
          "<stop offset=\"80%\" stop-color=\"lawngreen\"/>";

          $scope.performance = "<h4 align='center' style='color: #00FF44;'>High Performer</h4>";
        }
        // alert(response.data.score);
        $("#gradient").html($scope.stopColor);
        $('#pascore').html($scope.performance);

      }, function (response) {

        $scope.openToast('From: Dashboard', 'Failed to load PA Score', 'error');
      });
      $('#myModal').modal('hide');
    };
    setTimeout(
        function()
        {

          $scope.loadPA();
        }, 1000);



    // $scope.current =        1.5;
    $scope.max =            5;
    $scope.offset =         0;
    $scope.timerCurrent =   0;
    $scope.uploadCurrent =  0;
    $scope.stroke =         55;
    $scope.radius =         150;
    $scope.isSemi =         true;
    $scope.rounded =        false;
    $scope.responsive =     false;
    $scope.clockwise =      true;
    $scope.gradient =       true;
    $scope.currentColor =   'blue';
    $scope.bgColor =        '#eaeaea';
    $scope.duration =       800;
    $scope.currentAnimation = 'easeOutCubic';
    $scope.animationDelay = 0;

    $scope.animations = [];

    angular.forEach(roundProgressService.animations, function(value, key){
      $scope.animations.push(key);
    });

    $scope.getStyle = function(){
      var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

      return {
        'top': $scope.isSemi ? 'auto' : '50%',
        'bottom': $scope.isSemi ? '-15%' : 'auto',
        'left': '50%',
        'background-color': 'white',
        'height': '20%',
        'transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform,
        'font-size': '22pt'
      };
    };

    $scope.getColor = function(){
      return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
    };

    $scope.showPreciseCurrent = function(amount){
      $timeout(function(){
        if(amount <= 0){
          $scope.preciseCurrent = $scope.current;
        }else{
          var math = $window.Math;
          $scope.preciseCurrent = math.min(amount, $scope.max).toFixed(2);
        }
      });
    };

    var getPadded = function(val){
      return val < 10 ? ('0' + val) : val;
    };

    $interval(function(){
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();

      $scope.hours = hours;
      $scope.minutes = minutes;
      $scope.seconds = seconds;
      $scope.time = getPadded(hours) + ':' + getPadded(minutes) + ':' + getPadded(seconds);
    }, 1000);
  }

})();
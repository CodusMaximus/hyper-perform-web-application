(function () {
  'use strict';

  angular.module('HyperPerform.pages.detailed.github').controller('githubCtrl', githubCtrl)
      .controller('calendarPicker', calendarPicker);

  function githubCtrl($scope, $http, $window) {
      $scope.gitDataSize = 5;
      $scope.searchCount = 1;
      $scope.changeCount = 1;
      $scope.IconCount = 1;

      $('#after').hide();

      $scope.loadGit = function() {

          var n = document.cookie.split("=")[1].split("#")[0];
          // alert(n);
          $http({
              url: "http://localhost:8080/hyperperform-system-1.0-SNAPSHOT/rs/report/getDetails",
              method: "POST",
              // method: "GET",
              data: JSON.stringify({
                  name: n,
                  startDate: "2016-01-01 00:00:01",
                  endDate: "2016-12-30 23:59:59",
                  type: "git"
              }),
              headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*"
              }
          })
              .then(function (response) {

                  git = response.data.gitDetails.data;
                  $scope.gitDataSize = 3;
                  $scope.repos = git;

                  $scope.gitData = response.data.gitDetails.data[0];
                  $scope.graphs = response.data.gitDetails.graphData;

                  $('#loading').fadeOut(1000, function () {
                      $(this).remove();
                  });
                  $('#after').delay(500).fadeIn(3000, function () {
                  });
                  if ($scope.repos[0] == null)
                  {
                      $('#after').html("<h1>No results found</h1>");
                      $scope.openToast('','No commits found','warning');
                  }

                  for (var i = 0; i < $scope.repos.length; i++)
                  {

                      $scope.tmp =  $scope.repos[i][0].repository;
                      var el = '"' +$scope.repos[i][0].repository + '"';
                      $('#tabs').html($('#tabs').html() + "<a class='btn tabs' onclick='scroll("+el+");' >"+$scope.repos[i][0].repository+"</a> &nbsp;");
                  }

              }, function (response) {
                  $('#loading').fadeOut(1000, function () {
                      $(this).remove();
                  });
                  $('#after').fadeIn(1000, function () {
                      $(this).html("<h1>An error occurred</h1>")
                  });
                  $scope.openToast('From: GitHub','Unable to connect to the server','error');
              });


      };


          $scope.showSearch = function (el)
          {
              $scope.searchCount++;
              // alert(el);
              if ( ($scope.searchCount % 2) == 0)
                  $('#'+el+'Search').show();
              else $('#'+el+'Search').hide();
          };

          $scope.changeIcon = function (el)
          {
              $scope.IconCount++;
              // alert(el);
              if ( ($scope.IconCount % 2) == 0) {
                  $('#' + el + 'icon').html("<i class='fa fa-caret-down'></i>");
                  $('#' + el ).hide();


              }
              else
              {
                  $('#'+el+'icon').html("<i class='fa fa-caret-up'></i>");
                  $('#' + el ).show();

              }
          };

          $scope.changeView = function (el)
          {
              $scope.changeCount++;

              if ( ($scope.changeCount % 2) == 0) {
                  $('#' + el + 'switch').html("<i class='fa fa-table white' aria-hidden='true'></i>");
                  $('#'+el+'table').hide();
                  $('#'+el+'graph').show();
                  // alert("Hide table");
              }
              else
              {
                  $('#'+el+'switch').html("<i class='fa fa-line-chart white' aria-hidden='true'></i>");
                  $('#'+el+'graph').hide();
                  $('#'+el+'table').show();
                  // alert("Hide graph");
              }
          };
  }


    function scroll(el)
    {
        // alert(el);

        $('html, body').animate({scrollTop: $("#"+el).offset().top - 135}, 2000);
    }


    function calendarPicker($scope, $log)
    {
        ////////////////////
        ////////// TIME ////
        ////////////////////
        $scope.mytime1 = new Date();
        $scope.mytime2 = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = false;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime1 = d;
            $scope.mytime2 = d;
        };

        $scope.changed = function () {
            $log.log('Time changed to: ' + $scope.mytime1);
        };

        $scope.getFirst = function() {
          return $scope.mytime1;
        };

        $scope.getSecond = function() {
            return $scope.mytime2;
        };

        $scope.clear = function() {
            $scope.mytime1 = null;
            $scope.mytime2 = null;
        };

        ////////////////////
        /////////// DATE ///
        ////////////////////
        $scope.today = function() {
            $scope.dt1 = new Date(2015, 1, 1);
            $scope.dt2 = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt1 = null;
            $scope.dt2 = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(2016, 8, 1),
            showWeeks: true
        };

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2016, 8, 1),
            startingDay: 1
        };

        // Disable weekend selection
        // function disabled(data) {
        //     var date = data.date,
        //         mode = data.mode;
        //     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        // }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
    }


  })();
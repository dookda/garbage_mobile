angular.module('starter.controllers', ['angular-echarts'])

  .controller('dashCtrl', function ($scope, $state, $window, $timeout, $http, gbService) {

    $scope.getRawChart = function () {
      gbService.getRawChart()
        .then(function (res) {
          //$scope.gbraw = res.data;
          $scope.data = [{
            name: 'ปริมาณขยะ',
            datapoints: res.data
          }];
        });
    };
    $scope.getRawChart();

    $scope.getRaw = function () {
      gbService.getRaw()
        .then(function (res) {
          $scope.allGb = res.data;
          //console.log($scope.allGb.length);
        });
    };
    $scope.getRaw();



    $scope.config = {
      //title: 'ปริมาณขยะที่ผ่านมา',
      subtitle: 'หน่วย: กก.',
      debug: true,
      showXAxis: false,
      showYAxis: true,
      showLegend: false,
      stack: false,
    };

    $scope.reload = function () {
      $window.location.reload();
    };

    $scope.remove = function (gb) {
      var link = 'http://localhost/garbage/gb_raw_remove.php';
      $http.post(link, gb)
        .then(function (res) {
          $scope.response = res;

          $scope.getRawChart();
          $scope.getRaw();
          // console.log($scope.response);
          // $timeout(function () {
          //   $scope.reload();
          // }, 500);
        });
    }

    $scope.gotoInsert = function () {
      $state.go('tab.insert');
    };

    $scope.gotoEdit = function (gb) {
      gbService.getSelected = gb;
      $state.go('tab.detail');
    };
  })

  .controller('insertCtrl', function ($scope, $state, $http, $timeout, $ionicHistory) {
    $scope.gb = {
      optname: 'da',
      food: null,
      paper: null,
      plastic: null,
      leather: null,
      fabric: null,
      wood: null,
      glass: null,
      metal: null,
      rock: null,
      tile: null,
      other: null,
      hazard: null,
      //pop: null
    }

    $scope.init = {
      optname: 'da',
      food: null,
      paper: null,
      plastic: null,
      leather: null,
      fabric: null,
      wood: null,
      glass: null,
      metal: null,
      rock: null,
      tile: null,
      other: null,
      hazard: null,
      //pop: null
    }

    $scope.gbInsert = function () {

      $scope.raw = {
        optname: $scope.gb.optname,
        food: $scope.gb.food,
        paper: $scope.gb.paper,
        plastic: $scope.gb.plastic,
        leather: $scope.gb.leather,
        fabric: $scope.gb.fabric,
        wood: $scope.gb.wood,
        glass: $scope.gb.glass,
        metal: $scope.gb.metal,
        rock: $scope.gb.rock,
        tile: $scope.gb.tile,
        other: $scope.gb.other,
        organic: $scope.gb.food + $scope.gb.wood,
        general: $scope.gb.leather + $scope.gb.fabric + $scope.gb.rock + $scope.gb.tile + $scope.gb.other,
        recycle: $scope.gb.paper + $scope.gb.plastic + $scope.gb.glass + $scope.gb.metal,
        hazard: $scope.gb.hazard,
        total: $scope.gb.food + $scope.gb.wood + $scope.gb.leather + $scope.gb.fabric + $scope.gb.rock + $scope.gb.tile + $scope.gb.other + $scope.gb.paper + $scope.gb.plastic + $scope.gb.glass + $scope.gb.metal + $scope.gb.hazard,
        //pop: $scope.gb.pop,
        gbdate: $scope.gb.date,
        gbdd: $scope.gb.date.getDate(),
        //gbmm: $scope.gb.date.getMonth() + 1,
        gbmmth: $scope.gb.date.toLocaleString("th", {
          month: "short"
        }),
        gbmmen: $scope.gb.date.toLocaleString("en", {
          month: "short"
        }),
        gbyy: $scope.gb.date.getFullYear() + 543
      };

      //console.log($scope.raw);

      var link = 'http://localhost/garbage/gb_raw_insert.php';
      //$http.post(link, {username : $scope.data.farmer_fname})
      $http.post(link, $scope.raw)
        .then(function (res) {
          //console.log(res.data);
          $scope.response = res.data
          $timeout(function () {
            $scope.gb = angular.copy($scope.init);
            $scope.gotoDash();
          }, 200);
        });
    };


    $scope.gotoDash = function () {
      $timeout(function () {
        $state.go('tab.dash', null, {
          reload: true
        });
      }, 450);
    };
  })

  .controller('detailCtrl', function ($scope, gbService) {
    $scope.selGb = gbService.getSelected;
    console.log($scope.selGb);

    var maxXaxis = Math.max.apply(null,[
      Number($scope.selGb.food),
      Number($scope.selGb.paper),
      Number($scope.selGb.plastic),
      Number($scope.selGb.leather),
      Number($scope.selGb.fabric),
      Number($scope.selGb.wood),
      Number($scope.selGb.glass),
      Number($scope.selGb.metal),
      Number($scope.selGb.rock),
      Number($scope.selGb.tile),
      Number($scope.selGb.other),
      Number($scope.selGb.hazard)
    ]) + 1;

    console.log(maxXaxis);

    $scope.dataTotal = [{
      name: 'ประเภทขยะ',
      datapoints: [{
          x: 'ขยะอินทรีย์',
          y: Number($scope.selGb.organic)
        },
        {
          x: 'ขยะทั่วไป',
          y: Number($scope.selGb.general)
        },
        {
          x: 'ขยะรีไซเคิล',
          y: Number($scope.selGb.recycle)
        },
        {
          x: 'ขยะอันตราย',
          y: Number($scope.selGb.hazard)
        },
      ]
    }];

    $scope.dataDetail = [{
      name: 'ประเภทขยะ',
      datapoints: [{
          x: 'เศษอาหาร',
          y: Number($scope.selGb.food)
        },
        {
          x: 'กระดาษ',
          y: Number($scope.selGb.paper)
        },
        {
          x: 'พลาสติก',
          y: Number($scope.selGb.plastic)
        },
        {
          x: 'หนัง',
          y: Number($scope.selGb.leather)
        },
        {
          x: 'ผ้า',
          y: Number($scope.selGb.fabric)
        },
        {
          x: 'ไม้',
          y: Number($scope.selGb.wood)
        },
        {
          x: 'แก้ว',
          y: Number($scope.selGb.glass)
        },
        {
          x: 'โลหะ',
          y: Number($scope.selGb.metal)
        },
        {
          x: 'หิน',
          y: Number($scope.selGb.rock)
        },
        {
          x: 'กระเบื้อง',
          y: Number($scope.selGb.tile)
        },
        {
          x: 'มูลฝอยอื่นๆ',
          y: Number($scope.selGb.other)
        },
        {
          x: 'มูลฝอยอันตราย',
          y: Number($scope.selGb.hazard)
        }
      ]
    }];

   // var maxXaxis = 10;
    $scope.dataRadar = [{
      name: 'Budget vs spending',
      type: 'radar',
      data: [{
        value: [
          Number($scope.selGb.food),
          Number($scope.selGb.paper),
          Number($scope.selGb.plastic),
          Number($scope.selGb.leather),
          Number($scope.selGb.fabric),
          Number($scope.selGb.wood),
          Number($scope.selGb.glass),
          Number($scope.selGb.metal),
          Number($scope.selGb.rock),
          Number($scope.selGb.tile),
          Number($scope.selGb.other),
          Number($scope.selGb.hazard)
        ],
        name: 'ขยะ'
      }]
    }];


    $scope.configRadar = {
      polar: [{
        indicator: [{
            text: 'เศษอาหาร',
            max: maxXaxis
          },
          {
            text: 'กระดาษ',
            max: maxXaxis
          },
          {
            text: 'พลาสติก',
            max: maxXaxis
          },
          {
            text: 'หนัง',
            max: maxXaxis
          },
          {
            text: 'ผ้า',
            max: maxXaxis
          },
          {
            text: 'ไม้',
            max: maxXaxis
          },
          {
            text: 'แก้ว',
            max: maxXaxis
          },
          {
            text: 'โลหะ',
            max: maxXaxis
          },
          {
            text: 'หิน',
            max: maxXaxis
          },
          {
            text: 'กระเบื้อง',
            max: maxXaxis
          },
          {
            text: 'มูลฝอยอื่นๆ',
            max: maxXaxis
          },
          {
            text: 'มูลฝอยอันตราย',
            max: maxXaxis
          }
        ]
      }]
    };

    $scope.config = {
      //title: 'Line Chart',
      //subtitle: 'Line Chart Subtitle',
      debug: true,
      showXAxis: true,
      showYAxis: true,
      showLegend: true,
      stack: false,
    };

  })

  .controller('calCtrl', function ($scope, $http, $timeout, gbService) {

    $scope.getRate = function () {
      gbService.getRate('all')
        .then(function (res) {
          $scope.gbrates = res.data;
        })
    };
    $scope.getRate();


    $scope.gb = {
      total: 0
    };

    $scope.b = {
      ctype: ''
    };

    $scope.reset = function () {
      $scope.exp = {
        organic: 0,
        general: 0,
        recycle: 0,
        hazard: 0
      }

      $scope.b = {
        ctype: ''
      }

    }

    $scope.cal = function (ctype) {
      gbService.getRate(ctype)
        .then(function (res) {
          $scope.gbrate = res.data[0];

          $scope.exp = {
            organic: $scope.gb.total * $scope.gbrate.organic,
            general: $scope.gb.total * $scope.gbrate.general,
            recycle: $scope.gb.total * $scope.gbrate.recycle,
            hazard: $scope.gb.total * $scope.gbrate.hazard,
            total: $scope.gb.total
          }


          $scope.data = [{
            name: 'ประเภทขยะ',
            datapoints: [{
                x: 'ขยะอินทรีย์',
                y: $scope.exp.organic
              },
              {
                x: 'ขยะทั่วไป',
                y: $scope.exp.general
              },
              {
                x: 'ขยะรีไซเคิล',
                y: $scope.exp.recycle
              },
              {
                x: 'ขยะอันตราย',
                y: $scope.exp.hazard
              },
            ]
          }]

        })
    }

    //echart
    $scope.data = [{
      name: 'ประเภทขยะ',
      datapoints: [{
          x: 'ขยะอินทรีย์',
          y: 0
        },
        {
          x: 'ขยะทั่วไป',
          y: 0
        },
        {
          x: 'ขยะรีไซเคิล',
          y: 0
        },
        {
          x: 'ขยะอันตราย',
          y: 0
        },
      ]
    }];

    $scope.config = {
      //title: 'Line Chart',
      //subtitle: 'Line Chart Subtitle',
      debug: true,
      showXAxis: true,
      showYAxis: true,
      showLegend: true,
      stack: false,
    };

    //$scope.data = [$scope.pageload];

  })

  .controller('chatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('chatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('mapCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('accountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

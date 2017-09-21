angular.module('starter.controllers', ['angular-echarts', 'ngCordova', 'ui-leaflet'])

  .controller('dashCtrl', function ($scope, $cordovaSQLite, $state, $window,
    $timeout, $http, $ionicLoading, gbService) {

    $scope.showLoading = function () {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> <br/> กำลังโหลดข้อมูล...'
      }).then(function () {});
    };

    $scope.hideLoading = function () {
      $ionicLoading.hide().then(function () {});
    };




    // $scope.getRawChart = function () {
    //   $scope.showLoading();
    //   gbService.getRawChart()
    //     .then(function (res) {
    //       //$scope.gbraw = res.data;
    //       $scope.data = [{
    //         name: 'ปริมาณขยะ',
    //         datapoints: res.data
    //       }];
    //       $scope.hideLoading();
    //     });
    // };
    // $scope.getRawChart();

    // $scope.getRaw = function () {
    //   $scope.showLoading();
    //   gbService.getRaw()
    //     .then(function (res) {
    //       $scope.allGb = res.data;
    //       $scope.hideLoading();
    //     });
    // };
    // $scope.getRaw();

    // $scope.remove = function (gb) {
    //   var link = 'http://localhost/garbage/gb_raw_remove.php';
    //   $http.post(link, gb)
    //     .then(function (res) {
    //       $scope.response = res;
    //       $scope.getRawChart();
    //       $scope.getRaw();
    //     });
    // }

    $scope.getRawChart = function () {
      //$scope.showLoading();
      var sql = "select (gbmmth || gbyy) AS x, total as y  from gb_raw order by gbdate asc";
      $cordovaSQLite.execute(db, sql)
        .then(function (res) {
          $scope.data = [{
            name: 'ปริมาณขยะ',
            stack: 'da',
            datapoints: JSON.parse(JSON.stringify(res.rows))
          }];

          $scope.hideLoading();
          //console.log($scope.data);
        }, function (err) {
          console.error(err);
        });
    };
    $scope.getRawChart();

    $scope.getRaw = function () {
      //$scope.showLoading();
      var sql = "select * from gb_raw order by gbdate asc";
      $cordovaSQLite.execute(db, sql)
        .then(function (res) {
          $scope.allGb = JSON.parse(JSON.stringify(res.rows));
          $scope.hideLoading();
        }, function (err) {
          console.error(err);
        });
    };
    $scope.getRaw();

    $scope.remove = function (gb) {
      //$scope.showLoading();
      var sql = "delete from gb_raw where optname='" + gb.optname + "' and gbdate='" + gb.gbdate + "'";
      $cordovaSQLite.execute(db, sql)
        .then(function (res) {
          $scope.getRawChart();
          $scope.getRaw();
        }, function (err) {
          console.error(err);
        });
    };

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

    $scope.gotoInsert = function () {
      $state.go('tab.insert');
    };

    $scope.gotoEdit = function (gb) {
      gbService.getSelected = gb;
      $state.go('tab.detail');
    };
  })

  .controller('insertCtrl', function ($scope, $cordovaSQLite, $state, $http, $timeout, $ionicHistory) {
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
      //insert to sqlite
      var optname = $scope.gb.optname;
      var food = $scope.gb.food;
      var paper = $scope.gb.paper;
      var plastic = $scope.gb.plastic;
      var leather = $scope.gb.leather;
      var fabric = $scope.gb.fabric;
      var wood = $scope.gb.wood;
      var glass = $scope.gb.glass;
      var metal = $scope.gb.metal;
      var rock = $scope.gb.rock;
      var tile = $scope.gb.tile;
      var other = $scope.gb.other;
      var organic = $scope.gb.food + $scope.gb.wood;
      var general = $scope.gb.leather + $scope.gb.fabric + $scope.gb.rock + $scope.gb.tile + $scope.gb.other;
      var recycle = $scope.gb.paper + $scope.gb.plastic + $scope.gb.glass + $scope.gb.metal;
      var hazard = $scope.gb.hazard;
      var total = $scope.gb.food + $scope.gb.wood + $scope.gb.leather + $scope.gb.fabric + $scope.gb.rock + $scope.gb.tile + $scope.gb.other + $scope.gb.paper + $scope.gb.plastic + $scope.gb.glass + $scope.gb.metal + $scope.gb.hazard;
      var gbdate = $scope.gb.date;
      var gbdd = $scope.gb.date.getDate();
      var gbmmth = $scope.gb.date.toLocaleString("th", {
        month: "short"
      });
      var gbmmen = $scope.gb.date.toLocaleString("en", {
        month: "short"
      });
      var gbyy = $scope.gb.date.getFullYear() + 543;
      var mimg = 'img/' + gbmmen + '.png';

      //calcurate garbage rate
      var rate_organic = calRate(organic, total);
      var rate_general = calRate(general, total);
      var rate_recycle = calRate(recycle, total);
      var rate_hazard = calRate(hazard, total);
      var rate_rname = 'สถิติวันที่ ' + gbdd + ' ' + gbmmth + ' ' + gbyy;

      function calRate(a, b) {
        var gbRate = a / b;
        return gbRate;
      }

      //console.log(' organic='+rate_organic+' general='+rate_general+' recycle='+rate_recycle+' hazard='+rate_hazard);

      var sql_rawgb = "INSERT INTO gb_raw (optname,food,paper,plastic,leather,fabric,wood,glass,metal,rock,tile,other,organic,general,recycle,hazard,total,gbdate,gbdd,gbmmth,gbmmen,gbyy,mimg) VALUES ('" + optname + "'," + food + "," + paper + "," + plastic + "," + leather + "," + fabric + "," + wood + "," + glass + "," + metal + "," + rock + "," + tile + "," + other + "," + rate_organic + "," + rate_general + "," + rate_recycle + "," + rate_hazard + "," + total + ",'" + gbdate + "'," + gbdd + ",'" + gbmmth + "','" + gbmmen + "'," + gbyy + ",'" + mimg + "')";
      console.log(sql_rawgb);
      $cordovaSQLite.execute(db, sql_rawgb).then(function (res) {
        $timeout(function () {
          $scope.gb = angular.copy($scope.init);
          $scope.gotoDash();
        }, 200);
      }, function (err) {
        console.error(err);
      });

      var sql_rategb = "INSERT INTO gb_rate (rname,organic,general,recycle,hazard) VALUES ('" + rate_rname + "'," + rate_organic + "," + rate_general + "," + rate_recycle + "," + rate_hazard + ")";
      $cordovaSQLite.execute(db, sql_rategb).then(function (res) {
        console.log('insert ok');
      }, function (err) {
        console.error(err);
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
    //console.log($scope.selGb);

    var maxXaxis = Math.max.apply(null, [
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

    //console.log(maxXaxis);

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
      //name: 'Budget vs spending',
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

  .controller('calByStatCtrl', function ($scope, $http, $timeout, $cordovaSQLite, $window) {

    $scope.reload = function () {
      $window.location.reload();
    };

    var gbrateSql = "select * from gb_rate";
    $cordovaSQLite.execute(db, gbrateSql)
      .then(function (res) {
        //dat.push(JSON.parse(JSON.stringify(res.rows)));
        $scope.gbRates = JSON.parse(JSON.stringify(res.rows));
        //console.log($scope.gbRates[0]);
      }, function (err) {
        console.error(err);
      });

    //init val
    $scope.gb = {
      total: 0,
      people: 0
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
      //console.log(ctype.rname);

      $scope.exp = {
        organic: $scope.gb.total * Number(ctype.organic),
        general: $scope.gb.total * Number(ctype.general),
        recycle: $scope.gb.total * Number(ctype.recycle),
        hazard: $scope.gb.total * Number(ctype.hazard),
        total: $scope.gb.total
      }

      //console.log($scope.exp);

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

  .controller('calByPopCtrl', function ($scope, $http, $timeout, $cordovaSQLite, $window) {

    $scope.reload = function () {
      $window.location.reload();
    };

    $scope.gbRates = [{
        type: "เทศบาลนคร",
        rate: 1.89
      },
      {
        type: "เทศบาลเมือง",
        rate: 1.15
      },
      {
        type: "เทศบาลตำบล",
        rate: 1.02
      },
      {
        type: "องค์กรปกครองส่วนท้องถิ่น",
        rate: 0.91
      }
    ];

    $scope.gb = {
      total: 0
    };

    $scope.exp = {
      total: 0
    };

    $scope.cal = function (ctype) {
      //console.log(ctype);    
      $scope.exp = {
        total: ctype * $scope.gb.total
      }
      console.log($scope.exp);
    }
  })

  .controller('mapCtrl', function ($scope, $stateParams, $ionicLoading, $cordovaGeolocation, $ionicModal, $timeout, $cordovaSQLite, leafletData, datService) {

    $scope.showLoading = function () {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> <br/> กำลังโหลดข้อมูล...'
      }).then(function () {});
    };

    $scope.hideLoading = function () {
      $ionicLoading.hide().then(function () {});
    };

    $scope.center = datService.selectedLocation;

    if ($scope.center.lat == null) {
      //console.log('yess null');
      var center = {
        lat: 19.00,
        lng: 100.00,
        zoom: 8
      }
    } else {
      var center = {
        lat: Number($scope.center.lat),
        lng: Number($scope.center.lng),
        zoom: 15
      };
      //console.log($scope.center.lat + '-' + $scope.center.lng);
    }

    var url = "http://cgi.uru.ac.th/gs-gb/nan/wms?";

    angular.extend($scope, {
      center: center,
      events: {
        markers: {
          enable: ['dragend']
        }
      },
      markers: {},
      layers: {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz',
            layerParams: {
              showOnSelector: false
            }
          },
        },
        overlays: {
          pro: {
            name: 'province',
            type: 'wms',
            visible: true,
            url: url,
            layerParams: {
              layers: 'nan:site_province',
              format: 'image/png',
              transparent: true,
              showOnSelector: false
            },
            zIndex: 4
          },
          amp: {
            name: 'amphoe',
            type: 'wms',
            visible: true,
            url: url,
            layerParams: {
              layers: 'nan:site_amphoe',
              format: 'image/png',
              transparent: true,
              showOnSelector: false
            },
            zIndex: 3
          },
          tambon: {
            name: 'tambon',
            type: 'wms',
            visible: true,
            url: url,
            layerParams: {
              layers: 'nan:site_tambon',
              format: 'image/png',
              transparent: true,
              showOnSelector: false
            },
            zIndex: 2
          },
          village: {
            name: 'village',
            type: 'wms',
            visible: false,
            url: url,
            layerParams: {
              layers: 'nan:site_village',
              format: 'image/png',
              transparent: true,
              showOnSelector: false
            },
            //visible: false,
            zIndex: 2
          }
        } //end overlays 
      },
      defaults: {
        scrollWheelZoom: true,
        popup: {
          maxWidth: 800
        }
      }
    });

    // Get the countries geojson data
    $scope.markers = [];
    $scope.getJson = function () {
      var sql = "select * from gb_marker";
      $cordovaSQLite.execute(db, sql)
        .then(function (res) {
          var dat = JSON.parse(JSON.stringify(res.rows));
          console.log(dat);
          var jsonFeatures = [];
          angular.forEach(dat, function (point) {
            var lat = point.lat;
            var lon = point.lng;
            var feature = {
              type: 'Feature',
              properties: point,
              geometry: {
                type: 'Point',
                coordinates: [lon, lat]
              }
            };
            jsonFeatures.push(feature);
          });

          var geoJson = {
            type: 'FeatureCollection',
            features: jsonFeatures
          };

          console.log(geoJson);
          // var markers = L.markerClusterGroup();
          var geoJsonLayer = L.geoJson(geoJson, {
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.name);
            }
          });
          //markers.addLayer(geoJsonLayer);
          leafletData.getMap().then(function (map) {
            map.addLayer(geoJsonLayer);
            //map.fitBounds(markers.getBounds());
          });
          //console.log(geoJson.type.features);
        }, function (err) {
          console.error(err);
        });
    };
    $scope.getJson();

    //init button
    $scope.chkLoc = true;

    $scope.$on('leafletDirectiveMap.baselayerchange', function (event, layer) {
      console.log('base layer changed to %s', layer.leafletEvent.name);
      angular.forEach($scope.layers.overlays, function (overlay) {
        if (overlay.visible) overlay.doRefresh = true;
      });
    });      

    $scope.$on("leafletDirectiveMarker.dragend", function (event, args) {
      $scope.locate = {
        lat: args.model.lat,
        lng: args.model.lng
      };
      datService.datSelected = $scope.locate;
      $scope.chkLoc = false;
      //console.log('lon: '+args.model.lng+' lat: '+args.model.lat);
    });

    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $scope.getLoc = function () {
      $scope.showLoading();
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $scope.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 16
          };
          $scope.markers = {
            //marker: angular.copy(mainMarker) 
            addMarker: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              focus: true,
              message: "Hey, drag me if you want",
              draggable: true
            }
          };
          $scope.locate = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            //txt: 'lat: '+position.coords.latitude+' lng: '+position.coords.longitude
          };
          datService.datSelected = $scope.locate;
          $scope.chkLoc = false;
          $scope.hideLoading();
        }, function (err) {
          console.log(err)
        });
    }

    // modal
    $ionicModal.fromTemplateUrl('templates/mod-hh.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    //get data
    $scope.dataTypes = [{
        type: "ข้อมูลครัวเรือน",
        val: 1
      },
      {
        type: "แหล่งรับซื้อขยะรีไซเคิล",
        val: 2
      },
      {
        type: "บ่อฝังกลบขยะ",
        val: 3
      }
    ];

    $scope.preNames = [{
        type: "นาย",
        val: 1
      },
      {
        type: "นาง",
        val: 2
      },
      {
        type: "น.ส.",
        val: 3
      }
    ];

    $scope.reset = function () {
      $scope.dataType = null;

      $scope.h = {
        //pname: {type: null},
        fname: null,
        sname: null,
        desc: null
      };

      $scope.m = {
        name: null,
        desc: null
      };

      $scope.l = {
        name: null,
        desc: null
      };

      console.log($scope.h);
    }

    $scope.insertMarker = function (dataType, val) {
      var loc = datService.datSelected;

      if (dataType.type == 'ข้อมูลครัวเรือน') {
        $scope.dat = {
          datType: dataType.type,
          name: val.pname.type + ' ' + val.fname + ' ' + val.sname,
          desc: val.desc,
          lat: loc.lat,
          lng: loc.lng
        }
      } else if (dataType.type == 'แหล่งรับซื้อขยะรีไซเคิล') {
        $scope.dat = {
          datType: dataType.type,
          name: val.name,
          desc: val.desc,
          lat: loc.lat,
          lng: loc.lng
        }
      } else if (dataType.type == 'บ่อฝังกลบขยะ') {
        $scope.dat = {
          datType: dataType.type,
          name: val.name,
          desc: val.desc,
          lat: loc.lat,
          lng: loc.lng
        }
      }

      console.log($scope.dat);

      var sql_marker = "INSERT INTO gb_marker (data_type,name,desc,lat,lng) VALUES ('" + $scope.dat.datType + "','" + $scope.dat.name + "','" + $scope.dat.desc + "'," + $scope.dat.lat + "," + $scope.dat.lng + ")";
      console.log(sql_marker);
      $cordovaSQLite.execute(db, sql_marker).then(function (res) {
        $timeout(function () {
          $scope.reset();
          $scope.modal.hide();
        }, 400);
      }, function (err) {
        console.error(err);
      });
    }

  })


  .controller('accountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

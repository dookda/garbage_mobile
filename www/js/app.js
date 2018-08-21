var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

  .run(function ($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    //create database
    //var db = window.openDatabase(database_name, database_version, database_displayname, database_size);
    db = window.openDatabase("gb", "1.0", "gb", 1000000);

    // create gb_raw table
    //$cordovaSQLite.execute(db,'drop table sqlite_sequence');
    //$cordovaSQLite.execute(db, "CREATE TABLE example(id integer primary key, data_nam text, data_num numeric)");
    //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    var gb_raw = "CREATE TABLE IF NOT EXISTS gb_raw (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "gbtoken TEXT," +
      "optname TEXT," +
      "rname BOOLEAN," +
      "pop REAL," +
      "food REAL," +
      "paper REAL," +
      "plastic REAL," +
      "leather REAL," +
      "fabric REAL," +
      "wood REAL," +
      "glass REAL," +
      "metal REAL," +
      "rock REAL," +
      "tile REAL," +
      "other REAL," +
      "hazard REAL," +
      "organic REAL," +
      "general REAL," +
      "recycle REAL," +
      "total REAL," +
      "gbdate TEXT," +
      "gbdd REAL," +
      "gbmmth TEXT," +
      "gbmmen TEXT," +
      "gbyy REAL," +
      "mimg character varying(10)" +
      ")";
    $cordovaSQLite.execute(db, gb_raw);

    //create gaabage rate
    var gb_rate = "CREATE TABLE IF NOT EXISTS gb_rate(" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "gbtoken TEXT," +
      "rname character varying(60)," +
      "organic numeric," +
      "general numeric," +
      "recycle numeric," +
      "hazard numeric," +
      "total numeric" +
      ")";
    $cordovaSQLite.execute(db, gb_rate);

    // //insert default value
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('จากผู้เชี่ยวชาญ (อบต.ป่าคา)', 19.0, 50.0, 30.0, 1.0)");
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('สถิติจังหวัด เชียงใหม่ เชียงราย แม่ฮ่องสอน ลำพูน',	64.98,	2.06,	29.45,	3.53)");
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('สถิติจังหวัดลำปาง พะเยา แพร่ สุโขทัย',	61.43,	2.7,	31.98,	3.9)");
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('สถิติจังหวัดพิษณุโลก น่าน อุตรดิตถ์ พิจิตร',	60.46,	2.77,	33.54,	3.26)");
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('สถิติของภาคเหนือ',	63.81,	2.39,	30.4,	3.4)");
    // $cordovaSQLite.execute(db, "INSERT INTO gb_rate (rname, organic, general, recycle, hazard) VALUES ('สถิติของประเทศ',	63.57,	2.61,	30.59,	3.23)");

    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'จากผู้เชี่ยวชาญ (อบต.ป่าคา)', 0.19, 0.50, 0.30, 0.01 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='จากผู้เชี่ยวชาญ (อบต.ป่าคา)' AND organic=.190 AND general=0.500 AND recycle=0.300 AND hazard=0.010 );");
    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'สถิติจังหวัด เชียงใหม่ เชียงราย แม่ฮ่องสอน ลำพูน',	0.6498,	0.0206,	0.2945,	0.0353 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='สถิติจังหวัด เชียงใหม่ เชียงราย แม่ฮ่องสอน ลำพูน' AND organic=0.6498 AND general=0.0206 AND recycle=0.2945 AND hazard=0.0353 );");
    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'สถิติจังหวัดลำปาง พะเยา แพร่ สุโขทัย',	0.6143,	0.027,	0.3198,	0.039 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='สถิติจังหวัดลำปาง พะเยา แพร่ สุโขทัย' AND organic=0.6143 AND general=0.027 AND recycle=0.3198 AND hazard=0.039 );");
    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'สถิติจังหวัดพิษณุโลก น่าน อุตรดิตถ์ พิจิตร',	0.6046,	0.0277,	0.3354,	0.0326 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='สถิติจังหวัดพิษณุโลก น่าน อุตรดิตถ์ พิจิตร' AND organic=0.6046 AND general=0.0277 AND recycle=0.3354 AND hazard=0.0326 );");
    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'สถิติของภาคเหนือ',	0.6381,	0.0239,	0.304,	0.034 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='สถิติของภาคเหนือ' AND organic=0.6381 AND general=0.0239 AND recycle=0.304 AND hazard=0.034 );");
    $cordovaSQLite.execute(db, "INSERT INTO gb_rate(rname, organic, general, recycle, hazard) SELECT 'สถิติของประเทศ',	0.6357,	0.0261,	0.3059,	0.0323 WHERE NOT EXISTS(SELECT 1 FROM gb_rate WHERE  rname='สถิติของประเทศ' AND organic=0.6357 AND general=0.0261 AND recycle=0.3059 AND hazard=0.0323 );");

    //create marker
    var gb_marker = "CREATE TABLE IF NOT EXISTS gb_marker(" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "data_type character varying(50)," +
      "name character varying(100)," +
      "desc character varying(255)," +
      "lat numeric," +
      "lng numeric" +
      ")";
    $cordovaSQLite.execute(db, gb_marker);

    //delete
    //$cordovaSQLite.execute(db, "DELETE FROM gb_rate WHERE ID = 7");
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    //$ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);

    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        cache: false,
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'dashCtrl'
          }
        }
      })

      .state('tab.insert', {
        url: '/insert',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-insert.html',
            controller: 'insertCtrl'
          }
        }
      })
      .state('tab.detail', {
        url: '/detail',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-detail.html',
            controller: 'detailCtrl'
            //cache: false
          }
        }
      })

      .state('tab.calByStat', {
        url: '/calByStat',
        views: {
          'tab-calByStat': {
            templateUrl: 'templates/tab-calByStat.html',
            controller: 'calByStatCtrl'
          }
        }
      })

      .state('tab.calByPop', {
        url: '/calByPop',
        views: {
          'tab-calByPop': {
            templateUrl: 'templates/tab-calByPop.html',
            controller: 'calByPopCtrl'
          }
        }
      })

      // .state('tab.chats', {
      //   url: '/chats',
      //   views: {
      //     'tab-chats': {
      //       templateUrl: 'templates/tab-chats.html',
      //       controller: 'chatsCtrl'
      //     }
      //   }
      // })
      // .state('tab.chat-detail', {
      //   url: '/chats/:chatId',
      //   views: {
      //     'tab-chats': {
      //       templateUrl: 'templates/chat-detail.html',
      //       controller: 'chatDetailCtrl'
      //     }
      //   }
      // })

      .state('tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'mapCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  });

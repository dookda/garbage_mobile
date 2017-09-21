var url = 'http://localhost';

angular.module('starter.services', ['ngCordova'])

.service('dengueService', function($http) {
  return {
      selectedLocation: {},
      selectedReport: {},
      loadDenguePoint: function() {
          var data = url+'/hms-api/index.php/denguepoint';
          return $http.get(data);
      },
      getJson: function() {
          var data =  url+':8080/geoserver/hms/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hms:v_dengue_point&maxFeatures=50&outputFormat=application%2Fjson';
          return $http.get(data);
      }
  }
})

.service('placeService', function($http) {
  return {
      getProv: function() {
          var pdata = url+'/hms-api/index.php/prov';
          return $http.get(pdata);
      },
      getAmp: function(pcode) {
          var adata = url+'/hms-api/index.php/amp/' + pcode;
          return $http.get(adata);
      },
      getTam: function(acode) {
          var tdata = url+'/hms-api/index.php/tam/' + acode;
          return $http.get(tdata);
      },
      getVill: function(tcode) {
          var vdata = url+'/hms-api/index.php/vill/' + tcode;
          return $http.get(vdata);
      }
  }
})

  .service('gbService', function ($http,$window) {    
    return {
      getSelected: {},
      getRawChart: function (dat) {
        var data = url + '/garbage-api/index.php/gbchart';
        return $http.get(data);
      },
      getRaw: function (dat) {
        var data = url + '/garbage-api/index.php/gbraws';
        return $http.get(data);
      },
      getRate: function (dat) {
        var data = url + '/garbage-api/index.php/gbrate/' + dat;
        return $http.get(data);
      }
    }
  })

  .service('datService', function ($http,$window) {    
    return {
      datSelected: {},
      selectedLocation:{}
    }
  })

  .factory('gbServ', function($cordovaSQLite){
    var dat = [];
    var sql = "select * from gb_rate"; 
    $cordovaSQLite.execute(db, sql)
    .then(function (res) {        
      dat.push(JSON.parse(JSON.stringify(res.rows)));
    }, function (err) {
      console.error(err);
    });

    return {
      all: function () {
        //return JSON.parse(JSON.stringify(dat));
        return dat;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };

  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });



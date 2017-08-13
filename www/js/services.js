var url = 'http://localhost';

angular.module('starter.services', [])

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



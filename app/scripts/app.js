//require("./landing");
//require("./collection");
//require("./album");
//require("./profile");

var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: '/images/album-placeholder.png',
    songs: [
        { name: 'Blue', length: '4:26'},
        { name: 'Green', length: '3:14'},
        { name: 'Red', length: '5:01'},
        { name: 'Pink', length: '3:21'},
        { name: 'Magenta', length: '2:15'}
    ]
};

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        })

        .state('song', {
            url: '/song',
            templateUrl: '/templates/song.html'
        })

        .state('collection', {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })

        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })
}]);

// This is a cleaner way to call the controller than crowding it on the module definition.
blocJams.controller('Landing.controller', ['$scope', function($scope) {
    $scope.headingText = "Bloc Jams";
    $scope.headingTextClicked = function () {
        shuffle($scope.albumURLs);
    };

    $scope.subText = "Get Down, Get Funky!";
    $scope.subTextClicked = function() {
        $scope.subText += '!';
    };

    $scope.albumURLs = [
        '/images/album-placeholders/album-1.jpg',
        '/images/album-placeholders/album-2.jpg',
        '/images/album-placeholders/album-3.jpg',
        '/images/album-placeholders/album-4.jpg',
        '/images/album-placeholders/album-5.jpg',
        '/images/album-placeholders/album-6.jpg',
        '/images/album-placeholders/album-7.jpg',
        '/images/album-placeholders/album-8.jpg',
        '/images/album-placeholders/album-9.jpg'
    ];
}]);

blocJams.controller('Collection.controller', ['$scope', function($scope) {
    $scope.albums = [];
    for (var i = 0; i < 33; i++) {
        $scope.albums.push(angular.copy(albumPicasso));
    }
}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.album = angular.copy(albumPicasso);

    var hoveredSong = null;
    var playingSong = null;

    $scope.onHoverSong = function(song) {
        hoveredSong = song;
    };

    $scope.offHoverSong = function(song) {
        hoveredSong = null;
    };

    $scope.getSongState = function(song) {
        if (song === SongPlayer.currentSong && SongPlayer.playing) {
            return 'playing';
        }
        else if (song === hoveredSong){
            return 'hovered';
        }
        else {
            return 'default';
        }
    };

    $scope.playSong = function(song) {
        SongPlayer.setSong($scope.album, song);
        SongPlayer.play();
    };

    $scope.pauseSong = function(song) {
        SongPlayer.pause();
    };

    //$scope.consoleLogger = ConsoleLogger;

}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.songPlayer = SongPlayer;
}]);

blocJams.service('SongPlayer', function() {
    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
    };

    return {
       currentSong: null,
       currentAlbum: null,
       playing: false,

       play: function() {
           this.playing = true;
       },
       pause: function() {
           this.playing = false;
       },
       next: function() {
           var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
           currentTrackIndex++;
           if (currentTrackIndex >= this.currentAlbum.songs.length) {
               //currentTrackIndex = 0;
               this.playing = false;
               this.currentSong = null;
           }
           this.currentSong = this.currentAlbum.songs[currentTrackIndex];
       },
       previous: function() {
           var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
           currentTrackIndex--;
           if (currentTrackIndex < 0) {
               //currentTrackIndex = this.currentAlbum.songs.length - 1;
               this.playing = false;
               this.currentSong = null;
           }
           this.currentSong = this.currentAlbum.songs[currentTrackIndex];
       },
       setSong: function(album, song) {
           this.currentAlbum = album;
           this.currentSong = song;
       }
   };
});


//blocJams.service('ConsoleLogger', function() {
//    return {
//        log: function() {
//            console.log("Hello World!");
//        }
//    };
//});


var witouchApp = angular.module('cam-viewer', []).factory('socket', ['clientID',function(clientID) {
	console.log("CamViewer :: serverPath : "+serverPath+"feedStatus");
	return io.connect(serverPath+'feedStatus',{query:"clientID="+clientID});
}]);

witouchApp.value('clientID',clientID);
witouchApp.value('requestedFeedName','');


witouchApp.controller('all-cams', function ($scope,socket,requestedFeedName) {
	console.log("all cams controller running ...");


});

witouchApp.controller('one-cam', function ($scope,$rootScope,$http,socket) {
	$scope.play = function(){
		console.log("Play clicked : feedName : "+$scope.feedName);

		witouchApp.value('requestedFeedName',$scope.feedName);

		$scope.loading = true;

		$http.post('./requestFeed',{feedName:$scope.feedName}).success(function(data) {
			console.log("Request feed response :");
			console.log(data);


			socket.once('feedStatusUpdate',function(data){
				console.log('Feed status update received :');
				console.log(data);
				console.log('Requested feed was '+$scope.feedName);
				$scope.$apply(function(){
		            $scope.loading = false;
		        });

				$rootScope.$broadcast("someEvent",{rtmpUri:$scope.rtmpUri});
			});
		});
	};
});

witouchApp.controller('cam-viewer',function($scope,socket){
	console.log("cam viewer ");

	$scope.$on('someEvent',function(event,args){
		console.log("some event received");
		console.log(args);


		var flashvars = {src:args.rtmpUri,streamType:"live"};
		var params = {wmode:"direct",allowfullscreen:"true"};
		var attributes = {};
		
		swfobject.embedSWF("/static/swf/StrobeMediaPlayback.swf", "player", "100%", "400px", "11.0.0", "/static/swf/expressInstall.swf",flashvars, params,attributes);
		

	});
});
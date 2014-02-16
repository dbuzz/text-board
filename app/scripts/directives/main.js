'use strict';

define(['underscore', 'angular',
		'text!views/paginator.html',
		'app-filters'],
	   function(_, angular, paginatorHtml) {
	return angular.module('appDirectives', [
		'appFilters'
	])
	.directive('myPaginator', function($log, $document, $timeout) {
		return {
			restrict: 'AE',
			template: paginatorHtml
		};
	})
	.directive('myYoutube', function($sce, $http) {
		return {
			restrict: 'EA',
			scope: { code:'=' },
			replace: true,
			template: '<div ng-show="active" class="player-container" style="width:{{width}};height:{{height}}"><iframe style="overflow:hidden;width:{{width}};height:{{height}}" width="{{width}}" height={{height}} src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
			link: function (scope) {
				scope.width = 500;
				scope.height = 500 * 3 / 4;
				scope.active = false;

				console.log('here  ', scope.code);
				scope.$watch('code', function (newVal) {
					if (newVal) {
						$http.get('https://gdata.youtube.com/feeds/api/videos/'+newVal+'?v=2&alt=json').then(function(res){
							console.log(res);
							if (res.data.entry.media$group.yt$aspectRatio.$t === 'widescreen') {
								scope.height = scope.width * 9 / 16;
							} else {
								scope.height = scope.width * 4 / 3;
							}
							scope.active = true;
							scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' +
											res.data.entry.media$group.yt$videoid.$t);
						});
					}
				});
			}
		};
	});
});

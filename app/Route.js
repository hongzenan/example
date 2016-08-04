require('angular');
require('./core/css/bootstrap/css/bootstrap.css');
require('angular-ui-router');
require('./core/images/index.css');
var routerApp = angular.module('App', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    template: require('./header/index.html')
                },
                'topbar@index': {
                    template:  require('./header/topbar.html') ,
                     controller: function($scope, $state,$rootScope,$http,$location,$sce) {
                        $scope.addUserType = function() {
                        	var url="http://10.225.4.52:9090/api/kbsearch?q="+$scope.search+"&p=0";
                            $http.get(url).then(function(response){
                            	$rootScope.keywords=$scope.search;
                            	$rootScope.pageno=response.data.totalElements;
							if($scope.search===undefined){
                            	}else{
                                    if(response.data.totalElements===0){
                                        $state.go("index.result.noresult");
                                    }
                                    else{
							var message;
							message = response.data.content;
							for(var i = 0; i < message.length; i ++) {
									message[i].content = $sce.trustAsHtml(message[i].content);
								}
								$rootScope.message = message;

                               $state.go("index.result",{},{reload : true});
								}
                            }

                            });
                        };
                    }
                },
                'main@index': {
                    template: require('./body/home.html'),
                }
            }
        })
        .state('index.result', {
            url: '/result',
            views: {
                'main@index': {
                    template: require('./body/result.html'),
                    controller:function($scope,$http,$rootScope,$state,$location,$sce){
//分页总数
$scope.pageSize = 10;
var pageNum,
pageNum=$rootScope.pageno
$scope.pages = Math.ceil(pageNum/ $scope.pageSize); //分页数
$scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
$scope.pageList = [];
$scope.selPage = 1;

//分页要repeat的数组
for (var i = 0; i < $scope.newPages; i++) {
$scope.pageList.push(i + 1);
}
//打印当前选中页索引
$scope.selectPage = function (page) {
//不能小于1大于最大
if (page < 1 || page > $scope.pages) return;
//最多显示分页数5
if (page > 2) {
//因为只显示5个页数，大于2页开始分页转换
var newpageList = [];
for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
newpageList.push(i + 1);
}
$scope.pageList = newpageList;
}
$scope.selPage = page;
$scope.isActivePage(page);
console.log("选择的页：" + page);
var url="http://10.225.4.52:9090/api/kbsearch?"+"q="+$rootScope.keywords+"&p="+($scope.selPage-1);
   $http.get(url).then(function(response){

                            	$rootScope.pageno=response.data.totalElements;
							    var message;
							    message = response.data.content;
							    for(var i = 0; i < message.length; i ++) {
									message[i].content = $sce.trustAsHtml(message[i].content);
								}
								$rootScope.message = message;

                            });

};
//设置当前选中页样式
$scope.isActivePage = function (page) {
return $scope.selPage == page;
};
//上一页
$scope.Previous = function () {
$scope.selectPage($scope.selPage - 1);
var url="http://10.225.4.52:9090/api/kbsearch?"+"q="+$rootScope.keywords+"&p="+($scope.selPage-1);
   $http.get(url).then(function(response){

                            	$rootScope.pageno=response.data.totalElements;
							    var message;
							    message = response.data.content;
							   for(var i = 0; i < message.length; i ++) {
									message[i].content = $sce.trustAsHtml(message[i].content);
								}
								$rootScope.message = message;

                            });
}
//下一页
$scope.Next = function () {
$scope.selectPage($scope.selPage + 1);
 var url="http://10.225.4.52:9090/api/kbsearch?"+"q="+$rootScope.keywords+"&p="+($scope.selPage-1);
   $http.get(url).then(function(response){
                            	$rootScope.pageno=response.data.totalElements;
							    var message;
							    message = response.data.content;
							    for(var i = 0; i < message.length; i ++) {
									message[i].content = $sce.trustAsHtml(message[i].content);
								}
								$rootScope.message = message;

                            });

};

}
                }
            }
        })
          .state('index.result.text', {
            url: '/text?type',
            views: {
                'main@index': {
                    template: require('./body/text.html'),
                        controller: function($scope,$stateParams,$rootScope) {
                            $rootScope.id=$stateParams.type;
                    }

                }
            }
        })
             .state('index.result.video', {
            url: '/video',
            views: {
                'main@index': {
                    template: require('./body/video.html'),
                }
            }
        })
                .state('index.result.discussion', {
            url: '/discussion',
            views: {
                'main@index': {
                    template: require('./body/discussion.html'),
                }
            }
        })
                   .state('index.result.noresult', {
            url: '/noresult',
            views: {
                'main@index': {
                    template: require('./body/noresult.html'),
                }
            }
        })




});


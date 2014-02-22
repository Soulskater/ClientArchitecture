//
//Host Controller
//
HostApp.controller('HostCtrl',
    ['$scope', '$log',
    function ($scope, $log) {
        $scope.apps = [];
        HostApi.onAppAdded(function () {
            $scope.apps = HostApi.getApps();
            $scope.$apply();
        });
    }]);
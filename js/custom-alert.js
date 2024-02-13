/**
 * Created by samsan on 3/19/18.
 * This custom alert component is used for home page on the right side splash
 * If you need to turn off or on, just set status in json file to on or off
 */

/*
  Updated on February 13, 2024
  Removed alert url vm.getUrl() from prm-topbar-after and moved it into the custom-alert.js component 
  That way we can disable prm-topbar-after.js without affecting the alert message
*/

(function () {
    angular.module('viewCustom')
        .controller('customAlertCtrl',['prmSearchService','$scope',function (prmSearchService, $scope) {
            let vm = this;
            let cs = prmSearchService;
            vm.apiUrl = {};
            vm.alertMsg = {};

            // get rest endpoint Url
            vm.getUrl=function () {
                var configFile = cs.getEnv();
                var url = '/primo-explore/custom/HVD_IMAGES/html/'+configFile;
                cs.getAjax(url,'','get')
                    .then(function (res) {
                        vm.api=res.data;
                        // Set alert url
                        vm.alertUrl = vm.api.alertUrl;
                        // Set api url
                        cs.setApi(vm.api);
                        },
                        function (error) {
                            console.error(error);
                        }
                    )
            };

            vm.$onInit=()=> {
                vm.apiUrl=cs.getApi();
                // Get alert url
                vm.getUrl();
                // Watch alert url
                $scope.$watch('vm.alertUrl',() => {
                    if(vm.alertUrl) {
                        cs.getAjax(vm.alertUrl,'','get')
                        .then((res)=>{
                            vm.alertMsg = res.data;
                        },
                        (err) => {
                            console.log(err);
                        })
                    }
                });
            };
            
        }]);

    angular.module('viewCustom')
        .component('customAlert', {
            bindings:{parentCtrl:'<'},
            controller: 'customAlertCtrl',
            controllerAs:'vm',
            templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-alert.html'
        });
})();

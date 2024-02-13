/**
 * Created by samsan on 6/29/17.
 */

(function () {

    angular.module('viewCustom')
    .controller('prmTopbarAfterController', ['$element','prmSearchService','$scope','$compile', function ($element,prmSearchService, $scope, $compile) {

        let vm = this;
        let cs = prmSearchService;

        // get rest endpoint Url
        vm.getUrl=function () {
            var configFile = cs.getEnv();
            cs.getAjax('/primo-explore/custom/HVD_IMAGES/html/'+configFile,'','get')
                .then(function (res) {
                        vm.api=res.data;
                        cs.setApi(vm.api);
                    },
                    function (error) {
                        console.log(error);
                    }
                )
        };

        vm.$onInit=function() {
            vm.getUrl();

        };

    }]);


    angular.module('viewCustom')
    .component('prmTopbarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmTopbarAfterController'
    });

})();

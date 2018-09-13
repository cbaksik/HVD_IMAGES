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
            cs.getAjax('/primo-explore/custom/01HVD_IMAGES/html/'+configFile,'','get')
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
            // hide primo tab menu
            vm.parentCtrl.showMainMenu=false;
            // create new div for the top white menu
            let primoExplore = document.getElementsByTagName('primo-explore')[0];
            let div=document.createElement('div');
            div.setAttribute('id','customTopMenu');
            div.setAttribute('class','topMenu');
            // create custom top white bar
            let customTop = document.createElement('custom-top-menu');
            div.appendChild(customTop);
            if(primoExplore.children[0].className !== 'topMenu') {
                $compile(div)($scope);
                primoExplore.prepend(div);
            }

            vm.getUrl();

        };

    }]);


    angular.module('viewCustom')
    .component('prmTopbarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmTopbarAfterController'
    });

})();
/**
 * Created by samsan on 6/8/17.
 * This component add customize logo and Hollis Images text
 */


(function () {
    angular.module('viewCustom')
    .controller('prmLogoAfterController', [ '$element', function ($element) {

        vm.$onInit=function() {
        };



    }]);


    angular.module('viewCustom')
    .component('prmLogoAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmLogoAfterController',
        'templateUrl':'/primo-explore/custom/HVD_IMAGES/html/prm-logo-after.html'
    });

})();



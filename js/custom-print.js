/**
 * Created by samsan on 9/5/17.
 * Custom print page so it would print all the images, scan contents, etc.
 */

(function () {

    angular.module('viewCustom')
    .controller('customPrintCtrl',['$window','$stateParams',function ($window,$stateParams) {
        var vm=this;
        var params=$stateParams;

        vm.print=function () {
            var url='/primo-explore/printPage/'+vm.parentCtrl.context+'/'+vm.parentCtrl.pnx.control.recordid;
            url+='?vid=HVD_IMAGES';
            $window.open(url,'_blank');
        }

    }]);

    angular.module('viewCustom')
    .component('customPrint',{
        bindings:{parentCtrl:'<'},
        controller: 'customPrintCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-print.html'
    });

})();


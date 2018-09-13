/**
 * Created by samsan on 9/5/17.
 * This for printing page when a user click on print icon
 */


(function () {

    angular.module('viewCustom')
    .controller('customPrintPageCtrl',['$element','$stateParams','customService','$timeout','$window','$state',function ($element,$stateParams,customService,$timeout,$window, $state) {
        var vm=this;
        vm.item={};
        var cs=customService;
        // get item data to display on full view page
        vm.getItem=function () {
          var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/'+vm.context+'/'+vm.docid;
          url+='?vid=01HVD_IMAGES';
          cs.getAjax(url,'','get').then(
              function (result) {
              vm.item=result.data;
              vm.goto();
            },
            function (error) {
                console.log(error);
            }
          )

        };

        vm.goto=function() {
            var obj={docid:vm.item.pnx.control.recordid[0],vid:'HVD2',lang:'en_US'};
            $state.go('fulldisplay',obj,{location:false, reload:true,notify:true});

        };


        vm.$onInit=function () {
            // capture the parameter from UI-Router
            vm.docid=$stateParams.docid;
            vm.context=$stateParams.context;
            vm.vid='01HVD_IMAGES';
            vm.getItem();
            $timeout(function () {
                var el=document.getElementsByTagName('body')[0];
                if(el) {
                    el.setAttribute('id','printView');
                }
            },50);

            $window.onafterprint=()=>{
                $window.close();
            }
        };

        vm.$postLink=function () {
            $timeout(function () {
                $window.print();
            },3000)
        };

    }]);

    angular.module('viewCustom')
    .component('customPrintPage',{
        bindings:{parentCtrl:'<'},
        controller: 'customPrintPageCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD_IMAGES/html/custom-print-page.html'
    });

})();
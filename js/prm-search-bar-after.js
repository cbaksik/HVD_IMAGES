/**
 * Created by samsan on 5/22/17.
 * Access search box json data. Then change the number item per page. See prm-search-service.js file
 */

(function () {

    angular.module('viewCustom')
    .controller('prmSearchBarAfterController', ['prmSearchService','$location', function (prmSearchService,$location) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        // get page object
        let pageObj=sv.getPage();
        sv.removePageInfo();

        vm.$onChanges=function() {
            pageObj.currentPage = 1;
            pageObj.totalItems = 0;
            pageObj.totalPages = 0;
            pageObj.userClick=false;
            sv.setPage(pageObj);

            // show text in search box
            if(!vm.parentCtrl.mainSearchField) {
                var params=$location.search();
                if(params.searchString) {
                    vm.parentCtrl.mainSearchField = params.searchString;
                }
            }

        };

    }]);

    angular.module('viewCustom')
    .component('prmSearchBarAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchBarAfterController',
        'template':`<div id="searchResultList"></div>`
    });

})();

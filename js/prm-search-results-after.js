/* Author: Sam San
 This custom component is used for search result list which display all the images in thumbnail.
 */

(function () {

    angular.module('viewCustom')
    .controller('prmSearchResultListAfterController', ['prmSearchService','$mdDialog','$element','$mdMedia','$state','$timeout', function (prmSearchService, $mdDialog,$element, $mdMedia, $state, $timeout) {

        // call custom service from the injection
        let sv=prmSearchService;
        this.searchInfo = sv.getPage(); // get page info object

        let vm = this;
        let ev='';
        let dialog='';
        vm.searchInProgress=true;
        vm.modalDialogFlag=false;
        vm.currentPage=1;
        vm.flag=false;
        vm.searchData={};
        vm.paginationNumber=6;
        vm.index=0;
        vm.flexSize={'size1':20,'size2':80,'class':'spaceLeft15'};
        // set search result set per page, default 50 items per page

        // set up page counter
        vm.pageCounter = {'min':0,'max':0};
        // calculate the page counter such as 1-50 of 1,232
        this.findPageCounter=function () {
            vm.pageCounter.min = ((this.searchInfo.currentPage - 1) * this.searchInfo.pageSize) + 1;

            if(vm.pageCounter.min > this.searchInfo.totalItems) {
                vm.pageCounter.min = this.searchInfo.totalItems;
            }
            vm.pageCounter.max = this.searchInfo.currentPage * this.searchInfo.pageSize;
            if(vm.pageCounter.max > this.searchInfo.totalItems) {
                vm.pageCounter.max = this.searchInfo.totalItems;
            }

        };


        // when a user click on next page or select new row from the drop down, it call this search function to get new data
        vm.ajaxSearch=function () {
            this.searchInfo=sv.getPage();
            var limit=this.searchInfo.pageSize;
            console.log(`*** *** *** this.searchInfo *** *** ***`);
            console.log(this.searchInfo);
            var remainder = parseInt(this.searchInfo.totalItems) - (parseInt(this.searchInfo.currentPage - 1) * parseInt(this.searchInfo.pageSize));

            if(remainder < this.searchInfo.pageSize) {
                limit=remainder;
            }

            var params={'addfields':[],'offset':0,'limit':parseInt(this.searchInfo.pageSize),'lang':'en_US','inst':'01HVD','getMore':0,'pcAvailability':true,'q':'','rtaLinks':true,
            'sort':'rank','tab':'default_tab','vid':'HVD_IMAGES','scope':'default_scope','qExclude':'','qInclude':'','searchString':'','mode':'','multiFacets':''};


            params.limit=limit;
            params.offset = (this.searchInfo.currentPage - 1) * this.searchInfo.pageSize;

            if(vm.parentCtrl.searchService.cheetah.searchData) {
                params.q = vm.parentCtrl.searchService.cheetah.searchData.q;
                params.searchString = vm.parentCtrl.searchService.cheetah.searchData.searchString;
                params.mode = vm.parentCtrl.searchService.cheetah.searchData.mode;
                params.lang = vm.parentCtrl.searchService.cheetah.searchData.lang;
                params.sort = vm.parentCtrl.searchService.cheetah.searchData.sort;
                params.tab = vm.parentCtrl.searchService.cheetah.searchData.tab;
                params.scope = vm.parentCtrl.searchService.cheetah.searchData.scope;
                params.inst = vm.parentCtrl.searchService.cheetah.searchData.inst;
                params.vid = vm.parentCtrl.searchService.cheetah.searchData.vid;
                params.qInclude = vm.parentCtrl.searchService.cheetah.searchData.qInclude;
                params.qExclude=vm.parentCtrl.searchService.cheetah.searchData.qExclude;
                params.getMore=vm.parentCtrl.searchService.cheetah.searchData.getMore;
                params.pcAvailability=vm.parentCtrl.searchService.cheetah.searchData.pcAvailability;
                params.addfields=vm.parentCtrl.searchService.cheetah.searchData.addfields;
            }

            // start ajax loader progress bar
            vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=true;
            vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=true;
            vm.parentCtrl.searchService.searchStateService.searchObject.offset=params.offset;

            // multiFacets
            if(vm.parentCtrl.searchService.cheetah.searchData.multiFacets) {
                params.multiFacets = vm.parentCtrl.searchService.cheetah.searchData.multiFacets.toString();
            }


            // get the current search rest url
            let url = vm.parentCtrl.briefResultService.restBaseURLs.pnxBaseURL;
            sv.getAjax(url,params,'get')
           .then(function (data) {
                let mydata = data.data;
                vm.items=sv.convertData( mydata.docs);
                // stop the ajax loader progress bar
                vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
                vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
                vm.searchInProgress=false;
               },
            function (err) {
               console.log(err);
               vm.parentCtrl.searchService.searchStateService.searchObject.newSearch=false;
               vm.parentCtrl.searchService.searchStateService.searchObject.searchInProgress=false;
               vm.searchInProgress=false;
            }
           )

        };

        // when a user click on next page or prev page, it call this function.
        this.pageChanged=function (currentPage) {
            // prevent calling ajax twice during refresh the page or click on facets
            if(!vm.flag) {
                this.searchInfo.currentPage = currentPage;
                this.searchInfo.userClick=true;
                this.searchInfo.offset=parseInt(currentPage - 1) * this.searchInfo.pageSize;
                this.searchInfo.searchString=vm.parentCtrl.searchString;
                this.searchInfo.query=vm.parentCtrl.$stateParams.query;
                sv.setPage(this.searchInfo); // keep track a user click on each current page
                // ajax call function
                if(vm.parentCtrl.isFavorites===false) {
                    vm.ajaxSearch();
                }
                // calculate the min and max of items
                this.findPageCounter();
            }
            vm.flag=false;
        };

        vm.items=[];

        vm.$onInit = function () {
            if(vm.parentCtrl.isFavorites===false) {

                // remove left margin on result list grid
                var el = $element[0].parentNode.parentNode.parentNode;
                el.children[0].remove();

                // remove prm-result-list display item if the favorite page is false
                var parentNode=$element[0].parentNode.children[0];
                parentNode.remove();

                this.searchInfo = sv.getPage(); // get page info object
                // watch for new data change when a user search

                vm.parentCtrl.$scope.$watch(() => vm.parentCtrl.searchResults, (newVal, oldVal) => {

                    if (vm.parentCtrl.$stateParams.offset > 0) {
                        vm.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
                        this.searchInfo.currentPage = parseInt(vm.parentCtrl.$stateParams.offset / this.searchInfo.pageSize) + 1;
                    } else {
                        vm.currentPage = 1;
                        this.searchInfo.currentPage = 1;
                    }
                    vm.flag = true;
                    // convert xml data into json data so it knows which image is a restricted image
                    if (vm.parentCtrl.isFavorites === false && vm.parentCtrl.searchResults) {
                        vm.items = sv.convertData(vm.parentCtrl.searchResults);
                    }
                    // set up pagination
                    this.searchInfo.totalItems = vm.parentCtrl.totalItems;
                    this.searchInfo.totalPages = parseInt(vm.parentCtrl.totalItems / this.searchInfo.pageSize);
                    if ((this.searchInfo.pageSize * this.searchInfo.totalPages) < this.searchInfo.totalItems) {
                        this.searchInfo.totalPages++;
                    }

                    this.findPageCounter();

                    this.searchInfo.query = vm.parentCtrl.$stateParams.query;
                    this.searchInfo.searchString = vm.parentCtrl.searchString;
                    sv.setPage(this.searchInfo);
                    vm.searchInProgress = vm.parentCtrl.searchInProgress;

                });

            }

        };

        vm.$onChanges=function() {
            if(vm.parentCtrl.isFavorites===false) {
                vm.searchData = vm.parentCtrl.searchService.cheetah.searchData;
                if (vm.parentCtrl.searchString) {
                    vm.searchData.searchString = vm.parentCtrl.searchString;
                }
            }
            // for small screen size
            if($mdMedia('xs')) {
                vm.paginationNumber=2;
                vm.flexSize.size1=100;
                vm.flexSize.size2=100;
                vm.flexSize.class='';
            } else if($mdMedia('sm')) {
                vm.paginationNumber=4;
            }

            // set data to pass into favorite list controller
            sv.setData(vm.parentCtrl);

        };

        vm.$doCheck=function() {
            vm.modalDialogFlag=sv.getDialogFlag();
        };

        this.closeDialog=function () {
            sv.setDialogFlag(false);
            vm.modalDialogFlag=false;
            $mdDialog.hide();
        };

        // for click
        vm.popup=(e,index)=>{
            ev=e;
            vm.modalDialogFlag=true;
            vm.index=index;
            let dataitem=vm.items[vm.index];
            vm.itemData={'item':'','searchData':''};
            vm.itemData.item=dataitem;
            vm.itemData.searchData=vm.searchData;
            sv.setItem(vm.itemData);
            vm.goto();
            $timeout(function () {
                vm.openDialog();

            },500);
        };

        // for keypress
        vm.popup2=(e,index)=>{
            if(e.which===13) {
                vm.popup(e,index);
            }
        };

        // go to full display state
        vm.goto=function() {
            let obj={docid:vm.itemData.item.pnx.control.recordid[0],vid:'HVD_IMAGES',lang:'en_US',search_scope:vm.searchData.scope,tab:vm.searchData.tab, q:vm.searchData['q'],searchString:vm.searchData['searchString'],sortby:vm.searchData.sort,offset:vm.searchData.offset};
            $state.go('fulldisplay',obj,{location:false, reload:true,notify:false});
        };

        // open modal dialog when click on thumbnail image
        vm.openDialog=function () {
           dialog = $mdDialog.show({
                title:'Full View Details',
                targetEvent: ev,
                clickOutsideToClose: true,
                focusOnOpen:true,
                escapeToClose: true,
                bindToController:true,
                templateUrl:'/primo-explore/custom/HVD_IMAGES/html/custom-full-view-dialog.html',
                controller:'customFullViewDialogController',
                controllerAs:'vm',
                fullscreen:true,
                multiple:true,
                openFrom:{left:0},
                locals: {
                    items:vm.itemData
                },
                onComplete:function (scope, element) {
                    sv.setDialogFlag(true);

                },
                onRemoving:function (element,removePromise) {
                    sv.setDialogFlag(false);
                }
            });

            return false;
        };


        this.getPreviousRecord=function() {
            if(vm.index >0 && vm.index < vm.items.length) {
                vm.index--;
                vm.popup(ev,vm.index);
            }
        };


        this.getNextRecord=function() {
            if(!dialog.$$state.status) {
                if (vm.index >= 0 && vm.index < (vm.items.length - 1)) {
                    vm.index++;
                    vm.popup(ev,vm.index);

                }
            }
        }


    }]);



    angular.module('viewCustom')
    .component('prmSearchResultListAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmSearchResultListAfterController',
        templateUrl: '/primo-explore/custom/HVD_IMAGES/html/prm-search-results.html'
    });

})();

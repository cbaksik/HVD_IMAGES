/**
 * Created by samsan on 3/20/18.
 * It use for intercept http request so it would change the search default limit to 50
 */


// override the limit=10 when a user refresh page at search result list
/**
 * Removed on 01/19/2024 for troubleshooting performance issues
(function () {
    angular.module('viewCustom').config(['$httpProvider',function ($httpProvider) {

        $httpProvider.interceptors.push(function() {
            return {
                'request': function (config) {
                    // override the default page size limit
                    if(config.params) {
                        if(config.params.limit===10) {
                            config.params.limit = 50;
                        }

                    }
                    if(config.method==='POST' && config.url==='/primo_library/libweb/webservices/rest/v1/actions/email') {
                        // override request parameters if a user click on pagination
                        var pageObj=JSON.parse(window.localStorage.getItem('pageInfo'));

                        // add parameters to email link
                        var url=config.data.records[0].deeplink;
                        var urlStr=new URL(window.location.href);
                        var offset=0;
                        if(urlStr.searchParams.get('offset')) {
                            offset = urlStr.searchParams.get('offset');
                        }
                        var searchString='';
                        if(urlStr.searchParams.get('searchString')) {
                            searchString = urlStr.searchParams.get('searchString');
                        } else if(pageObj.searchString) {
                            searchString=pageObj.searchString;
                        }
                        var sortby='rank';
                        if(urlStr.searchParams.get('sortby')) {
                            sortby = urlStr.searchParams.get('sortby');
                        }
                        var q='';
                        if(urlStr.searchParams.get('q')) {
                            q = urlStr.searchParams.get('q');
                        } else if(pageObj.query) {
                            q=pageObj.query;
                        }
                        // override the url parameter
                        if(pageObj.userClick) {
                            offset=pageObj.offset;
                            searchString=pageObj.searchString;
                            q=pageObj.query;
                        }
                        url+='&sortby='+sortby+'&offset='+offset+'&searchString='+searchString+'&q='+q;
                        config.data.records[0].deeplink=encodeURI(url);
                    }
                    return config;
                },

                'response': function (response) {
                    return response;
                }
            };

        });


    }]);
})();
*/

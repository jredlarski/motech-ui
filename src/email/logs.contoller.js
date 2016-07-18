(function(){
    'use strict';

    angular.module('motech-email')
        .controller('EmailLogsController', emailLogsController);

    emailLogsController.$inject = ['$compile', '$scope', 'EmailLogsService', 'ModalWindow'];
    function emailLogsController ($compile, $scope, EmailLogsService, ModalWindow) {
        
        EmailLogsService.get().then(updateRows);

        $scope.search = {};
        $scope.initialSearch = {"deliveryStatus":["ERROR","SENT","RECEIVED"]};
        $scope.search = $scope.initialSearch;
        $scope.$watch('search', updateSearch, true);

        $scope.changePageTo = changePageTo;
        
        $scope.showExportModal = showExportModal;
        $scope.hideExportModal = hideExportModal;

        function changePageTo(page){
            EmailLogsService.getPage(page)
            .then(updateRows);
        }

        function updateRows(rows){
            $scope.logs = rows;
            $scope.totalItems = EmailLogsService.totalRecords;
            $scope.currentPage = EmailLogsService.currentPage;
        }

        var searchUpdateTimeout;
        function updateSearch(searchData){
            if(searchUpdateTimeout){
                clearTimeout(searchUpdateTimeout);
                searchUpdateTimeout=null;
            }
            searchUpdateTimeout = setTimeout(function() {
                EmailLogsService.get(searchData)
                .then(updateRows);
            }, 1000);
        }

        var exporModal = ModalWindow(
            $compile('<email-export close="hideExportModal()"></email-export>')($scope),
            'Export (Translate ME)');
        function showExportModal(){
            exporModal.open();
        }
        function hideExportModal(){
            exporModal.close();
        }
    }

})();
(function(){
'use strict';

angular.module("NarrowItDownApp",[])
.controller("NarrowItDownController",NarrowItDownController)
.service("MenuSearchService",MenuSearchService)
.constant('ApiUrl'," https://davids-restaurant.herokuapp.com/")
.directive('foundItems',FoundItems);

function FoundItems()
{
    var ddo={
        templateUrl: '/foundItems.html',
        restrict: 'E',
        scope:{
            foundItems: '<',
            onRemove:'&'

        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'narrowList',
        bindToController: true
    };
    return ddo;
}

function FoundItemsDirectiveController()
{
    var narrowList=this;
    narrowList.checkEmpty=function(){
        if(narrowList.foundItems!=undefined && narrowList.foundItems.length===0)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
}

NarrowItDownController.$inject['MenuSearchService'];
function NarrowItDownController(MenuSearchService)
{
    var listController=this;
    listController.getMenuItems=function()
    {
        listController.found=[];
        if(listController.SearchTerm!=undefined && listController.SearchTerm!='')
        {
            var promise=MenuSearchService.getMatchedMenuItems(listController.SearchTerm);
        promise.then(function(foundItems){
        listController.found=foundItems;
        
        }).catch(function(ex){
            console.log(ex.message);
        });    
        }
       
        
    }

    listController.removeItem=function(index)
    {
        listController.found.splice(index,1);
    }
    
}


MenuSearchService.$inject['$http','ApiUrl'];
function MenuSearchService($http,ApiUrl)
{
    var service=this;
    service.getMatchedMenuItems=function(SearchTerm)
    {
        return $http({
            url:(ApiUrl+"/menu_items.json"),
            method:"GET"
            
            
        }).then(function(result){
            var dataList=result.data['menu_items'];
           
            var foundItems=[];
            for(var i=0;i<dataList.length;i++)
            {
               
                var check=(dataList[i])['description'].includes(SearchTerm.toLowerCase());
                if(check===true)
                {
                    foundItems.push(dataList[i]);
                }
            }
            
            return foundItems;
        });
    }
}




})();

(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.constant('baseURL','https://davids-restaurant.herokuapp.com/menu_items.json')
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.controller('foundItemsDirectiveController',foundItemsDirectiveController)
.directive('foundItems',foundItems);

NarrowItDownController.$inject = ['MenuSearchService'];
MenuSearchService.$inject = ['$http','baseURL'];

function NarrowItDownController(MenuSearchService){
  var NItDCtrl = this;

   NItDCtrl.searchTerm = "";
   NItDCtrl.message = '';
   NItDCtrl.found = [];
   NItDCtrl.showDivLoader = false;


   NItDCtrl.removeItem = function(index){
     NItDCtrl.found.splice(index,1);
   };

   NItDCtrl.getSearchItems = function(){
     NItDCtrl.message = '';
     NItDCtrl.found = [];


    if (NItDCtrl.searchTerm == ''){
       NItDCtrl.message = 'Nothing found';
    }else{
      NItDCtrl.showDivLoader = true;
      var promise = MenuSearchService.getMatchedMenuItems(NItDCtrl.searchTerm);
      console.log('promise: ',promise);
      promise
      .then(
        function(responseSearch){
          if (responseSearch.length == 0) {
            NItDCtrl.message = 'Nothing found';
          }else{
            NItDCtrl.found = responseSearch;
            NItDCtrl.message = '';

          }
        NItDCtrl.showDivLoader = false;
        console.log('ok http');
      })/*,
      function(error){
        console.log("erreeur1: ",error);
      },
      function(error){
        console.log("erreeur2: ",error);
      }
    );*/
  //)
   .catch(function(responseSearch){
      console.log('Connexion erreur: ',responseSearch);
      NItDCtrl.showDivLoader = false;
      NItDCtrl.message = '!!!! Connexion au serveur impossible !!!!';
    });
  }

 }
}

function MenuSearchService($http,baseURL){
  var mSearch = this;

  mSearch.getMatchedMenuItems = function(searchTerm){

    return  $http({
      method:'GET',
      url: baseURL
    })
    .then(function (result) {
      // process result and only keep items that match
      var foundItems = [];

        angular.forEach(result.data.menu_items,function(item){
          if (item.description.match(searchTerm) ){
            foundItems.push(item);
          }
        })
      // return processed items
      return foundItems;
    });
  /*  .catch(function(result){
      console.log('Erreur http: ',result);
      return [];
    });*/
}
}

function foundItems(){
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'foundItem',
    bindToController: true,
    link:foundItemsDirectiveControllerLink,
    transclude:true
  };
  return ddo;
}
function foundItemsDirectiveController(){
  var foundItem = this;


  foundItem.elemInList = function(){
    return foundItem.items.length == 0
  }
}

function foundItemsDirectiveControllerLink(scope,element,attrs,controller){

  var elem = element.find(".items");
  scope.$watch('foundItem.elemInList()',function(newValue,oldValue){
    //console.log('linking message: ',foundItem.longTabFound);


    if (newValue){
      //elem.css('display','none');
    //  elem.fadeOut('30000');
      hideItems();
    }else{
      displayItems();
      //elem.css('display','block');
    //  elem.fadeIn('30000');
    }
  });
  function displayItems(){
    elem.css('display','block');
    //elem.fadeIn('3000');

    //elem.slideUp('slow');
  }
  function hideItems(){
    elem.css('display','none');
    //elem.fadeOut('3000');
  //elem.slideDown('slow');
  }
}

})();

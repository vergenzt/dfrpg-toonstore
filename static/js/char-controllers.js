/*
 * Angular.js controllers for charsheet components
 */

var app = angular.module('charsheet', ['ngResource']);

/*
 * Retrieve the JSON data from server
 */
app.service('rootModel', ['$rootScope', '$resource', function($rootScope, $resource)
{
	this._resource = $resource('json', {}, {cache:true});

	this.data = this._resource.get();
}]);

app.filter('reverse', function(){
	return function(items){
		return items ? items.slice().reverse() : items;
	};
});



/**********************************************
 * Panel Controllers
 **********************************************/

// handle general panel

function GeneralCtrl($scope, rootModel)
{
	$scope.data = rootModel.data;
	$scope.editing = false;
}


// handle aspects

function AspectCtrl($scope, rootModel)
{
	$scope.data = rootModel.data;
	$scope.editing = false;

	$scope.addAspect = function(){
		console.log('Adding aspect');
		$scope.data.aspects.aspects.push( {name: '', description: ''} );
	};

	$scope.removeAspect = function(index){
		console.log('Removing aspect at ', index);
		$scope.data.aspects.aspects.splice(index,1);
	};
}


// skill block and dependencies

app.factory('SkillSets', ['rootModel', function(rootModel)
{
	var arr = [];

	if( !rootModel.data.$resolved )
		return arr;

	for(var i=rootModel.data.totals.skill_cap; i>=0; i--)
		{
			var set = {
				'label': $scope.label(i),
				'index': i,
				'skills': ($scope.shifted ? $scope.data.skills.shifted_lists[i] : $scope.data.skills.lists[i]) || []
			};
			arr.push(set);
		}
		return arr;

}]);

function SkillCtrl($scope, rootModel, SkillSets)
{
	$scope.data = rootModel.data;

	$scope.editing = false;
	$scope.shifted = false;

	// data.skills.lists
	// data.skills.shifted_lists
	$scope.label = function(value){
		var ladder = ['Mediocre (+0)', 'Average (+1)', 'Fair (+2)', 'Good (+3)', 'Great (+4)', 'Superb (+5)', 'Fantastic (+6)', 'Epic (+7)', 'Legendary (+8)'];
		return ladder[value];
	};

	$scope.presOrder = function(){
		var arr = [];
		if( ! $scope.data.$resolved )
			return arr;

		for(var i=$scope.data.totals.skill_cap; i>=0; i--){
			arr.push(i);
		}
		return arr;
	};
}


// special global-scope function to upload avatar
function uploadAvatar()
{
	console.log('stuff');
	var formData = new FormData($('form')[0]);
	$.ajax({
		'url': 'avatar',
		'type': 'POST',
		'contentType': false,
		'processData': false,
		'cache': false,
		'data': formData,

		'success': function(data,status,xhr){
			$('#avatar > #imgContainer > img')[0].src = 'avatar';
		},
		'error': function(xhr,status,err){
			console.log(err, status);
		}
	});
};

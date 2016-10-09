app.controller('SigninCtrl', function($scope, $state, $firebaseArray){
	$scope.register = function(data){
		auth.createUserWithEmailAndPassword(data.email, data.password).then(function(result) {
			saveUser();
			console.log("User account successfully created.");
			$state.go('app.profile');
		}).catch(function(error) {
			console.log("Registration Failed!", error);
		});
	};

	$scope.login = function(data){
		auth.signInWithEmailAndPassword(data.email, data.password).then(function(result) {
			console.log("Authenticated successfully.");
			$state.go('app.profile');
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	};

	$scope.login_google = function(){
		sign_with_popup(new firebase.auth.GoogleAuthProvider());
	};

	sign_with_popup = function(provider){
		auth.signInWithPopup(provider).then(function(result) {
			var users = $firebaseArray(rootRef.child('users'));
			users.$loaded().then(function() {
				if (users.$indexFor(auth.currentUser.uid) == -1) saveUser();
			})
			console.log("Authenticated successfully.");
			$state.go('app.profile');
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	}

	saveUser = function(){
		var userRef = rootRef.child('users/' + auth.currentUser.uid);
		userRef.set({
    	email: auth.currentUser.email,
  	});
	}
});

app.controller('AppCtrl', function($scope, $state, $firebaseArray, $firebaseObject){
	$scope.data = {};
	$scope.providers = {};
	$scope.data.skills = [];
	$scope.data.tasks = [];
	$scope.data.plans = [];

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			init();
		} else {
			$scope.providers = {};
			$scope.data = {}; 
		}
	});

	check_providers = function(){
		auth.currentUser.providerData.forEach(function(provider) {
			switch(provider.providerId) {
				case "password":
					$scope.providers.password = provider;
					break;
				case "google.com":
					$scope.providers.google = provider;	
					break;
			};
		});
	}

	$scope.logout = function(){
		if(auth.currentUser){
			auth.signOut().then(function(result) {
				console.log("User logged out.");
				$state.go('signin');
			});
		};
	};

	$scope.link_google = function(){
		link_with_popup(new firebase.auth.GoogleAuthProvider());
		check_providers();
	};

	link_with_popup = function(provider){
		auth.currentUser.linkWithPopup(provider).then(function(result) {
			console.log("Authenticated successfully.");
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	}

	$scope.change_email = function(data){
		auth.currentUser.updateEmail(data.email);
	}

	$scope.change_password = function(data){
		auth.currentUser.updatePassword(data.password);
	}

	init = function(){
		check_providers();
		$scope.data.email = auth.currentUser.email;

		var userData = $firebaseObject(rootRef.child('users/' + auth.currentUser.uid));
		userData.$loaded().then(function() {
  		parse_info(userData.plans);
  		$scope.data.xp = userData.xp;
  		$scope.data.level = xp_logic(userData.xp);
  	});
	}

	parse_info = function(data){
		for (plan in data) {
			if ($scope.data.plans.indexOf(plan)==-1) $scope.data.plans.push(plan);
			for (task in data[plan].tasks) {
				if ($scope.data.tasks.indexOf(task)==-1) $scope.data.tasks.push(task);
				var skills = data[plan].tasks[task].skills;
				for (skill in skills){
					if ($scope.data.skills.indexOf(skills[skill])==-1) $scope.data.skills.push(skills[skill]);
				}
			}
		}
	}

	xp_logic = function(data){
		var level = 1;
		for (i = 1; data > 50*i*(++i); ) level++;
		return level;
	}
});
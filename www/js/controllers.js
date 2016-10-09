app.controller('SigninCtrl', function($scope, $state){
	$scope.register = function(data){
		auth.createUserWithEmailAndPassword(data.email, data.password).then(function(result) {
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
			console.log("Authenticated successfully.");
			$state.go('app.profile');
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	}
});

app.controller('AppCtrl', function($scope, $state){
	$scope.data = {};
	$scope.providers = {};

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			check_providers();
			$scope.data.email = auth.currentUser.email;
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
});
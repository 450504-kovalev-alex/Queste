app.controller('MainCtrl', function($scope){

});

app.controller('SigninCtrl', function($scope, $state){
	$scope.register = function(data){
		auth.createUserWithEmailAndPassword(data.email, data.password).then(function(result) {
			console.log("User account successfully created.");
			$state.go('profile');
		}).catch(function(error) {
			console.log("Registration Failed!", error);
		});
	};

	$scope.login = function(data){
		auth.signInWithEmailAndPassword(data.email, data.password).then(function(result) {
			console.log("Authenticated successfully.");
			$state.go('profile');
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
			$state.go('profile');
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	}
});


app.controller('ProfileCtrl', function($scope, $state){

	$scope.go_to_settings = function(){
		$state.go('settings');
	}

	$scope.logout = function(){
		if(auth.currentUser){
			auth.signOut().then(function(result) {
				console.log("User logged out.");
				$state.go('signin');
			});
		};
	};
});

app.controller('SettingsCtrl', function($scope, $state){
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

	$scope.go_to_profile = function(){
		$state.go('profile');
	}
});
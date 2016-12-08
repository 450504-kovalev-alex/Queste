app.controller('SigninCtrl', function($scope, $state, $firebaseArray, userService, auth){
	$scope.register = function(data){
		auth.createUserWithEmailAndPassword(data.email, data.password).then(function(result) {
			userService.saveUser({
				email: auth.currentUser.email
			}, auth.currentUser.uid);
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
			var users = $firebaseArray(new rootRef().child('users'));
			users.$loaded().then(function() {
				if (users.$indexFor(auth.currentUser.uid) == -1) userService.saveUser({
					email: auth.currentUser.email
				}, auth.currentUser.uid);
			})
			console.log("Authenticated successfully.");
			$state.go('app.profile');
		}).catch(function(error) {
			console.log("Login Failed!", error);
		});
	}
});

app.controller('AppCtrl', function($scope, $state, $firebaseObject, userService, storyService, questService, skillService, xpService){
	$scope.data = {};
	$scope.loading = false;

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("HEY!");
			$scope.data = {};
			if($scope.loading == false) {
				$scope.loading = true;
				loadData();
			}
		} else {
			$scope.data = {}; 
		}
	});

	$scope.logout = function(){
		if(auth.currentUser){
			auth.signOut().then(function(result) {
				$scope.data = {}; 
				console.log("User logged out.");
				$state.go('signin');
			});
		};
	};

	loadData = function(){
		console.log("YOU!");
		$scope.data.email = auth.currentUser.email;

		r = userService.loadUser(auth.currentUser.uid).then(function(result){
			$scope.data.user = userService.getUser();
			storyService.loadStories().then(function(result){
				questService.loadQuests();
				$scope.reloadStories();
				$scope.reloadQuests();
				$scope.loading = false;
			});
			skillService.loadSkills(auth.currentUser.uid).then(function(result){
				$scope.reloadSkills();
			});

			$scope.data.xp = $scope.data.user.xp;
		})
		return r;
	}

	$scope.xp2next = function(xp){
		xpService.calculateXP(xp);
		return " " + Math.ceil(xpService.getXPtoNextLevel()) + " xp to next level";
	}

	$scope.reloadStories = function(){
		$scope.data.stories = storyService.getStories().sort(function(a,b){
			var a_end = questService.getQuests(a.id).filter(function(quest){
				return quest.status == true;
			}).map(function(quest) {return quest.endDate});
			var b_end = questService.getQuests(b.id).filter(function(quest){
				return quest.status == true;
			}).map(function(quest) {return quest.endDate});
			if(b_end.length == 0) return 0;
			if(a_end.length == 0) return 1;
			if(Math.max.apply(null, a_end) >= Math.max.apply(null, b_end)) return 0;
			return 1;
		});
	}

	$scope.reloadQuests = function(){
		$scope.data.quests = questService.getAllQuests().filter(function(quest){
			return quest.status == true;
		}).sort(function(a, b){
			if(a.endDate > b.endDate) return 1;
			return 0;
		});
	}

	$scope.reloadSkills = function(){
		$scope.data.skills = skillService.getSkills().sort(function(a,b){
			xpService.calculateXP(a.xp);
			var a_xp = Math.ceil(xpService.getXPtoNextLevel());
			xpService.calculateXP(b.xp);
			var b_xp = Math.ceil(xpService.getXPtoNextLevel());
			if(a_xp > b_xp) return 1;
			return 0;
		});
	}

	$scope.calculateXP = function(difficulty, startDate, endDate, finishDate){
		var _MS_PER_DAY = 1000 * 60 * 60 * 24;
		var urgency;

		var sd = returnUTC(startDate);
		var ed = returnUTC(endDate);
		var fd = returnUTC(finishDate);
		var days2finish = Math.ceil((ed - sd) / _MS_PER_DAY);
		switch(days2finish){
			case 0:
			case 1: urgency = 1; break;
			case 2: urgency = 0.9; break;
			case 7: urgency = 0.75; break;
			case 30: urgency = 0.5; break;
			default: urgency = 0.25; break;
		}
		console.log("Urgency: " + days2finish + " days, " + urgency + " modifier");
		var finishedDaysBefore = Math.floor((ed - fd) / _MS_PER_DAY);
		var bonusTime = finishedDaysBefore > 50 ? 0.25 : finishedDaysBefore*0.005;
		console.log("Bonus Time: " + finishedDaysBefore + ", " + bonusTime + " modifier");
		console.log("Difficulty: " + difficulty/100);
		var xp = difficulty*(urgency+bonusTime);
		console.log("Total xp: " + xp);
		return xp;
	};

	returnUTC = function(d){
		var t = new Date(d);
		return Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
	}

	$scope.deadlineCheck = function(endDate){
		return new Date(endDate) < new Date();
	}
});

app.controller("ProfileCtrl", function($scope, $state, xpService){
	$scope.$on('$ionicView.beforeEnter', function(){ 
		
	});

	$scope.get5skills = function(){
		return $scope.data.skills ? $scope.data.skills.slice(0,5) : null;
	}

	$scope.get5stories = function(){
		return $scope.data.stories ? $scope.data.stories.slice(0,5) : null;
	}

	$scope.get5quests = function(){
		return $scope.data.quests ? $scope.data.quests.slice(0,5) : null;
	}

	$scope.getLevel = function(){
		xpService.calculateXP($scope.data.xp);
		return xpService.getCurLevel();
	}
	$scope.getNextXP = function(){
		xpService.calculateXP($scope.data.xp);
		return xpService.getNextLevelXP();
	}
});

app.controller("SettingsCtrl", function($scope, $state){
	$scope.providers = {};
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			check_providers();		
		} else {
			$scope.providers = {};
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
});

app.controller("QuestCtrl", function($scope, $state, $stateParams, $ionicPopup, questService, skillService, userService, ionicDatePicker){
	$scope.newTask = $stateParams.questId ? false : true;
	$scope.quest = $scope.newTask ? {
		difficulty: 0,
		endDate: new Date().getTime(),
		startDate: new Date().getTime(),
		status: true
	} : questService.getQuest($stateParams.storyId, $stateParams.questId);
	$scope.pageName = $scope.newTask ? "New Task" : $scope.quest.name;
	$scope.tags = [];
	
	$scope.saveTask = function(){
		var info = {
			desc: $scope.quest.desc,
			difficulty: $scope.quest.difficulty,
			endDate: $scope.quest.endDate,
			name: $scope.quest.name,
			skills: $scope.quest.skills ? $scope.quest.skills.map(function(tag){return tag.name;}) : null,
			startDate: $scope.quest.startDate,
			status: $scope.quest.status,
		}
		if(!info.name || info.name == "") {
			var alertPopup = $ionicPopup.alert({
				title: 'Enter Name at least!!',
				template: 'You damn fool.'
			});
		}
		else{
			questService.saveQuest(info, $stateParams.storyId, $scope.quest.id);
			$scope.reloadQuests();
			$state.go("app.story", {storyId: $stateParams.storyId});
		}
	}


	$scope.confirmDelete = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Task',
			template: 'Are you sure you want to delete this quest?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				questService.deleteQuest($stateParams.storyId, $stateParams.questId);
				$scope.reloadQuests();
				$scope.return();
			}
		});
	};

	var idp = {
		callback: function (val) {
			$scope.quest.endDate = val;
			idp.inputDate = new Date(val);
		},
		from: new Date(),
		inputDate: new Date($scope.quest.endDate),
		mondayFirst: true,
		closeOnSelect: false,
		templateType: 'popup'
	};

	$scope.openDatePicker = function(){
		ionicDatePicker.openDatePicker(idp);
	};

	$scope.return = function(){
		$state.go("app.story", {storyId: $stateParams.storyId});
	}

	$scope.finishQuest = function() {
		var storyId = $stateParams.storyId;
		var questId = $stateParams.questId;

		var confirmPopup = $ionicPopup.confirm({
			title: 'Finish Task',
			template: 'Are you sure you completed this quest?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				var quest = $scope.data.quests.find(function(quest){
					return quest.id == questId && quest.storyId == storyId;
				});
				var xp = $scope.calculateXP(quest.difficulty, quest.startDate, quest.endDate, new Date().getTime()) 

				if(quest.skills) quest.skills.forEach(function(skill){
					skillService.saveSkill({
						name: skill.name ? skill.name : skill,
						xp: xp/2
					});
				});
					$scope.reloadSkills();

					$scope.data.xp += xp;
					userService.saveUser({xp: $scope.data.user.xp + xp}, auth.currentUser.uid);

					questService.saveQuest({
						status: false,
						finishDate: new Date().getTime()
					}, storyId, questId);
					$scope.reloadQuests();

					$state.go("app.story", {storyId: storyId});
				}
			});
	};

	$scope.getStartDate = function(){
		return new Date($scope.quest.startDate).toLocaleDateString();
	};

	$scope.getEndDate = function(){
		return new Date($scope.quest.endDate).toLocaleDateString();
	};

});

app.controller("StoriesCtrl", function($scope, $state, $stateParams, $ionicPopup, storyService, questService){
	$scope.showPopup = function() {
		$scope.popup = {};

		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="popup.info">',
			title: 'Enter story name',
			scope: $scope,
			buttons: [
			{ text: 'Cancel' },
			{
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
					if (!$scope.popup.info) {
						e.preventDefault();
					} else {
						return $scope.popup.info;
					}
				}
			}
			]
		});

		myPopup.then(function(res) {
			var info = {
				name: res
			};
			storyService.saveStory(info, null);
			$scope.reloadStories();
			$state.go("app.stories");
		});
	}

	$scope.confirmDelete = function(id) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Plan',
			template: 'Are you sure you want to delete this story?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				storyService.deleteStory(id);
				questService.deleteStoryQuests(id);
				$scope.reloadStories();
				$scope.reloadQuests();
			}
		});
	};
});

app.controller("StoryCtrl", function($scope, $state, $stateParams, $ionicPopup, storyService, questService, skillService, userService){
	$scope.story = {};
	$scope.story.id = $stateParams.storyId;
	$scope.story.name = storyService.getStory($stateParams.storyId).name;

	$scope.getQuests = function(){
		$scope.story.quests = $scope.data.quests.filter(function(quest){
			return quest.storyId == $scope.story.id;
		});
		return $scope.story.quests;
	};

	
	$scope.confirmDelete = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Plan',
			template: 'Are you sure you want to delete this story?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				storyService.deleteStory($scope.story.id);
				questService.deleteStoryQuests($scope.story.id);
				$scope.reloadStories();
				$scope.reloadQuests();
				$state.go("app.stories");
			}
		});
	};

	$scope.confirmQuestDelete = function(questId) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Task',
			template: 'Are you sure you want to delete this quest?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				questService.deleteQuest($scope.story.id, questId);
				$scope.reloadQuests();
			}
		});
	};

	$scope.finishQuest = function(questId) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Finish Task',
			template: 'Are you sure you completed this quest?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				var quest = $scope.story.quests.find(function(quest){
					return quest.id == questId;
				});
				var xp = $scope.calculateXP(quest.difficulty, quest.startDate, quest.endDate, new Date().getTime()) 

				if(quest.skills) quest.skills.forEach(function(skill){
					skillService.saveSkill({
						name: skill.name ? skill.name : skill,
						xp: xp/2
					});
				});
					$scope.reloadSkills();

					$scope.data.xp += xp;
					userService.saveUser({xp: $scope.data.user.xp + xp}, auth.currentUser.uid);

					questService.saveQuest({
						status: false,
						finishDate: new Date().getTime()
					}, $scope.story.id, questId);
					$scope.reloadQuests();

					$state.go("app.story", {storyId: $scope.story.id});
				}
			});
	};
});


app.controller("SkillsCtrl", function($scope, $state){
	
});

app.controller("SkillCtrl", function($scope, $state, $stateParams, skillService, xpService){
	$scope.skill = {};
	$scope.skill.id = $stateParams.skillId;
	$scope.skill.name = skillService.getSkill($stateParams.skillId).name;

	$scope.getSkillLevel = function(){
		$scope.skill.xp = $scope.data.skills.find(function(skill){
			return skill.id == $stateParams.skillId;
		}).xp;
		xpService.calculateXP($scope.skill.xp);
		$scope.skill.nextxp = xpService.getXPtoNextLevel();
		return xpService.getCurLevel();
	}

	$scope.getQuests = function(){
		$scope.skill.quests = $scope.data.quests.filter(function(quest){
			return quest.skills ? quest.skills.includes($scope.skill.name) : null;
		});
		return $scope.skill.quests;
	};
});


app.controller("SearchCtrl", function($scope, $state){
	$scope.search = {
		quests: {},
		stories: {},
		skills: {},
		text: ""
	}

	$scope.onSearchChange = function(){
		$scope.search.quests = $scope.data.quests.filter(function(quest){ return quest.name.toLowerCase().includes($scope.search.text.toLowerCase())});
		$scope.search.stories = $scope.data.stories.filter(function(story){ return story.name.toLowerCase().includes($scope.search.text.toLowerCase())});
		$scope.search.skills = $scope.data.skills.filter(function(skill){ return skill.name.toLowerCase().includes($scope.search.text.toLowerCase())});
	}
});
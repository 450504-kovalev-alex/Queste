app.factory('userService', function($firebaseObject, rootRef) {
	var user;

	return {
		loadUser: function(id){
			return $firebaseObject(new rootRef().child('users/' + id)).$loaded().then(function(response){
				user = response;
			});	
		},
		setUser: function(data){
			user = data
		},
		getUser: function(){
			return user;
		},
		saveUser: function(userData, id){
			if(id) new rootRef().child('users/' + id).update(userData);
			else new rootRef().child('users').push().set(userData);
		},
		deleteUser: function(id){
			new rootRef().child('users/'+ id).remove();
		}
	}
})

app.factory('storyService', function($firebaseArray, userService, rootRef) {
	var stories = [];
	
	return {
		loadStories: function(){
			stories = [];
			var userId = userService.getUser().$id;
			var storiesRef = new rootRef().child('users/' + userId + "/stories");
			return $firebaseArray(storiesRef).$loaded().then(function(response){
				for(i = 0; i<response.length; i++){
					stories.push({
						id: response[i].$id,
						name: response[i].name,
						quests: response[i].quests
					});
				}
			});
		},
		setStories: function(data){
			stories = data
		},
		getStories: function(){
			return stories;
		},
		getStory: function(id){
			return stories.find(function(story){
				return story.id == id;
			});
		},
		saveStory: function(storyData, id){
			var userId = userService.getUser().$id;
			if(id) {
				var index = stories.findIndex(function(story) {return story.id == id;});
				for(key in storyData){
				  if(storyData.hasOwnProperty(key)){
				    stories[index][key] = storyData[key];
				  }
				}				
				new rootRef().child('users/' + userId + "/stories/" + id).update(storyData);
			}
			else {
				var newId = new rootRef().child('users/' + userId + "/stories").push().key;
				new rootRef().child('users/' + userId + "/stories/" + newId).set(storyData);
				storyData.id = newId;
				stories.push(storyData);
			}
		},
		deleteStory: function(id){
			var userId = userService.getUser().$id;
			stories = stories.filter(function(story){
				return story.id != id;
			});
			new rootRef().child('users/' + userId + "/stories/" + id).remove();
		}
	}
})

app.factory('questService', function(storyService, userService, rootRef) {
	var quests = [];

	function cleanData(obj){
	  for (var propName in obj) { 
	    if (obj[propName] === null || obj[propName] === undefined) {
	      delete obj[propName];
	    }
	  }
	  return obj;
	}

	return {
		loadQuests: function(){
			quests = [];
			stories = storyService.getStories();
			stories.forEach(function(story){
				for (var key in story.quests) {;
   					quests.push({
   						id: key,
   						name: story.quests[key].name,
   						storyId: story.id,
   						difficulty: story.quests[key].difficulty,
   						desc: story.quests[key].desc,
   						startDate: story.quests[key].startDate,
   						endDate: story.quests[key].endDate,
   						finishDate: story.quests[key].finishDate,
   						status: story.quests[key].status,
   						skills: story.quests[key].skills
   					});
				}
			});
		},
		getAllQuests: function(){
			return quests;
		},
		getQuests: function(storyId){
			return quests.filter(function(quest){
				return quest.storyId == storyId;
			});
		},
		getQuest: function(storyId, id){
			return quests.find(function(quest){
				return quest.storyId == storyId && quest.id == id;
			});
		},
		saveQuest: function(questData, storyId, id){
			var cleanQD = cleanData(questData);
			var userId = userService.getUser().$id;
			if(id) {
				var index = quests.findIndex(function(quest) {return quest.id == id && quest.storyId == storyId;});
				for(key in cleanQD){
				  if(cleanQD.hasOwnProperty(key)){
				    quests[index][key] = cleanQD[key];
				  }
				}
				new rootRef().child('users/' + userId + "/stories/" + storyId + "/quests/" + id).update(cleanQD);
			}
			else {
				var newId = new rootRef().child('users/' + userId + "/stories/" + storyId + "/quests").push().key;
				new rootRef().child('users/' + userId + "/stories/" + storyId + "/quests/" + newId).set(cleanQD);
				questData.id = newId;
				questData.storyId = storyId;
				quests.push(cleanQD);
			}
		},
		deleteQuest: function(storyId, id){
			var userId = userService.getUser().$id;
			quests = quests.filter(function(quest){
				return quest.id != id || quest.storyId != storyId;
			});
			new rootRef().child('users/' + userId + "/stories/" + storyId + "/quests/" + id).remove();
		},
		deleteStoryQuests: function(storyId){
			quests = quests.filter(function(quest){
				return quest.storyId != storyId;
			});
		}
	}
})

app.factory('skillService', function($firebaseArray, userService, rootRef) {
	var skills = [];

	return {
		loadSkills: function(userId){
			skills = [];
			var skillsRef = new rootRef().child('users/' + userId + "/skills");
			return $firebaseArray(skillsRef).$loaded().then(function(response){
				for(i = 0; i<response.length; i++){
					skills.push({
						id: response[i].$id,
						name: response[i].name,
						xp: response[i].xp
					});
				}
			});
		},
		setSkills: function(data){
			skills = data
		},
		getSkills: function(){
			return skills;
		},
		getSkill: function(id){
			return skills.find(function(skill){
				return skill.id == id;
			});
		},
		saveSkill: function(skillData){
			var userId = userService.getUser().$id;

			var index = skills.findIndex(function(skill) {return skill.name == skillData.name;});
			if(index != -1) {
				skills[index].xp += skillData.xp;	
				new rootRef().child('users/' + userId + "/skills/" + skills[index].id).update({xp: skills[index].xp});
			}
			else {
				var newId = new rootRef().child('users/' + userId + "/skills").push().key;
				new rootRef().child('users/' + userId + "/skills/" + newId).set(skillData);
				skillData.id = newId;
				skills.push(skillData);
			}
		},
		deleteSkill: function(id){
			var userId = userService.getUser().$id;
			skills = skills.filter(function(skill){
				return skill.id != id;
			});
			new rootRef().child('users/' + userId + "/skills/" + id).remove();
		}
	}
});


app.factory('premiumService', function(xpService){
	return{
		calculateXP: function(xp){
			xpService.calculateXP(xp*1.5);
		},
		getCurLevelXP: function(){
			return xpService.getCurLevelXP();
		},
		getNextLevelXP: function(){
			return xpService.getNextLevelXP();
		},
		getXPtoNextLevel: function(){
			return xpService.getXPtoNextLevel();
		},
		getCurLevel: function(){
			return xpService.getCurLevel() + 5;
		}
	}
});

app.factory('xpService', function(){
	var curLevel, curLevelXP, nextLevelXP, curXP;
	return{
		calculateXP: function(xp){
			curXP = xp;
			curLevel = 0;
			curLevelXP = 0;
			nextLevelXP = 0;
			for (i = 1; xp >= nextLevelXP;) {
				curLevelXP = nextLevelXP;
				nextLevelXP = 50*i*(++i);
				curLevel++;
			}
		},
		getCurLevelXP: function(){
			return curLevelXP;
		},
		getNextLevelXP: function(){
			return nextLevelXP;
		},
		getXPtoNextLevel: function(){
			return nextLevelXP - curXP;
		},
		getCurLevel: function(){
			return curLevel;
		}
	}
});
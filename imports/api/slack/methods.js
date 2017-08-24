import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SlackAPI from 'meteor/khamoud:slack-api';

new ValidatedMethod({
	name: 'Verify.Password',
	validate: null,
	run: function(object) {
		if(object.password == Meteor.settings.private.Password){
			return true;
		}else {
			throw new Meteor.Error('400',"Ups wrong password")
		}
	}
});

new ValidatedMethod({
	name: 'Slack.Members',
	validate: null,
	run: function(object) {
		return SlackAPI.SlackAPI.users.list(Meteor.settings.private.SlackKey)
	}
});

new ValidatedMethod({
	name: 'Slack.Invite',
	validate: null,
	run: function(object) {
		const channels = SlackAPI.SlackAPI.channels.list(Meteor.settings.private.SlackKey)
		let ids = '';
		channels.channels.map((channel)=>{
			channel.name == 'introduction' ? ids += channel.id+",": null;
			channel.name == 'general' ? ids += channel.id+"," : null;
		})
		ids = ids.slice(0,-1);
		return SlackAPI.SlackAPI.users.admin.invite(Meteor.settings.private.SlackKey,object.email,ids)
	}
});

new ValidatedMethod({
	name: 'Slack.Channels',
	validate: null,
	run: function() {
		return SlackAPI.SlackAPI.channels.list(Meteor.settings.private.SlackKey)
	}
});

new ValidatedMethod({
	name: 'Slack.Channel.Random.Users',
	validate: null,
	run: function(object) {
		const users = SlackAPI.SlackAPI.channels.info(Meteor.settings.private.SlackKey,object.channelId).channel.members;
		let selectedUsers = [];
		for (var i = 0; i < 4; i++) {
			var randomIndex = Math.floor(Math.random() * users.length);
			selectedUsers.push(users[randomIndex]);
			users.slice(randomIndex,1);
		}
		return selectedUsers;
	}
});

new ValidatedMethod({
	name: 'Slack.Create.Group',
	validate: null,
	run: function(object) {
		return SlackAPI.SlackAPI.groups.create(Meteor.settings.private.SlackKey,object.groupName);
	}
});

new ValidatedMethod({
	name: 'Slack.Invite.Channel',
	validate: null,
	run: function(object) {
		object.userList.push("U6RA0HPFE"); // Uğur Oruç ID
		object.userList.push("U6RC0J8FP"); // Aycan Doğanlar ID
		object.userList.push("U6RC9D485"); // Cagatay ID

		object.userList.map((user)=>{
			 SlackAPI.SlackAPI.groups.invite(Meteor.settings.private.SlackKey,object.channel,user);
		})
	}
});

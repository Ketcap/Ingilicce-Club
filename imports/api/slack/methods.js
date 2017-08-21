import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SlackAPI from 'meteor/khamoud:slack-api';

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

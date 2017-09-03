import './home.html'
import { ReactiveVar } from 'meteor/reactive-var';
import { Fake } from 'meteor/anti:fake';

var shuffle = require('shuffle-array');

Template.App_Home.onCreated(function() {
	var self = this;
	self.Slack = new ReactiveVar();
	self.Channels = new ReactiveVar();
	self.SelectedChannel = new ReactiveVar();

	Meteor.call('Slack.Members',function(err,resp){
		if(!err){
			self.Slack.set(resp);
		}
	});
	Meteor.call('Slack.Channels',function(err,resp){
		if(!err){
			self.Channels.set(resp.channels)
		}
	})
})

Template.App_Home.helpers({
	memberCount:(e)=>{
		if(e.members){
			return e.members.length;
		}
	},
	slack:(e)=>{
		return Template.instance().Slack.get();
	},
	members:(e)=>{
		const filter = e.filter((user)=>{ return user.id != "USLACKBOT" })
		return shuffle(filter)
	},
	channels:(e)=>{
		return Template.instance().Channels.get();
	}
})

Template.App_Home.events({
	'click a.selectChannel':function(event,Template){
		event.preventDefault();
		const channelId = this.id;
		Template.SelectedChannel.set(channelId);
		$('#modal2').modal('open');
	},
	'submit form#call':function(event,Template){
		event.preventDefault();
		const password = event.target.password.value;
		Meteor.call('Verify.Password',{password},function(err,resp){
			if(!err){
				Materialize.toast('Initializing',2500,'green darken-2');

				const channelId = Template.SelectedChannel.get();
				Meteor.call('Slack.Channel.Random.Users',{channelId},function(err,resp){
					if(!err){
						const date = new Date();
						const userList = resp;
						Meteor.call("Slack.Create.Group",{groupName:"Call for "+Fake.color()},function(err,resp){
							if(!err){
								Meteor.call('Slack.Invite.Channel',{userList,channel:resp.group.id},function(err,resp){
									if(!err){
										Materialize.toast('Call has been created have fun :) ',2500,'green darken-2');
									}
								});
							}
						})
					}
				})

			}else{
				Materialize.toast(err.reason,2500,'red darken-2')
			}
		});

	},
	'submit form#invite':function(event,Template){
		event.preventDefault();
		const email = event.target.email.value;

		if(!email){
			Materialize.toast('Please enter E-mail',2500,'red darken-2')
			return false;
		};

		Meteor.call('Slack.Invite',{email},function(err,resp){
			if(resp.ok){
				Materialize.toast('Invitation has been sent.',2500,'green darken-2')
			}else{
				if(resp.error == 'already_invited'){
					Materialize.toast('This mail has already invitation',2500)
				}else if(resp.error == 'already_in_team'){
					Materialize.toast('This mail is already in team',2500)
				}else if(resp.error == 'invalid_email'){
					Materialize.toast('Invalid E-mail',2500)
				}
			}
		})
	}
})

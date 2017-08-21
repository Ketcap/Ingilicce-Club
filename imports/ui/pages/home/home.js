import './home.html'
import { ReactiveVar } from 'meteor/reactive-var';
var shuffle = require('shuffle-array')

Template.App_Home.onCreated(function() {
	var self = this;
	self.Slack = ReactiveVar();

	Meteor.call('Slack.Members',function(err,resp){
		if(!err){
			self.Slack.set(resp);
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
	}
})

Template.App_Home.events({
	'submit form':function(event,Template){
		event.preventDefault();
		const email = event.target.email.value;

		if(!email){
			Materialize.toast('Email Girmelisiniz',2500,'red darken-2')
			return false;
		};

		Meteor.call('Slack.Invite',{email},function(err,resp){
			if(resp.ok){
				Materialize.toast('Davet Gönderilmiştir.',2500,'green darken-2')
			}else{
				if(resp.error == 'already_invited'){
					Materialize.toast('Bu mail davetiyesi önceden gönderilmiştir.',2500)
				}else if(resp.error == 'already_in_team'){
					Materialize.toast('Bu mail takımın bir parçasıdır',2500)
				}else if(resp.error == 'invalid_email'){
					Materialize.toast('Geçersiz mail adresi',2500)
				}
			}
		})
	}
})

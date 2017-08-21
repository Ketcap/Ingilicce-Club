import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js'

BlazeLayout.setRoot('body');

// Set up all routes in the app
FlowRouter.route('/', {
	name: 'App.home',
	action() {
		BlazeLayout.render('App_Body', { main: 'App_Home' });
	},
});

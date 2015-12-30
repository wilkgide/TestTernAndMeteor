Tasks = new Mongo.Collection("tasks");

if(Meteor.isClient) {
	Template.body.events({
		"submit .new-task": function(event) {
			//Prevent default browser form submit
			event.preventDefault();
			
			var text = event.target.text.value;
			
			//Insert a task into the database
			Tasks.insert({
				text: text,
				createdAt: new Date() //current time
			})
			
			//clear form
			event.target.text.value = "";
		}
	})
	
	Template.taskList.helpers({
		tasks: function() {
			return Tasks.find({}, {sort: {createdAt: -1}});
		}
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

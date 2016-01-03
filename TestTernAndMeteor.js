Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	Template.body.events({
		"submit .new-task" : function(event) {
			// Prevent default browser form submit
			event.preventDefault();

			var text = event.target.text.value;

			// Insert a task into the database
			Tasks.insert({
				text : text,
				createdAt : new Date()
			// current time
			})

			// clear form
			event.target.text.value = "";
		}
	})

	Template.taskList.helpers({
		tasks : function() {
			return Tasks.find({}, {
				sort : {
					order: 1,
					createdAt : -1
				}
			});
		},
		tasks_sortable_options : function() {
			return {
				group : {
					name : "tasks",
					pull : false,
					put : false
				}
			};
		}
	});
	
	Template.taskList.events({
		"update" : function(event) {
			console.log(event);
		},
		"sort" : function(event) {
			console.log(event);
		}
	})

	Template.task.events({
		"click .toggle-checked" : function(event) {
			// Set the checked property to the opposite of its current value
			Tasks.update(this._id, {
				$set : {
					checked : !this.checked
				}
			});
		},

		"click .delete" : function(event) {
			// Delete this task
			Tasks.remove(this._id);
		}
	})
}

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
	});
}

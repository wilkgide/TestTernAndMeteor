Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	var i = 0;
	Template.body
			.events({
				"submit .new-task" : function(event) {
					if (Meteor.userId() == null) {
						throw new Meteor.Error(
								"Only logged in users can create tasks.");
					}
					// Prevent default browser form submit
					event.preventDefault();

					var text = event.target.text.value;

					Meteor.call("addTask", text, i);

					// clear form
					event.target.text.value = "";
				}
			});

	Template.taskList.helpers({
		tasks : function() {
			if (Session.get("hideCompleted")) {
				return Tasks.find({
					checked : {
						$ne : true
					}
				}, {
					sort : {
						order : 1
					}
				});
			} else {
				return Tasks.find({}, {
					sort : {
						order : 1
					}
				});
			}
		},
		tasks_sortable_options : function() {
			return {
				group : {
					name : "tasks",
					pull : false,
					put : false
				},
				sortField : "order"
			};
		},
		hideCompleted : function() {
			return Session.get("hideCompleted");
		},
		incompleteCount : function() {
			return Tasks.find({
				checked : {
					$ne : true
				}
			}).count();
		},
		visibleCount : function() {
			if (Session.get("hideCompleted")) {
				return Tasks.find({
					checked : {
						$ne : true
					}
				}).count();
			} else {
				return Tasks.find({}).count();
			}
		}
	});

	Template.taskList.events({
		"collection-update" : function(event) {
			console.log(event);
		},

		"change .hide-completed input" : function(event) {
			Session.set("hideCompleted", event.target.checked);
		}
	})

	Template.task.helpers({
		i : function() {
			return i;
		},
		increment : function() {
			i++;
		},
		even : function() {
			return i % 2 == 0;
		}
	})

	Template.task.events({
		"click .toggle-checked" : function(event) {
			Meteor.call("setChecked", this._id, !this.checked);
		},

		"click .delete" : function(event) {
			Meteor.call("deleteTask", this._id);
		}
	})

	Accounts.ui.config({
		passwordSignupFields : "USERNAME_ONLY"
	});

	Meteor.subscribe("tasks");
}

Meteor.methods({
	addTask : function(text, order) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("Only logged in users can create tasks.");
		}
		// Insert a task into the database
		Tasks.insert({
			text : text,
			// current time
			createdAt : new Date(),
			owner : Meteor.userId(),
			username : Meteor.user().username,
			order : order
		})
	},
	deleteTask : function(taskId) {
		// Delete this task
		Tasks.remove(taskId);
	},
	setChecked : function(taskId, checked) {
		// Set the checked property to the opposite of its current value
		Tasks.update(taskId, {
			$set : {
				checked : checked
			}
		});
	}
});

if (Meteor.isServer) {
	Meteor.publish("tasks", function() {
		return Tasks.find();
	});
	Meteor.startup(function() {
		// code to run on server at startup
	});
}

/* global MessageBus, bootbox */
import Ember from 'ember';
import Repo from 'manager-client/models/repo';

export default Ember.Controller.extend({
  output: null,

  init() {
    this._super();
    this.reset();
  },

  complete: Ember.computed.equal('status', 'complete'),
  failed: Ember.computed.equal('status', 'failed'),

  multiUpgrade: function() {
    return this.get("model.length") !== 1;
  }.property("model.length"),

  title: function () {
    return this.get("multiUpgrade") ? "All" : this.get("model")[0].get("name");
  }.property("model.@each.name"),

  isUpToDate: function () {
    return this.get("model").every(repo => repo.get("upToDate"));
  }.property("model.@each.upToDate"),

  upgrading: function () {
    return this.get("model").some(repo => repo.get("upgrading"));
  }.property("model.@each.upgrading"),

  repos() {
    const model = this.get("model");
    return this.get("isMultiple") ? model : [model];
  },

  updateAttribute(key, value, valueIsKey = false) {
    this.get("model").forEach(repo => {
      value = valueIsKey ? repo.get(value) : value; 
      repo.set(key, value);
    });
  },

  messageReceived(msg) {
    switch(msg.type) {
      case "log":
        this.set('output', this.get('output') + msg.value + "\n");
        break;
      case "percent":
        this.set('percent', msg.value);
        break;
      case "status":
        this.set('status', msg.value);

        if (msg.value === "complete") {
	        this.get("model").filter(repo => repo.get("upgrading")).forEach(repo => {
            repo.set("version", repo.get("latest.version"));
          });
        }

        if (msg.value === 'complete' || msg.value === 'failed') {
          this.updateAttribute('upgrading', false);
        }

        break;
    }
  },

  upgradeButtonText: function() {
    if (this.get("upgrading")) {
      return "Upgrading...";
    } else {
      return "Start Upgrading";
    }
  }.property("upgrading"),

  startBus() {
    MessageBus.subscribe("/docker/upgrade", msg => {
      this.messageReceived(msg);
    });
  },

  stopBus() {
    MessageBus.unsubscribe("/docker/upgrade");
  },

  reset() {
    this.setProperties({ output: '', status: null, percent: 0 });
  },

  actions: {
    start() {
      this.reset();

      if (this.get("multiUpgrade")) {
        this.updateAttribute("upgrading", true);
        return Repo.upgradeAll();
      }

      const repo = this.get('model')[0];
      if (repo.get('upgrading')) { return; }
      repo.startUpgrade();
    },

    resetUpgrade() {
      bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\n"+
                      "This will NOT cancel currently running builds and should only be used as a last resort.", result => {
        if (result) {
          if (this.get("multiUpgrade")) {
            return Repo.resetAll(this.get("model").filter(repo => !repo.get("upToDate"))).finally(() => {
              this.reset();
              this.updateAttribute("upgrading", false);
            });
          }

          const repo = this.get('model')[0];
          repo.resetUpgrade().then(function() {
            this.reset();
          });
        }
      });
    }
  },

});

"use strict";define("manager-client/app",["exports","ember","manager-client/resolver","ember-load-initializers","manager-client/config/environment"],function(e,t,n,a,l){var r=void 0;t.default.MODEL_FACTORY_INJECTIONS=!0,r=t.default.Application.extend({modulePrefix:l.default.modulePrefix,podModulePrefix:l.default.podModulePrefix,Resolver:n.default}),(0,a.default)(r,l.default.modulePrefix),e.default=r}),define("manager-client/components/progress-bar",["exports","ember"],function(e,t){e.default=t.default.Component.extend({classNameBindings:[":progress",":progress-striped","active"],active:function(){return 100!==parseInt(this.get("percent"),10)}.property("percent"),barStyle:function(){var e=parseInt(this.get("percent"),10);return e>0?(e>100&&(e=100),("width: "+this.get("percent")+"%").htmlSafe()):"".htmlSafe()}.property("percent")})}),define("manager-client/components/repo-status",["exports","ember"],function(e,t){e.default=t.default.Component.extend({tagName:"tr",upgradeDisabled:function(){if(!this.get("upgradingRepo")){var e=this.get("managerRepo");return!!e&&!e.get("upToDate")&&e!==this.get("repo")}return!0}.property("upgradingRepo","repo","managerRepo","managerRepo.upToDate"),officialRepoImageSrc:function(){if(this.get("repo.official"))return Discourse.getURL("/plugins/docker_manager/images/font-awesome-check-circle.png")}.property("repo.official"),actions:{upgrade:function(){this.sendAction("upgrade",this.get("repo"))}}})}),define("manager-client/components/x-console",["exports","ember"],function(e,t){e.default=t.default.Component.extend({classNameBindings:[":logs"],_outputChanged:function(){t.default.run.scheduleOnce("afterRender",this,"_scrollBottom")}.observes("output"),_scrollBottom:function(){this.get("followOutput")&&this.$().scrollTop(this.$()[0].scrollHeight)},_scrollOnInsert:function(){this._scrollBottom()}.on("didInsertElement")})}),define("manager-client/controllers/application",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({showBanner:function(){if(this.get("bannerDismissed"))return!1;var e=this.get("banner");return e&&e.length>0}.property("banner","bannerDismissed","banner.@each"),appendBannerHtml:function(e){var t=this.get("banner")||[];-1===t.indexOf(e)&&t.pushObject(e),this.set("banner",t)},logoUrl:function(){return Discourse.getURL("/assets/images/docker-manager-aff8eaea0445c0488c19f8cfd14faa8c2b278924438f19048eacc175d7d134e4.png")}.property(),returnToSiteUrl:function(){return Discourse.getURL("/")}.property(),backupsUrl:function(){return Discourse.getURL("/admin/backups")}.property(),actions:{dismiss:function(){this.set("bannerDismissed",!0)}}})}),define("manager-client/controllers/index",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({managerRepo:null,upgrading:null,upgradeAllButtonDisabled:function(){return!this.get("managerRepo.upToDate")||this.get("allUpToDate")}.property("managerRepo.upToDate","allUpToDate"),allUpToDate:function(){return this.get("model").every(function(e){return e.get("upToDate")})}.property("model.@each.upToDate"),actions:{upgradeAllButton:function(){this.replaceRoute("upgrade","all")}}})}),define("manager-client/controllers/processes",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({autoRefresh:!1,init:function(){this._super();var e=this;window.setInterval(function(){e.performRefresh()},5e3)},performRefresh:function(){this.get("autoRefresh")&&this.get("model").refresh()}})}),define("manager-client/controllers/upgrade",["exports","ember","manager-client/models/repo"],function(e,t,n){e.default=t.default.Controller.extend({output:null,init:function(){this._super(),this.reset()},complete:t.default.computed.equal("status","complete"),failed:t.default.computed.equal("status","failed"),multiUpgrade:function(){return 1!==this.get("model.length")}.property("model.length"),title:function(){return this.get("multiUpgrade")?"All":this.get("model")[0].get("name")}.property("model.@each.name"),isUpToDate:function(){return this.get("model").every(function(e){return e.get("upToDate")})}.property("model.@each.upToDate"),upgrading:function(){return this.get("model").some(function(e){return e.get("upgrading")})}.property("model.@each.upgrading"),repos:function(){var e=this.get("model");return this.get("isMultiple")?e:[e]},updateAttribute:function(e,t){var n=!(arguments.length<=2||void 0===arguments[2])&&arguments[2];this.get("model").forEach(function(a){t=n?a.get(t):t,a.set(e,t)})},messageReceived:function(e){switch(e.type){case"log":this.set("output",this.get("output")+e.value+"\n");break;case"percent":this.set("percent",e.value);break;case"status":this.set("status",e.value),"complete"===e.value&&this.get("model").filter(function(e){return e.get("upgrading")}).forEach(function(e){e.set("version",e.get("latest.version"))}),"complete"!==e.value&&"failed"!==e.value||this.updateAttribute("upgrading",!1)}},upgradeButtonText:function(){return this.get("upgrading")?"Upgrading...":"Start Upgrading"}.property("upgrading"),startBus:function(){var e=this;MessageBus.subscribe("/docker/upgrade",function(t){e.messageReceived(t)})},stopBus:function(){MessageBus.unsubscribe("/docker/upgrade")},reset:function(){this.setProperties({output:"",status:null,percent:0})},actions:{start:function(){if(this.reset(),this.get("multiUpgrade"))return this.updateAttribute("upgrading",!0),n.default.upgradeAll();var e=this.get("model")[0];e.get("upgrading")||e.startUpgrade()},resetUpgrade:function(){var e=this;bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\nThis will NOT cancel currently running builds and should only be used as a last resort.",function(t){if(t){if(e.get("multiUpgrade"))return n.default.resetAll(e.get("model").filter(function(e){return!e.get("upToDate")})).finally(function(){e.reset(),e.updateAttribute("upgrading",!1)});e.get("model")[0].resetUpgrade().then(function(){this.reset()})}})}}})}),define("manager-client/helpers/app-version",["exports","ember","manager-client/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n,a){function l(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return t.hideSha?r.match(a.versionRegExp)[0]:t.hideVersion?r.match(a.shaRegExp)[0]:r}e.appVersion=l;var r=n.default.APP.version;e.default=t.default.Helper.helper(l)}),define("manager-client/helpers/fmt-commit",["exports","ember"],function(e,t){var n=function(){function e(e,t){var n=[],a=!0,l=!1,r=void 0;try{for(var o,s=e[Symbol.iterator]();!(a=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);a=!0);}catch(e){l=!0,r=e}finally{try{!a&&s.return&&s.return()}finally{if(l)throw r}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();e.default=t.default.Helper.helper(function(e){var a=n(e,3),l=a[0],r=a[1],o=a[2];if(!t.default.isNone(r)){if(t.default.isNone(o))return new t.default.String.htmlSafe("(<a href='"+r+"'>"+l+"</a>)");var s=r.substr(0,r.search(/(\.git)?$/)),i=-1!==o.indexOf("/")?o.split("/")[1]:o;return new t.default.String.htmlSafe("(<a href='"+s+"/compare/"+l+"..."+i+"'>"+l+"</a>)")}})}),define("manager-client/helpers/is-after",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-after"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-before",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-before"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-between",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-between"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same-or-after",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same-or-after"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same-or-before",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same-or-before"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-add",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-add"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-calendar",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-calendar"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-duration",["exports","ember-moment/helpers/moment-duration"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-format",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-format"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-from-now",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-from-now"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-from",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-from"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-subtract",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-subtract"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to-date",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to-date"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to-now",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to-now"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"unix",{enumerable:!0,get:function(){return t.unix}})}),define("manager-client/helpers/moment",["exports","ember-moment/helpers/moment"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/now",["exports","ember-moment/helpers/now"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"unix",{enumerable:!0,get:function(){return t.unix}})}),define("manager-client/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","manager-client/config/environment"],function(e,t,n){var a=n.default.APP,l=a.name,r=a.version;e.default={name:"App Version",initialize:(0,t.default)(l,r)}}),define("manager-client/initializers/container-debug-adapter",["exports","ember-resolver/container-debug-adapter"],function(e,t){e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0];e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("manager-client/initializers/crsf-token",["exports","ember-ajax/request"],function(e,t){e.default={name:"findCsrfToken",initialize:function(){return(0,t.default)(Discourse.getURL("/session/csrf")).then(function(e){var t=e.csrf;$.ajaxPrefilter(function(e,n,a){e.crossDomain||a.setRequestHeader("X-CSRF-Token",t)})})}}}),define("manager-client/initializers/export-application-global",["exports","ember","manager-client/config/environment"],function(e,t,n){function a(){var e=arguments[1]||arguments[0];if(!1!==n.default.exportApplicationGlobal){var a;if("undefined"!=typeof window)a=window;else if("undefined"!=typeof global)a=global;else{if("undefined"==typeof self)return;a=self}var l,r=n.default.exportApplicationGlobal;l="string"==typeof r?r:t.default.String.classify(n.default.modulePrefix),a[l]||(a[l]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete a[l]}}))}}e.initialize=a,e.default={name:"export-application-global",initialize:a}}),define("manager-client/initializers/message-bus",["exports"],function(e){e.default={name:"message-bus",initialize:function(){MessageBus.baseUrl=Discourse.longPollingBaseUrl,"/"!==MessageBus.baseUrl?MessageBus.ajax=function(e){return e.headers=e.headers||{},e.headers["X-Shared-Session-Key"]=$("meta[name=shared_session_key]").attr("content"),$.ajax(e)}:MessageBus.baseUrl=Discourse.getURL("/")}}}),define("manager-client/models/process-list",["exports","ember-ajax/request","ember"],function(e,t,n){function a(){return l.create().refresh()}e.find=a;var l=n.default.Object.extend({output:null,refresh:function(){var e=this;return(0,t.default)(Discourse.getURL("/admin/docker/ps"),{dataType:"text"}).then(function(t){return e.set("output",t),e})}});e.default=l}),define("manager-client/models/repo",["exports","ember-ajax/request","ember"],function(e,t,n){function a(e){return e.map(function(e){return e.get("version")}).join(", ")}var l=[],r=n.default.Object.extend({unloaded:!0,checking:!1,checkingStatus:n.default.computed.or("unloaded","checking"),upToDate:function(){return!this.get("upgrading")&this.get("version")===this.get("latest.version")}.property("upgrading","version","latest.version"),shouldCheck:function(){if(n.default.isNone(this.get("version")))return!1;if(this.get("checking"))return!1;var e=this.get("lastCheckedAt");if(e){return(new Date).getTime()-e>6e4}return!0}.property().volatile(),repoAjax:function(e,n){return n=n||{},n.data=this.getProperties("path","version","branch"),(0,t.default)(Discourse.getURL(e),n)},findLatest:function(){var e=this;return new n.default.RSVP.Promise(function(t){if(!e.get("shouldCheck"))return e.set("unloaded",!1),t();e.set("checking",!0),e.repoAjax(Discourse.getURL("/admin/docker/latest")).then(function(a){e.setProperties({unloaded:!1,checking:!1,lastCheckedAt:(new Date).getTime(),latest:n.default.Object.create(a.latest)}),t()})})},findProgress:function(){return this.repoAjax(Discourse.getURL("/admin/docker/progress")).then(function(e){return e.progress})},resetUpgrade:function(){var e=this;return this.repoAjax(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"DELETE"}).then(function(){e.set("upgrading",!1)})},startUpgrade:function(){var e=this;return this.set("upgrading",!0),this.repoAjax(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"POST"}).catch(function(){e.set("upgrading",!1)})}});r.reopenClass({findAll:function(){return new n.default.RSVP.Promise(function(e){if(l.length)return e(l);(0,t.default)(Discourse.getURL("/admin/docker/repos")).then(function(t){l=t.repos.map(function(e){return r.create(e)}),e(l)})})},findUpgrading:function(){return this.findAll().then(function(e){return e.findBy("upgrading",!0)})},find:function(e){return this.findAll().then(function(t){return t.findBy("id",e)})},upgradeAll:function(){return(0,t.default)(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"POST",data:{path:"all"}})},resetAll:function(e){return(0,t.default)(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"DELETE",data:{path:"all",version:a(e)}})},findLatestAll:function(){return(0,t.default)(Discourse.getURL("/admin/docker/latest"),{dataType:"text",type:"GET",data:{path:"all"}})},findAllProgress:function(e){return(0,t.default)(Discourse.getURL("/admin/docker/progress"),{dataType:"text",type:"GET",data:{path:"all",version:a(e)}})}}),e.default=r}),define("manager-client/resolver",["exports","ember-resolver"],function(e,t){e.default=t.default}),define("manager-client/router",["exports","ember","manager-client/config/environment"],function(e,t,n){var a=t.default.Router.extend({location:n.default.locationType,rootURL:n.default.rootURL});a.map(function(){this.route("processes"),this.route("upgrade",{path:"/upgrade/:id"})}),e.default=a}),define("manager-client/routes/index",["exports","manager-client/models/repo","ember"],function(e,t,n){e.default=n.default.Route.extend({model:function(){return t.default.findAll()},loadRepos:function(e){var t=this;0!==e.length&&this.loadRepo(e.shift()).then(function(){return t.loadRepos(e)})},loadRepo:function(e){return e.findLatest()},setupController:function(e,t){var n=this.controllerFor("application");e.setProperties({model:t,upgrading:null}),window.Discourse&&window.Discourse.hasLatestPngcrush||n.appendBannerHtml("<b>WARNING:</b> You are running an old Docker image, <a href='https://meta.discourse.org/t/how-do-i-update-my-docker-image-to-latest/23325'>please upgrade</a>."),t.forEach(function(t){t.get("upgrading")&&e.set("upgrading",t),"docker_manager"===t.get("id")&&e.set("managerRepo",t),"discourse"===t.get("id")&&"origin/master"===t.get("branch")&&n.appendBannerHtml("<b>WARNING:</b> Your Discourse is tracking the 'master' branch which may be unstable, <a href='https://meta.discourse.org/t/change-tracking-branch-for-your-discourse-instance/17014'>we recommend tracking the 'tests-passed' branch</a>.")}),this.loadRepos(t.slice(0))},actions:{upgrade:function(e){this.transitionTo("upgrade",e)}}})}),define("manager-client/routes/processes",["exports","manager-client/models/process-list","ember"],function(e,t,n){e.default=n.default.Route.extend({model:t.find})}),define("manager-client/routes/upgrade",["exports","manager-client/models/repo","ember"],function(e,t,n){e.default=n.default.Route.extend({model:function(e){return"all"===e.id?t.default.findAll():t.default.find(e.id)},afterModel:function(e){var a=this;return Array.isArray(e)?t.default.findLatestAll().then(function(l){return JSON.parse(l).repos.forEach(function(t){var a=e.find(function(e){return e.get("path")===t.path});a&&(delete t.path,a.set("latest",n.default.Object.create(t)))}),t.default.findAllProgress(e.filter(function(e){return!e.get("upToDate")})).then(function(e){a.set("progress",JSON.parse(e).progress)})}):t.default.findUpgrading().then(function(t){return t&&t!==e?n.default.RSVP.Promise.reject("wat"):e.findLatest().then(function(){return e.findProgress().then(function(e){a.set("progress",e)})})})},setupController:function(e,t){e.reset(),e.setProperties({model:Array.isArray(t)?t:[t],output:this.get("progress.logs"),percent:this.get("progress.percentage")}),e.startBus()},deactivate:function(){this.controllerFor("upgrade").stopBus()}})}),define("manager-client/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/services/moment",["exports","ember","manager-client/config/environment","ember-moment/services/moment"],function(e,t,n,a){e.default=a.default.extend({defaultFormat:t.default.get(n.default,"moment.outputFormat")})}),define("manager-client/templates/application",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"0yD/7qqw",block:'{"statements":[["open-element","div",[]],["static-attr","class","container"],["flush-element"],["text","\\n  "],["open-element","div",[]],["static-attr","class","back-site"],["flush-element"],["text","\\n    "],["open-element","a",[]],["dynamic-attr","href",["unknown",["returnToSiteUrl"]],null],["flush-element"],["text","Return to site"],["close-element"],["text","\\n  "],["close-element"],["text","\\n\\n  "],["open-element","header",[]],["static-attr","class","container"],["flush-element"],["text","\\n    "],["block",["link-to"],["index"],null,7],["text","\\n    "],["open-element","h1",[]],["flush-element"],["block",["link-to"],["index"],null,6],["close-element"],["text","\\n  "],["close-element"],["text","\\n\\n  "],["open-element","div",[]],["static-attr","class","container"],["flush-element"],["text","\\n\\n"],["block",["if"],[["get",["showBanner"]]],null,5],["text","\\n    "],["open-element","ul",[]],["static-attr","class","nav nav-tabs"],["flush-element"],["text","\\n"],["block",["link-to"],["index"],[["tagName","class"],["li","nav-item"]],3],["block",["link-to"],["processes"],[["tagName","class"],["li","nav-item"]],1],["text","\\n      "],["open-element","li",[]],["static-attr","class","nav-item"],["flush-element"],["open-element","a",[]],["static-attr","class","nav-link"],["dynamic-attr","href",["unknown",["backupsUrl"]],null],["flush-element"],["text","Backups"],["close-element"],["close-element"],["text","\\n    "],["close-element"],["text","\\n\\n    "],["append",["unknown",["outlet"]],false],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","Processes"]],"locals":[]},{"statements":[["text","        "],["block",["link-to"],["processes"],[["class"],["nav-link"]],0],["text","\\n"]],"locals":[]},{"statements":[["text","Versions"]],"locals":[]},{"statements":[["text","        "],["block",["link-to"],["index"],[["class"],["nav-link"]],2],["text","\\n"]],"locals":[]},{"statements":[["text","            "],["open-element","p",[]],["flush-element"],["append",["get",["row"]],true],["close-element"],["text","\\n"]],"locals":["row"]},{"statements":[["text","      "],["open-element","div",[]],["static-attr","id","banner"],["flush-element"],["text","\\n        "],["open-element","div",[]],["static-attr","id","banner-content"],["flush-element"],["text","\\n          "],["open-element","div",[]],["static-attr","class","close"],["modifier",["action"],[["get",[null]],"dismiss"]],["flush-element"],["open-element","i",[]],["static-attr","class","fa fa-times"],["static-attr","title","Dismiss this banner."],["flush-element"],["close-element"],["close-element"],["text","\\n"],["block",["each"],[["get",["banner"]]],null,4],["text","        "],["close-element"],["text","\\n      "],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","Upgrade"]],"locals":[]},{"statements":[["open-element","img",[]],["dynamic-attr","src",["unknown",["logoUrl"]],null],["static-attr","class","logo"],["flush-element"],["close-element"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/application.hbs"}})}),define("manager-client/templates/components/progress-bar",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"UHd2N8I3",block:'{"statements":[["open-element","div",[]],["static-attr","class","progress-bar progress-bar-striped progress-bar-animated"],["dynamic-attr","style",["unknown",["barStyle"]],null],["flush-element"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/progress-bar.hbs"}})}),define("manager-client/templates/components/repo-status",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"bRSmGmAO",block:'{"statements":[["open-element","td",[]],["flush-element"],["text","\\n"],["block",["if"],[["get",["repo","official"]]],null,8],["close-element"],["text","\\n"],["open-element","td",[]],["flush-element"],["text","\\n  "],["append",["unknown",["repo","name"]],false],["text","\\n  "],["append",["helper",["fmt-commit"],[["get",["repo","version"]],["get",["repo","url"]],["get",["repo","branch"]]],null],false],["text","\\n"],["close-element"],["text","\\n"],["open-element","td",[]],["flush-element"],["text","\\n"],["block",["if"],[["get",["repo","checkingStatus"]]],null,7,6],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","        "],["open-element","button",[]],["static-attr","class","btn"],["dynamic-attr","disabled",["unknown",["upgradeDisabled"]],null],["modifier",["action"],[["get",[null]],"upgrade"]],["flush-element"],["text","Upgrade"],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","        "],["open-element","button",[]],["static-attr","class","btn"],["modifier",["action"],[["get",[null]],"upgrade"]],["flush-element"],["text","Currently Upgrading..."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","            —\\n"]],"locals":[]},{"statements":[["text","            "],["append",["helper",["moment-from-now"],[["get",["repo","latest","date"]]],[["interval"],[1000]]],false],["text","\\n"]],"locals":[]},{"statements":[["text","    "],["open-element","div",[]],["static-attr","class","new-version"],["flush-element"],["text","\\n      "],["open-element","h4",[]],["flush-element"],["text","New Version Available!"],["close-element"],["text","\\n      "],["open-element","ul",[]],["flush-element"],["text","\\n        "],["open-element","li",[]],["flush-element"],["text","Remote Version: "],["append",["helper",["fmt-commit"],[["get",["repo","latest","version"]],["get",["repo","url"]],["get",["repo","branch"]]],null],false],["close-element"],["text","\\n        "],["open-element","li",[]],["flush-element"],["text","Last Updated:\\n"],["block",["if"],[["get",["repo","latest","date"]]],null,3,2],["text","        "],["close-element"],["text","\\n        "],["open-element","li",[]],["static-attr","class","new-commits"],["flush-element"],["append",["unknown",["repo","latest","commits_behind"]],false],["text"," new commits"],["close-element"],["text","\\n      "],["close-element"],["text","\\n"],["block",["if"],[["get",["repo","upgrading"]]],null,1,0],["text","    "],["close-element"],["text","\\n  "]],"locals":[]},{"statements":[["text","    Up to date\\n"]],"locals":[]},{"statements":[["block",["if"],[["get",["repo","upToDate"]]],null,5,4]],"locals":[]},{"statements":[["text","    Checking for new version...\\n"]],"locals":[]},{"statements":[["text","    "],["open-element","img",[]],["static-attr","class","check-circle"],["dynamic-attr","src",["unknown",["officialRepoImageSrc"]],null],["static-attr","alt","Official Plugin"],["static-attr","title","Official Plugin"],["flush-element"],["close-element"],["text","\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/repo-status.hbs"}})}),define("manager-client/templates/components/x-console",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"pAvT7OSR",block:'{"statements":[["append",["unknown",["output"]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/x-console.hbs"}})}),define("manager-client/templates/index",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"vKJbpdZ5",block:'{"statements":[["open-element","button",[]],["dynamic-attr","disabled",["unknown",["upgradeAllButtonDisabled"]],null],["static-attr","id","upgrade-all"],["static-attr","class","btn"],["modifier",["action"],[["get",[null]],"upgradeAllButton"]],["flush-element"],["text","\\n"],["block",["if"],[["get",["allUpToDate"]]],null,2,1],["close-element"],["text","\\n\\n"],["open-element","table",[]],["static-attr","class","table"],["static-attr","id","repos"],["flush-element"],["text","\\n  "],["open-element","tr",[]],["flush-element"],["text","\\n    "],["open-element","th",[]],["flush-element"],["close-element"],["text","\\n    "],["open-element","th",[]],["static-attr","style","width: 50%"],["flush-element"],["text","Repository"],["close-element"],["text","\\n    "],["open-element","th",[]],["flush-element"],["text","Status"],["close-element"],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","tbody",[]],["flush-element"],["text","\\n"],["block",["each"],[["get",["model"]]],null,0],["text","  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      "],["append",["helper",["repo-status"],null,[["repo","upgradingRepo","managerRepo","upgrade"],[["get",["repo"]],["get",["upgrading"]],["get",["managerRepo"]],"upgrade"]]],false],["text","\\n"]],"locals":["repo"]},{"statements":[["text","    Upgrade All\\n"]],"locals":[]},{"statements":[["text","    All Up-to-date\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/index.hbs"}})}),define("manager-client/templates/loading",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"KVS2Qgkh",block:'{"statements":[["open-element","h3",[]],["static-attr","class","loading"],["flush-element"],["text","Loading..."],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/loading.hbs"}})}),define("manager-client/templates/processes",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"oTRdyLm0",block:'{"statements":[["append",["helper",["x-console"],null,[["output"],[["get",["model","output"]]]]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/processes.hbs"}})}),define("manager-client/templates/upgrade",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"rDtPoogA",
block:'{"statements":[["open-element","h3",[]],["flush-element"],["text","Upgrade "],["append",["unknown",["title"]],false],["close-element"],["text","\\n\\n"],["append",["helper",["progress-bar"],null,[["percent"],[["get",["percent"]]]]],false],["text","\\n\\n"],["block",["if"],[["get",["complete"]]],null,6],["text","\\n"],["block",["if"],[["get",["failed"]]],null,5],["text","\\n"],["block",["if"],[["get",["isUpToDate"]]],null,4,1],["text","\\n"],["append",["helper",["x-console"],null,[["output","followOutput"],[["get",["output"]],true]]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      "],["open-element","button",[]],["static-attr","class","btn unlock"],["modifier",["action"],[["get",[null]],"resetUpgrade"]],["flush-element"],["text","Reset Upgrade"],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","div",[]],["static-attr","style","clear: both"],["flush-element"],["text","\\n    "],["open-element","button",[]],["dynamic-attr","disabled",["unknown",["upgrading"]],null],["static-attr","class","btn"],["modifier",["action"],[["get",[null]],"start"]],["flush-element"],["append",["unknown",["upgradeButtonText"]],false],["close-element"],["text","\\n"],["block",["if"],[["get",["upgrading"]]],null,0],["text","  "],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","    "],["open-element","p",[]],["flush-element"],["text","Everything is up-to-date."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","    "],["open-element","p",[]],["flush-element"],["append",["unknown",["title"]],false],["text"," is at the newest version "],["append",["helper",["fmt-commit"],[["get",["model","0","version"]],["get",["model","0","url"]],["get",["model","0","branch"]]],null],false],["text","."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["block",["unless"],[["get",["multiUpgrade"]]],null,3,2]],"locals":[]},{"statements":[["text","  "],["open-element","p",[]],["flush-element"],["text","Sorry, there was an error upgrading Discourse. Please check the logs below."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","p",[]],["flush-element"],["text","Upgrade completed successfully!"],["close-element"],["text","\\n  "],["open-element","p",[]],["flush-element"],["text","Note: The web server restarts in the background. It\'s a good idea to wait 30 seconds or so\\n     before refreshing your browser to see the latest version of the application."],["close-element"],["text","\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/upgrade.hbs"}})}),define("manager-client/config/environment",["ember"],function(e){try{var t="manager-client/config/environment",n=document.querySelector('meta[name="'+t+'"]').getAttribute("content"),a=JSON.parse(unescape(n)),l={default:a};return Object.defineProperty(l,"__esModule",{value:!0}),l}catch(e){throw new Error('Could not read config from meta tag with name "'+t+'".')}}),runningTests||require("manager-client/app").default.create({name:"manager-client",version:"0.0.0+59a82983"});
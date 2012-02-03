// MIT License, see https://github.com/kayakyakr/sungani-js




(function(){
  try{
    Sungani;
  }
  catch(e){
    Sungani = {};
  }
})()
;
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/


(function(){
  MicroEvent	= function(){}
  
  var define_events = function(){
    if(!this._events){
      Object.defineProperty(this, '_events', {value: {}, enumerable: false, configurable: false});
    }
  }
  MicroEvent.prototype	= {
  	bind	: function(event, fct){
  	  define_events.call(this);
  		this._events[event] = this._events[event]	|| [];
  		this._events[event].push(fct);
  	},
  	unbind	: function(event, fct){
      define_events.call(this);
  		if( event in this._events === false  )	return;
  		this._events[event].splice(this._events[event].indexOf(fct), 1);
  	},
  	trigger	: function(event /* , args... */){
      define_events.call(this);
  		if( event in this._events === false  )	return;
  		for(var i = 0; i < this._events[event].length; i++){
  			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
  		}
  	}
  };
  
  /**
   * mixin will delegate all MicroEvent.js function in the destination object
   *
   * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
   *
   * @param {Object} the object which will support MicroEvent
  */
  MicroEvent.mixin	= function(destObject){
  	var props	= ['bind', 'unbind', 'trigger'];
  	for(var i = 0; i < props.length; i ++){
  		Object.defineProperty(destObject.prototype, props[i], {
  		  value: MicroEvent.prototype[props[i]],
  		  enumerable: false,
  		  configurable: false
  		});
  	}
  }
  
  // export in common js
  if( typeof module !== "undefined" && ('exports' in module)){
  	module.exports	= MicroEvent
  }
})();

(function(){
var game = function(config){}

Object.defineProperties(game.prototype, {
  load_matches: {
    value: function(cb){
      $.ajax({
        method: 'GET',
        url: '/matches',
        dataType: 'json',
        success: function(data, status, xhr){
          this.matches = data;
          cb();
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  matches: {
    value: [],
    enumerable: true
  },
  load: {
    value: function(id, cb){
      $.ajax({
        method: 'GET',
        url: '/games/' + id,
        dataType: 'json',
        success: function(data, status, xhr){
          Object.apply(this, data);
          if(cb){
            cb();
          }
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  list: {
    value: function(cb){
      $.ajax({
        method: 'GET',
        url: '/games',
        dataType: 'json',
        success: function(data, status, xhr){
          cb(data);
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  }
});

Sungani.Game = new game();
})();


(function(){
var match = function(config){}
var timer_id = null;

// make this an emmitter
MicroEvent.mixin(match);

Object.defineProperties(match.prototype, {
  load: {
    value: function(id){
      var opts = {
        type: 'GET',
        url: '/matches/' + id,
        dataType: 'json',
        success: function(data, status, xhr){
          if(data.updated_at && data.updated_at === this.updated_at){
            // nothing changed
            return;
          }
          Object.apply(this, data);
          this.trigger('load');
        }.bind(this)
      };
      
      if(this.updated_at){
        opts['data'] = opts['data'] || {};
        opts['data']['updated_at'] = this.updated_at;
      }
      
      $.ajax(opts);
    },
    enumerable: false,
    writeable: false,
    configurable: false
  },
  refresh: {
    value: function(){
      this.load(this.id);
    },
    enumerable: false,
    writaeable: false,
    configurable: false
  },
  save: {
    value: function(){
      $.ajax({
        type: 'PUT',
        url: '/matches/' + this.id,
        dataType: 'json',
        data: {
          match: JSON.stringify(this)
        },
        success: function(data, status, xhr){
          Object.apply(this, data);
          this.trigger('save');
          this.trigger('load');
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  create: {
    value: function(game_id, users){
      $.ajax({
        type: 'POST',
        url: '/matches',
        dataType: 'json',
        data: {
          game_id: game_id,
          users: users
        },
        success: function(data, status, xhr){
          Object.apply(this, data);
          this.trigger('create');
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  start_polling: {
    value: function(){
      if(timer_id){
        // it's already running, don't need to do anything
        return;
      }
      timer_id = setInterval(function(){
        this.refresh();
      }.bind(this), 15000);
    },
    writeable: false,
    configurable: false
  },
  stop_polling: {
    value: function(){
      clearInterval(timer_id);
      timer_id = null
    },
    writeable: false,
    configurable: false
  }
});

Sungani.Match = new match();
})();

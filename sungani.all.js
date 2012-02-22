// MIT License, see https://github.com/kayakyakr/sungani-js





(function(){
  try{
    Sungani;
  }
  catch(e){
    Sungani = {url: 'http://www.sungani.com'};
  }
  
  Object.defineProperties(Sungani, {
    ajax: {
      /**
       * wrapper to do ajax requests. for now wrap jquery. later do it library-less
       * @params opts     [Object]   Options for jquery request
       * @opts   url      String     URL to send the request to
       * @opts   method   [String]   Method to use to send the reqeust. Default: 'GET'
       * @opts   scope    [Object]   The scope that the response will be called in
       * @opts   success  [Function] Called on success
       * @opts   failure  [Function] Called on failure
       * @opts   callback [Function] Called on success or failure
       * @opts   params   [Object]   The parameters for the ajax call
       */
      value: function(opts){
        // build options hash        
        var option_hash = {
          url: opts['url'],
          type: opts['method'] || 'GET',
          dataType: 'json',
          headers: {
            'X-AUTH-TOKEN': Sungani.User.authentication_token || (localStorage && localStorage.getItem('sungani_authentication_token'))
          }
        };
        
        if(opts['scope']){
          option_hash['context'] = opts['scope'];
        }
        if(opts['success']){
          option_hash['success'] = opts['success'];
        }
        if(opts['failure']){
          option_hash['error'] = opts['failure'];
        }
        if(opts['callback']){
          option_hash['complete'] = opts['callback'];
        }
        if(opts['params']){
          option_hash['data'] = opts['params'];
        }
        
        $.ajax(option_hash);
      }
    }
  });
})();
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
Object.apply = function(obj, cfg){
  for(var i in cfg){
    obj[i] = cfg[i];
  }
}

Object.applyIf = function(obj, cfg){
  for(var i in cfg){
    if(obj[i] === undefined){
      obj[i] = cfg[i];
    }
  }
}

Array.prototype.shuffle = function() {
    var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }

    return this;
}
;

(function(){
var game = function(config){}

MicroEvent.mixin(game);

Object.defineProperties(game.prototype, {
  load: {
    value: function(){
      Sungani.ajax({
        method: 'GET',
        url: Sungani.url + '/games/' + Sungani.Game.id,
        success: function(data, status, xhr){
          Object.apply(this, data);
          this.trigger('load')
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
        method: 'GET',
        url: Sungani.url + '/matches/' + id,
        scope: this,
        success: function(data, status, xhr){
          if(data.updated_at && data.updated_at === this.updated_at){
            // nothing changed
            return;
          }
          Object.apply(this, data);
          this.trigger('load');
        }
      };
      
      if(id === this.id && this.updated_at){
        opts['params'] = opts['params'] || {};
        opts['params']['updated_at'] = this.updated_at;
      }
      this.updated_at = null;
      
      Sungani.ajax(opts);
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
      Sungani.ajax({
        method: 'PUT',
        url: Sungani.url + '/matches/' + this.id,
        scope: this,
        params: {
          match: JSON.stringify(this)
        },
        success: function(data, status, xhr){
          Object.apply(this, data);
          this.trigger('save');
          this.trigger('load');
        }
      });
    },
    writeable: false,
    configurable: false
  },
  create: {
    value: function(users){
      Sungani.ajax({
        method: 'POST',
        url: Sungani.url + '/matches',
        params: {
          game_id: Sungani.Game.id,
          users: users
        },
        scope: this,
        success: function(data, status, xhr){
          Object.apply(this, data);
          this.trigger('create');
        },
        failure: function(xhr, status, error){
          try{
            var resp = JSON.parse(xhr.responseText);
            this.trigger('create_error', resp);
          }
          catch(e){
          }
        }
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


(function(){
var user = function(config){}

MicroEvent.mixin(user);

Object.defineProperties(user.prototype, {
  signIn: {
    value: function(user, pass){
      Sungani.ajax({
        method: 'POST',
        url: Sungani.url + '/users/sign_in.json',
        params: {
          'user[email]': user,
          'user[password]': pass
        },
        scope: this,
        success: function(data, status, xhr){
          this.id = data.id;
          this.name = data.name;
          this.authentication_token = data.authentication_token;
          
          if(localStorage){
            localStorage.setItem('sungani_authentication_token', data.authentication_token)
          }
          
          this.trigger('signedin');
        },
        failure: function(){
          this.id = null;
        }
      });
    }
  },
  
  signOut: {
    value: function(){
      Sungani.ajax({
        method: 'GET',
        url: Sungani.url + '/users/sign_out.json',
        scope: this,
        success: function(data, status, xhr){
          this.id = null;
          this.name = null;
          this.authentication_token = null;
          
          if(localStorage){
            localStorage.setItem('sungani_authentication_token', null)
          }
          
          this.trigger('signedout');
        }
      });
    }
  },
  
  checkSignedIn: {
    value: function(){
      Sungani.ajax({
        method: 'GET',
        url: Sungani.url + '/users/signed_in.json',
        scope: this,
        success: function(data, status, xhr){
          if(data.signed_in){
            this.id = data.id;
            this.name = data.name;
            this.authentication_token = data.authentication_token;
            
            if(localStorage){
              localStorage.setItem('sungani_authentication_token', data.authentication_token);
            }
            
            this.trigger('signedin');
          }
          else{
            this.id = null;
            this.name = null;
            this.authentication_token = null;
            if(localStorage){
              localStorage.setItem('sungani_authentication_token', null)
            }
            this.trigger('signedout');
          }
        }
      });
    }
  },
  
  isSignedIn: {
    value: function(){
      if(this.id !== undefined && this.id !== null){
        return true;
      }
      else{
        if(localStorage){
          var auth_token;
          if(auth_token = localStorage.getItem('sungani_authentication_token')){
            Sungani.User.authentication_token = auth_token;
            this.checkSignedIn();
            return true;
          }
        }
        return false;
      }
    }
  },
  
  index: {
    value: function(){
      Sungani.ajax({
        method: 'GET',
        url: Sungani.url + '/users.json',
        scope: this,
        success: function(data, status, xhr){
          this.trigger('index', data);
        }
      })
    }
  }
});

Sungani.User = new user();
})();

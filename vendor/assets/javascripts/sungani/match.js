

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

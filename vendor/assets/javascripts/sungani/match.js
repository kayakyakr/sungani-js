

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
          Object.applyValues(this, data);
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
          Object.applyValues(this, data);
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
          Object.applyValues(this, data);
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
  destroy: {
    value: function(id){
      if(!id){
        id = this.id;
      }
      Sungani.ajax({
        method: 'DELETE',
        url: Sungani.url + '/matches/' + id
      });
    },
    writeable: false,
    configurable: false
  },
  unload: {
    value: function(){
      this.id = null;
    }
  },
  update: {
    value: function(json){
      if(json.id == this.id){
        Object.applyValues(this, json);
        this.trigger('update', json);
      }
      else{
        this.trigger('other_update', json);
      }
    },
    writeable: false,
    configurable: false
  }
});

Sungani.Match = new match();
})();

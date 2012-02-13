

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
        url: Sungani.url + '/matches/' + id,
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
        url: Sungani.url + '/matches/' + this.id,
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
        url: Sungani.url + '/matches',
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

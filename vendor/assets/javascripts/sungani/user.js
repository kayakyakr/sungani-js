

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

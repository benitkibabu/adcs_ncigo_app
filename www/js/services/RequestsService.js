angular.module('starter')
.service('MyDeviceID', 
    function MyDeviceID($localstorage){
        function store(device_token){
            return $localstorage.set('device_id', device_token);
        }
        function getDeviceId(){
            return $localstorage.get('device_id', 'null')
        }
        return{
            store : store,
            getDeviceId : getDeviceId
        }
    }
)
.service('LoginStatus', 
    function LoginStatus($localstorage){
        function setLogin(value){
            return $localstorage.set('isLoggedIn', value);
        }
        function isLoggedIn(){
           return $localstorage.get('isLoggedIn', 'false');
        }

        return{
            isLoggedIn : isLoggedIn,
            setLogin : setLogin
        };
    }
)
.service('SaveSettings', 
    function LoginStatus($localstorage){
        function setPref(value){
            return $localstorage.setObject('pref', value);
        }
        function getPref(){
           return $localstorage.getObject('pref');
        }

        return{
            setPref : setPref,
            getPref : getPref
        };
    }
)
.service('SaveReminder', 
    function LoginStatus($localstorage){
        function setReminder(value){
            return $localstorage.setObject('reminder', value);
        }
        function getReminder(){
           return $localstorage.getObject('reminder');
        }
        function remove(item){
            if($localstorage.removeItem(item)){
                return true;
            }else return false;
        }

        return{
            setReminder : setReminder,
            getReminder : getReminder,
            remove : remove
        };
    }
);
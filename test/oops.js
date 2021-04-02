/* 
------------------------------------------
  Oops.js, By : Pedro José Manuel, 2021
  www.github.com/pedro-jmanuel/oops
------------------------------------------
*/

function Oops(configuration){

    var thisOops = this;

    var variables = {
        defaultConfig : {
            storage : "localStorage",
            key     : "oops_key"
        },
        config : {}
    };

    var methods = {

        isUndefined: function(v) {
            return v === undefined || v === null;
        },
        isDefined : function(v) {
            return v !== undefined && v !== null;
        },
        def: function(obj, key, val, enumerable) {
            Object.defineProperty(obj, key, {
              value: val,
              enumerable: !!enumerable,
              writable: true,
              configurable: true
            });
        },
        merge: function(userConfig){
    
            var newConfig = {};
    
            for (var property in variables.defaultConfig) {
                if (variables.defaultConfig.hasOwnProperty(property)) {
                    if(userConfig.hasOwnProperty(property)){
                        methods.def(newConfig,property,userConfig[property],true);
                    }else{
                        methods.def(newConfig,property,variables.defaultConfig[property],true);
                    }      
                }
            }
            return newConfig;
        },
        
        //Function that detects whether localStorage is both supported and available:
        // Read more, https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
        storageAvailable: function(type) {
            var storage;
            try {
                storage = window[type];
                var x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch(e) {
                return e instanceof DOMException && (
                    // Everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // Test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // Acknowledge QuotaExceededError only if there's something already stored
                    (storage && storage.length !== 0);
            }
        },
        storageSetItems: function(items){
            switch(variables.config.storage){
                case "localStorage"  : localStorage.setItem(variables.config.key,JSON.stringify(items));break;
                case "sessionStorage": sessionStorage.setItem(variables.config.key,JSON.stringify(items));break;
            }
        },
        storageGetItems:  function(){
            switch(variables.config.storage){
                case "localStorage"  :return JSON.parse(localStorage.getItem(variables.config.key));
                case "sessionStorage":return JSON.parse(sessionStorage.getItem(variables.config.key));    
            }
        },
        isset: function(){
            return (methods.isDefined(sessionStorage.getItem(variables.config.key)) ||
                    methods.isDefined(localStorage.getItem(variables.config.key)));
        },
        prepare: function (elements){

            var  elValues = {};
    
            elements.forEach(function(val,key){   
                if( "type" in val ){
                    methods.def(elValues,key,val.value,true);
                }   
            });

            methods.def(elValues,"selected",elements.length,true);
           /* 
            The "selected" property stores total selected elements with data-oops attribute,
            to be used in the detention in the DOM change. Considering that the trace is
            done from the position of the element in the DOM. 
            */
            return elValues;
       },
       noError: function(stg){
            if(stg == "localStorage" || stg == "sessionStorage" ){
                if(methods.storageAvailable(stg)){
                   return true;
                }else{
                    console.warn("oops.js warn: "+ stg + " is not available.");
                    return false;
                } 
            }else{
                console.error("oops.js error: The \"storage\" property can only be \"localStorage\" or \"sessionStorage\", check your configuration parameter.");
                return false;
            }
       },
        track: function(){
            
            var elements = document.querySelectorAll("[data-oops]");

            elements.forEach(function(el){
                 var useOnInput = ["text","textarea","url","search","number"];
         
                 if( "type" in el ){
                     if( useOnInput.indexOf(el.type) != -1  ){
                         el.addEventListener("input",function(){
                             formValues =  methods.prepare(elements);
                             methods.storageSetItems(formValues);
                         });
                     }else if(el.type == "number" ){
                         el.addEventListener("change",function(){
                             formValues =  methods.prepare(elements);
                             methods.storageSetItems(formValues);
                         });
                     }else{
                         el.addEventListener("change",function(){
                             formValues =  methods.prepare(elements);
                             methods.storageSetItems(formValues);      
                         });
                     }
                 }
                 
            });         
        },
        fill: function(){

            var elements = document.querySelectorAll("[data-oops]");

            var formValues = methods.storageGetItems();

            if(elements.length != formValues.selected){
                /*
                  Verify that there has been a change in the DOM for
                  elements with data-oops attributes. If there is a change we will 
                  clean the stored data , if we do not clean there will be conflict 
                  when filling the form. 
                */ 
                thisOops.clear();               
            }else{  
                elements.forEach(function(el,key){
                    if(("type" in el) && (key in formValues)){
                        el.value = formValues[key];                       
                    }
                });
            }
        }
    };
 
    variables.config = (methods.isUndefined(configuration))? variables.defaultConfig : methods.merge(configuration);

    this.start = function(){
        stg = variables.config.storage;
        if(methods.noError(stg)){
            if(methods.isset()){    
                methods.fill();
                methods.track();
            }else{
                methods.track();
            }
        }
    };

    this.clear = function(){
        stg = variables.config.storage;
        if(methods.noError(stg)){
            switch(variables.config.storage){
                case "localStorage"  :localStorage.removeItem(variables.config.key);break;
                case "sessionStorage":sessionStorage.removeItem(variables.config.key);break;    
            }
        }
    };
}
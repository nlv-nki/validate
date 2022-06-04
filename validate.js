let checks = {
    result : true,
    errors : [],
    push_err: ({...error_data}) =>{
        if (isObject(error_data.field_data)) error_data.field_data = undefined;
        checks.result = false;
        checks.errors.push({'field':error_data.field_name,'value':error_data.field_data, 'error' : error_data.rule_name});
        return checks.notify ({...error_data}, 'error')
    },

    notify: ({...notify_data}, type) => {
        let result;
        if (type === 'error') {
            result =  { "result": false, "errors" : [{value: notify_data.field_data,field: notify_data.field_name,rule:notify_data.rule_name}]}
        }

        if (type === 'no_error') {
            result = { result: true, errors: [] }
        }
        
        return result;
      },

    required : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
        if((rule_value)) {
            if (isObject(field_data) || (field_data === null) || (field_data === undefined) ) {
                result =    checks.push_err({rule_name,field_name,field_data});
            }            
        }   
        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
    },

      
    maxLength : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
        if  (typeof field_data === 'number') {
            result =  checks.push_err({rule_name,field_name,field_data});
            }
     
        if (field_data.length > rule_value ) {
            result = checks.push_err({rule_name,field_name,field_data});
        }
        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
    },

    minLength :({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
      
        if  (typeof field_data === 'number') {
        result =  checks.push_err({rule_name,field_name,field_data});
        }

        if (field_data.length < rule_value ) {   
          result =  checks.push_err({rule_name,field_name,field_data});
        }

        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
        
    },
    

    min : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
        if (field_data < rule_value || isNaN(field_data)) {
            result = checks.push_err({rule_name,field_name,field_data});
        }

        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
      
    },
    
    max : ({rule_name,field_name,rule_value,field_data}) => {

        let result = true;
        if (field_data > rule_value || isNaN(field_data)) {
            result = checks.push_err({rule_name,field_name,field_data});
        }
        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
    },

  isString : ({rule_name,field_name,rule_value,field_data}) => {
    let result = true;
        if (rule_value) {
            if (typeof field_data !== 'string' && field_data !== null) {
                checkError(field_name)
                result =  checks.push_err({rule_name, field_name, field_data });
            }
        }
        if(result == true) return  checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;
  },


    isEmail : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
           if(rule_value) {
            if ( 
                 (field_data.length < 3) ||
                 ( field_data.indexOf('@') == -1 ) ||
                 ( field_data.slice(field_data.indexOf('@')+1) == '' )  ) {
                result = checks.push_err({rule_name, field_name, field_data });
            }
        }
        if(result == true) return checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;

    },

    isBoolean : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
        if(rule_value) {
            if(typeof field_data !== "boolean") {
                result = checks.push_err({rule_name, field_name, field_data });
            }
        }
        if(result == true) return checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;

    },

    isNumber : ({rule_name,field_name,rule_value,field_data}) => {
        let result = true;
        if(rule_value) {
            if (isNaN(field_data) || typeof field_data !== 'number') {
                result = checks.push_err({rule_name, field_name, field_data });
            }
        }
        if(result == true) return checks.notify ({rule_name,field_name,field_data}, 'no_error');
        else return result;

    }
    
}

function checkError (field_name) {
    checks.errors.forEach((error,index) => {
        if ( error.field == field_name) {
            checks.errors.splice(index, 1)
        }    
    })
}



function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
  }



function validate(data, rules) {
    let results = {};
    let holder = {};
        holder.result = true;
        holder.errors = [];
    if (Object.getOwnPropertyNames(rules).length === 0 ||
        Object.getOwnPropertyNames(Object.values(rules)[0]).length === 0 ) {
            return checks.notify({},'no_error');
    }
    
    if (rules) {
        Object.keys(rules).forEach(field => {
            let options = {
                rule_name : undefined,
                rule_value : undefined,
                field_name : undefined,
                field_data :undefined,
                }     
            if (data.hasOwnProperty(field)) {
                Object.entries(rules[field]).forEach(rule => {
                 options = {
                    rule_name : rule[0],
                    rule_value : rule[1],
                    field_name : field,
                    field_data : data[field]
                    }   
                    results[options.rule_name] =  checks[options.rule_name](options);
                })
            }

            if (Object.getOwnPropertyNames(data).length === 0) {
                Object.entries(rules[field]).forEach(rule => {
                    if (rule[0] === 'required') {
                        options = {
                            rule_name : rule[0],
                            rule_value : rule[1],
                            field_name : field,
                            field_data : undefined,
                            }   
                            results[options.rule_name] =  checks.push_err({...options}) 
                        }

                    else {
                        holder =  checks.notify({},'no_error')
                    }
            
                })
            }

        })   
    }   

    Object.values(results).forEach(item => {
        if (item.result == false) {
            holder.result = item.result;
            holder.errors.push(item.errors[0]);
        }
        if (holder.result !== false) {
          holder.errors = [];
          holder.result = true;
        }

    })


return holder;
      
}


var rules = {
     name: { required: true, minLength: 4, maxLength: 4},
     name: { isString: true} ,
     age: { min: 10, max: 16, isNumber: true  },

  }
var data = {
    name : 'Alex',
    age: 10,
    profession: 'arh',
    
};


 console.log(validate(data, rules)); 
 

module.exports = validate;


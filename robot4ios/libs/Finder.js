#import "Assert.js"
#import "Tools.js"
#import "Waiter.js"

var Finder = {

findElementByName: function(name,parent){
    Waiter.wait(1)
    return this.findElement_By_name(name,parent)
},

findElementByValue: function(name,parent){
    Waiter.wait(1)
    return this.findElement_By_value(name,parent)
},

findListChild: function(tableName,item,group){
    Waiter.wait(1)
    var table  = Finder.findElement_By_name(tableName);
    var grp;
    if( item<0 ){
        grp = table.groups()[group];
    }else if ( (group==null) && (item>=0)){
        grp = table.cells()[item];
    }else{
        grp = table.groups()[group].cells()[item];
    }
    table.scrollToElementWithName(grp.name());
    return grp;
},

findElement_By_name: function(name, parent){
    var start = (new Date()).getTime();	
	if (!parent) {
		parent = UIATarget.localTarget().frontMostApp();
	}
        var timeout = UIATarget.localTarget().timeout();
	var result;
	while (((new Date()).getTime() - start) < (timeout * 1000) || timeout == 0) {
		result = this._searchElements(parent, name, "name");
		if (!this.isNil(result)) {
            if(!inScreen(result)){
                result.scrollToVisible();
           }
            return result;		   
		}
	}
	//UIALogger.logFail("Unable to find element named " + name);
    //    Assert.fail("Unable to find element named " + name);
        return result;
    },
  
findElement_By_value: function(value, parent){
    var start = (new Date()).getTime();	
	if (!parent) {
		parent = UIATarget.localTarget().frontMostApp();
	}
        var timeout = UIATarget.localTarget().timeout();
	var result;
	while (((new Date()).getTime() - start) < (timeout * 1000) || timeout == 0) {
		result = this._searchElements(parent, value, "value");
		if (result.isValid()) {
                    UIATarget.localTarget().delay(0.5); 
		   return result;		   
		}
	}
	//UIALogger.logFail("Unable to find element named " + name);
    //    Assert.fail("Unable to find element value " + value);
        return result;
    },

isNil: function(element) {
	return (element.toString() == "[object UIAElementNil]");
    },
    
/*
scrollTo_And_Get: function(tableName, item, group) {
	var table = Finder.findElement_By_name(tableName);
	var grp;
	if (!group==null) {
		grp = table.groups()[group];
	} else {
		grp = table.cells();
	}
	var itm = grp[item];
	table.scrollToElementWithName(itm.name());
        return itm;
    },*/

scrollTo_And_Get: function(tableName,item,group){
    var table  = Finder.findElement_By_name(tableName);
    var grp;
    if( item<0 ){
        grp = table.groups()[group];
    }else if ( (group==null) && (item>=0)){
        grp = table.cells()[item];
    }else{
        grp = table.groups()[group].cells()[item];
    }
    table.scrollToElementWithName(grp.name());
    return grp;
},

_searchElements: function(elem, value, key) {
	try {
		UIATarget.localTarget().pushTimeout(0);		
		var result = elem.withValueForKey(value, key);
		if (!this.isNil(result)) {
                    
			return result;
		}		
		
		var elems = elem.elements();
		var i;
		for (i = 0; i < elems.length; i++) {
			var child = elems[i];		
			result = this._searchElements(child, value, key);
			if (!this.isNil(result)) {
				return result;
			}
		}
		return result;
	} finally {
		UIATarget.localTarget().popTimeout();
	}
    },
}

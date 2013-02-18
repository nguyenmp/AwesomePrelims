/**

  awesomeSets.js 

  Original author, Johan Henkens and Phill Conrad
  UCSB CS Dept. for Project Awesome

  Original Version: Fall 2012

*/

function isEquivalentTo(x,y) {
    if(x==null || y==null){
        return false;
    } else if (typeof(x) != typeof(y))
        return false;
    switch (typeof(x)) {
        case "string":
        case "number":
        case "boolean":
            return x==y;
        case "object":
            if (x instanceof Set && y instanceof Set)  {
                return x.isSameSetAs(y);
            } else if (x instanceof Tuple && y instanceof Tuple){
                return x.isSameTupleAs(y);
            } else{
                return false;
            }
        default:
            throw "Unknown type in isEquivalentTo";
    }
};

function randFromArray (arr, count){
    if (count == null){
        return arr[_.rand(arr.length)];
    } else{
        return _.map(arr.slice(0,count),function(){
            return arr.splice(_.random(0,arr.length-1),1)[0];
        });
    }
};

function randArrayOfElements (maxElems,minElems){
    minElems = minElems || 1;
    maxElems = maxElems || _.random(minElems,5);
    if(minElems>maxElems){
        minElems = maxElems;
    }
    var tempArr = [];
    var tempSource = [
        ["t","u","v","w","x","y","z"],
        ["a","b","c","d","e","f"],
        [1,2,3,4,5,6,7]];
    tempSource = tempSource[_.random(2)];
    return randFromArray(tempSource,_.random(minElems,maxElems));
};

function Set(array){
    //initialize temp to the passed array or a random array
    var temp = array || randArrayOfElements();
    this.array = [];
    //This is a member function of the Set class
    this.size = function(){
        return this.array.length;
    };

    this.indexOfElement = function(element){
        for (var i=0; i<this.size(); i++) {
            if (isEquivalentTo(element,this.array[i])){
                return i;
            }
        }
        return -1;
    };

    this.contains = function(element) {
        return this.indexOfElement(element)!=-1;
    };

    this.hasElement = this.contains;
    this.containsElement = this.contains;

    this.addElement = function(element){
        if(element!=null){
            if(!this.contains(element)){
                this.array.push(element);
            }
        }
    };
    //This is more initialization code, however we have it down here because we need to wait for addElement to be declared
    for( var i = 0; i<temp.length; i++){
        this.addElement(temp[i]);
    }

    this.clone = function(){
        return new Set(this.array);
    };
    this.shuffle = function(){
        this.array.sort(function() { return 0.5 - Math.random();});
    };

    this.laTeXformat = function(){
        return this.format().replace(/{/g,"\\{").replace(/}/g,"\\}");
    };

    //Concatenate all the elements together into a string representing the set
    this.format =function() {
        var output = "{";
        for(var i = 0; i < this.size(); i++){
            if(typeof(this.array[i]) == "object"){
                if(this.array[i] instanceof Set || this.array[i] instanceof Tuple) {
                    output+=this.array[i].format();
                }
                else{
                    //We don't support any other object types in our sets/tuples atm
                    return null;
                }
            }else{
                output+=this.array[i];
            }
            if(i!=this.array.length-1){
                output+=",";
            }
        }
        output += "}";
        return output;
    };
    this.toString = this.laTeXformat;

    // A.cartesianProduct(B) = A x B
    this.cartesianProduct = function(otherSet) {
        var answer = [];
        for (var i=0; i<this.size(); i++) {
            for (var j=0; j<otherSet.size(); j++) {
                var tuple = new Tuple([this.array[i],otherSet.array[j]]);
                answer.push(tuple);
            }
        }
        return new Set(answer);
    };

    //returns true if otherSet is a subset or equal to this set.
    this.containsSet = function(otherSet) {
        if(!(otherSet instanceof Set)){
            return false;
        }

        for (var i=0; i<otherSet.array.length; i++) {
            if (!this.contains(otherSet.array[i]) ){
                return false;
            }
        }
        return true;
    };

    this.hasSubsetEq = this.containsSet;

    this.isSubsetEqOf = function(otherSet){
        if(!(otherSet instanceof Set)){
            return false;
        }
        return otherSet.hasSubsetEq(this);
    }

    //Returns true if this set contains the subset otherset.
    //Equivalent to otherset \subset this in laTeX
    //This is the proper subset
    //TODO: Rename methods to proper math terminology, subset and proper subset. proper subset means that they are not equal
    this.containsSubSet = function(otherSet){
        return this.containsSet(otherSet) && !otherSet.containsSet(this);
    };


    this.hasSubset = this.containsSubSet;

    this.isSubsetOf = function(otherSet){
        if(!(otherSet instanceof Set)){
            return false;
        }
        return otherSet.hasSubset(this);
    }

    this.isSameSetAs = function(otherSet) {
        return this.containsSet(otherSet) && otherSet.containsSet(this);
    };

    this.equals = this.isSameSetAs;

    this.removeElementAtIndex = function(index){
        if(index>=0 && index < this.size()){
            this.array.splice(index,1);
            return true;
        }
        return false;
    };

    this.removeElement = function(element){
        return this.removeElementAtIndex(this.indexOfElement(element));
    };

    this.getRandomSubset = function(maxSize){
        maxSize = maxSize || _.random(0,this.size()-1);
        return new Set(randFromArray(this.array,maxSize));
    };

};

function Tuple(array){
    this.array = array || randArrayOfElements();

    this.size = function(){
        return this.array.length;
    };

    /** NEW **/

    this.elementAt = function(index) {
	return this.array[index];
    }

    /** end NEW **/

    this.indexOfElement = function(element){
        for (var i=0; i<this.size(); i++) {
            if (isEquivalentTo(element,array[i])){
                return i;
            }
        }
        return -1;
    };

    this.contains = function(element) {
        return this.indexOfElement(element)!=-1;
    };

    this.hasElement = this.contains;
    this.containsElement = this.contains;

    this.addElement = function(element){
        if(element!=null){
            this.array.push(element);
        }
    };

    this.laTeXformat = function(){
        return this.format().replace("{","\\{").replace("}","\\}");
    };

    this.format =function() {
        var output = "(";
        for(var i = 0; i < this.size(); i++){
            if(typeof(this.array[i]) == "object"){
                if(this.array[i] instanceof Set || this.array[i] instanceof Tuple) {
                    output+=this.array[i].format();
                }
                else{
                    return null;
                }
            }else{
                output+=this.array[i];
            }
            if(i!=this.array.length-1){
                output+=",";
            }
        }
        output += ")";
        return output;
    };
    this.toString = this.laTeXformat;

    //They are only the same tuple if they are both Tuples, the otherTuple has the same size, 
    //and each tuple contains the same elements in the same order
    this.isSameTupleAs = function(otherTuple){
        if(!(otherTuple instanceof Tuple) || this.size()!=otherTuple.size()){
            return false;
        }
        for(var i = 0; i<this.size();i++){
            if(!isEquivalentTo(this.array[i],otherTuple.array[i])){
                return false;
            }
        }
        return true;
    };

    this.equals = this.isSameTupleAs;

    this.removeElementAtIndex = function(index){
        if(index>=0 && index < this.size()){
            this.array.splice(index,1);
            return true;
        }
        return false;
    };

    this.removeElement = function(element){
        return this.removeElementAtIndex(this.indexOfElement(element));
    };

};


//The following is really nasty! Let's change this to use some parsing library!
//***********************
//Creates a random set object with size inclusively between minElems and MaxElems, from the sourceSet
//All parameters are optional, with default values of 1 for min, 5 for max, and a random set from a-f, t-z, or 1-7
function isProperClosingBrace(open,close){
    if (open=='{'){
        return close=='}';
    } else if (open=='('){
        return close==')';
    } else{
        return false;
    }
};

//Token can be either a string string with A-Za-z and then continuing with alphanumeric characters
//Or it can be any decimal or float number
function parseSetOrTupleToken (setString, pos){
    var sub = setString.substring(pos);
    //Handle identifiers/numbers
    if(sub.match(/^[A-Za-z]/)){
        var ss = sub.match(/^[A-Za-z][A-Za-z0-9]*/);
        pos += ss[0].length;
        return [ss[0],pos];
    } else if(sub.match(/^-?[0-9]/)){
        var ss = sub.match(/^-?[0-9]+\.?[0-9]*/);;
        pos += ss[0].length;
        return [parseFloat(ss[0]),pos];
    } else if(sub.match(/^\{|^\(/)){
        return parseSetOrTupleStringHelper(setString,pos);
    } else{
        return [null,null];
    }
};


function parseSetOrTupleStringHelper(setString, pos){
    if(pos>=setString.length) return [null,null];
    var openingBrace = setString[pos];
    if(!openingBrace.match(/^\{|^\(/)){
        return [null,null];
    }
    var output = [];
    for( var i=pos+1; i<setString.length;++i){
        var ch = setString[i];
        if(ch.match(/^\}|^\)/)){
            if(!isProperClosingBrace(openingBrace,ch)){
                return [null,null];
            } else{
                i = i+1;
                break;
            }
        } else {
            var result = parseSetOrTupleToken(setString,i);
            if (result[0]!=null){
                output.push(result[0]);
                i=result[1];
            }
        }
        if(i>=setString.length){
            return [null,null];
        } else if(setString[i].match(/^\}|^\)/)){
            i--;
        } else if(!setString[i].match(/^,/)){
            return [null,null];
        }
    }
    if(openingBrace=="{"){
        return [new Set(output),i];
    } else if(openingBrace=="("){
        return [new Tuple(output),i];
    } else {
        return [null,null];
    }
};

//TODO: Investigate javascript grammar parsers, also rewrite using recursive descent parser
function parseSetString (setString){
    setString = setString.replace(/\s/g,'');
    var result = parseSetOrTupleStringHelper(setString,0);
    if(result[0]==null || result[1]!=setString.length){
        return null;
    } else {
        return result[0];
    }
};


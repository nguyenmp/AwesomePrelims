/**

  awesomeSets.js 

  Original author, Johan Henkens and Phill Conrad
  UCSB CS Dept. for Project Awesome

  Original Version: Fall 2012

*/

function Node(centerX, centerY, label, radius, borderColor, fillColor, borderWidth, labelColor) {
    var DEFAULT_LABEL = "", DEFAULT_RADIUS = 20, DEFAULT_BORDER_COLOR = "black", 
    DEFAULT_FILL_COLOR = "white", DEFAULT_BORDER_WIDTH = 2;

    this.centerX = centerX;
    this.centerY = centerY;
    this.label = label || DEFAULT_LABEL;
    this.radius = radius || DEFAULT_RADIUS;
    this.borderColor = borderColor || DEFAULT_BORDER_COLOR;
    this.fillColor = fillColor || DEFAULT_FILL_COLOR;
    this.borderWidth = borderWidth || DEFAULT_BORDER_WIDTH;
    this.labelColor = labelColor || DEFAULT_BORDER_COLOR;

    this.toSvg = function() {
        var str = "<circle cx='" + this.centerX + "' cy='" + this.centerY +
            "' r='" + this.radius + "' stroke='" + this.borderColor + 
            "' stroke-width='" + this.borderWidth + "' fill='" +
            this.fillColor + "' />";
        if (this.label.length > 0) {
            str += "\n<text x='" + (this.centerX-this.radius/5) + "' y='" + 
                (this.centerY+this.radius/5) + "' fill='" + this.labelColor +
                "'>" + this.label + "</text>";
        }
        return str;
    }
}





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

//If count is passed, returns an array of length count whose elements are
//randomly chosen from arr. If arr does not have any duplicate elements, the
//returned array will not have duplicates either.
//If count is not passed, it returns a random element from arr
function randFromArray(arr, count) {
    if (count == null){
        return arr[_.rand(arr.length)];
    } else{
        return _.map(arr.slice(0,count),function(){
            return arr.splice(_.random(0,arr.length-1),1)[0];
        });
    }
};

//Creates a random array with size between minElems and maxElems (inclusive)
//Elements are selected from sourceSet if passed, or a default set.
function randArrayOfElements(maxElems,minElems,sourceSet) {
    minElems = minElems || 1;
    maxElems = maxElems || _.random(minElems,5);
    if(minElems>maxElems){
        minElems = maxElems;
    }
    //Set the source array from which elements will be selected.
    //If the sourceSet parameter is passed, that will be used; otherwise, it
    //will use one of the default arrays.
    var source = sourceSet || [
        ["t","u","v","w","x","y","z"],
        ["a","b","c","d","e","f"],
        [1,2,3,4,5,6,7]][_.random(2)];
    return randFromArray(source,_.random(minElems,maxElems));
};

function Set(array, throwDupError, name) {
    //Initialize temp to the passed array or a random array
    var temp = array || randArrayOfElements();
    //The 'elements' member of a Set object is the array that holds the
    //members of the set. It will not have duplicate elements.
    this.elements = [];

    //This is a member function of the Set class
    this.size = function() {
        return this.elements.length;
    };

    this.cardinality = this.size;

    this.indexOfElement = function(element) {
        for (var i=0; i<this.size(); i++) {
            if (isEquivalentTo(element,this.elements[i])){
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

    this.addElement = function(element) {
        if(element!=null){
            if(!this.contains(element)){
                this.elements.push(element);
            }
        }
    };

    for(var i=0; i<temp.length; i++) {
        this.addElement(temp[i]);
    }

    if(throwDupError && this.elements.length < array.length) {
        //This throws an error if the parser was trying to create a Set object
        //but it had duplicate elements, since that is technically not a valid
        //set. If we decide not to throw an error for this, it's a simple fix.
        throw "You entered in a multi-set, not a set"
    }

    //TODO: A might be a terrible default
    this.name = name || "A";

    //TODO: Make this scalable again
    this.toSvg = function() {
        str = "<rect x='3' y='10' width='55' height='" + (this.elements.length*60+20*2) + "' fill='white' stroke-width='2' stroke='black' />"
        str += "\n<text x='24' y='25' fill='black'>" + this.name + "</text>"
        _.each(this.elements, function(element, i) { str += "\n" + (new Node(30,20+60*(i+1), element.toString())).toSvg(); });
        return str;
    }

    this.clone = function() {
        return new Set(this.elements);
    };
    this.shuffle = function() {
        this.elements.sort(function() { return 0.5 - Math.random();});
    };

    this.laTeXformat = function() {
        return this.format().replace(/{/g,"\\{").replace(/}/g,"\\}");
    };

    //Concatenate all the elements together into a string representing the set
    this.format = function() {
        var output = "{";
        for(var i = 0; i < this.size(); i++){
            if(typeof(this.elements[i]) == "object"){
                if(this.elements[i] instanceof Set || this.elements[i] instanceof Tuple) {
                    output+=this.elements[i].format();
                }
                else{
                    //We don't support any other object types in our sets/tuples atm
                    return null;
                }
            }else{
                output+=this.elements[i];
            }
            if(i!=this.elements.length-1){
                output+=",";
            }
        }
        output += "}";
        return output;
    };
    this.toString = this.laTeXformat;

    //A.cartesianProduct(B) = A x B
    this.cartesianProduct = function(otherSet) {
        var answer = [];
        for (var i=0; i<this.size(); i++) {
            for (var j=0; j<otherSet.size(); j++) {
                var tuple = new Tuple([this.elements[i],otherSet.elements[j]]);
                answer.push(tuple);
            }
        }
        return new Set(answer);
    };

    //Returns true if otherSet is a subset or equal to this set.
    this.containsSet = function(otherSet) {
        if(!(otherSet instanceof Set)){
            return false;
        }

        for (var i=0; i<otherSet.elements.length; i++) {
            if (!this.contains(otherSet.elements[i]) ){
                return false;
            }
        }
        return true;
    };

    this.hasSubset = this.containsSet;

    this.isSubsetOf = function(otherSet) {
        if(!(otherSet instanceof Set)){
            return false;
        }
        return otherSet.hasSubset(this);
    }

    //Returns true if this set contains the subset otherset.
    //Equivalent to otherset \subset this in laTeX
    this.containsProperSubset = function(otherSet) {
        return this.containsSet(otherSet) && !otherSet.containsSet(this);
    };


    this.hasProperSubset = this.containsProperSubset;

    this.isProperSubsetOf = function(otherSet) {
        if(!(otherSet instanceof Set)){
            return false;
        }
        return otherSet.hasProperSubset(this);
    }

    this.isSameSetAs = function(otherSet) {
        return this.containsSet(otherSet) && otherSet.containsSet(this);
    };

    this.equals = this.isSameSetAs;

    this.removeElementAtIndex = function(index) {
        if(index>=0 && index < this.size()){
            this.elements.splice(index,1);
            return true;
        }
        return false;
    };

    this.removeElement = function(element) {
        return this.removeElementAtIndex(this.indexOfElement(element));
    };

    this.getRandomSubset = function(maxSize) {
        maxSize = maxSize || _.random(0,this.size()-1);
        return new Set(randFromArray(this.elements,maxSize));
    };

};

function Tuple(array) {
    this.elements = array || randArrayOfElements();

    this.size = function(){
        return this.elements.length;
    };

    this.elementAt = function(index) {
        return this.elements[index];
    }

    this.indexOfElement = function(element) {
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

    this.addElement = function(element) {
        if(element!=null){
            this.elements.push(element);
        }
    };

    this.laTeXformat = function() {
        return this.format().replace("{","\\{").replace("}","\\}");
    };

    this.format =function() {
        var output = "(";
        for(var i = 0; i < this.size(); i++){
            if(typeof(this.elements[i]) == "object"){
                if(this.elements[i] instanceof Set || this.elements[i] instanceof Tuple) {
                    output+=this.elements[i].format();
                }
                else{
                    return null;
                }
            }else{
                output+=this.elements[i];
            }
            if(i!=this.elements.length-1){
                output+=",";
            }
        }
        output += ")";
        return output;
    };
    this.toString = this.laTeXformat;

    //They are only the same tuple if they are both Tuples, the otherTuple has the same size, 
    //and each tuple contains the same elements in the same order
    this.isSameTupleAs = function(otherTuple) {
        if(!(otherTuple instanceof Tuple) || this.size()!=otherTuple.size()){
            return false;
        }
        for(var i = 0; i<this.size();i++){
            if(!isEquivalentTo(this.elements[i],otherTuple.elements[i])){
                return false;
            }
        }
        return true;
    };

    this.equals = this.isSameTupleAs;

    this.removeElementAtIndex = function(index) {
        if(index>=0 && index < this.size()){
            this.elements.splice(index,1);
            return true;
        }
        return false;
    };

    //Note: Since tuples can contain duplicate elements, this will always
    //remove the first match
    this.removeElement = function(element) {
        return this.removeElementAtIndex(this.indexOfElement(element));
    };

};
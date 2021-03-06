/*
class(stirng name,{
	constructor:function(),
	member:object,
	method:function		
})
*/


//////////////////////////////////////     Member     /////////////////////////////////////
//public | protected | private
//static
//extend

function Member(value) {
	this.value = value;
}

function PrivateMember(value) {
	Member.call(this, value);
}
PrivateMember.prototype = Object.create(Member.prototype);
PrivateMember.prototype.constructor = PrivateMember;

function ProtectedMember(value) {
	Member.call(this, value);
}
ProtectedMember.prototype = Object.create(Member.prototype);
ProtectedMember.prototype.constructor = ProtectedMember;

function PublicMember(value) {
	Member.call(this, value);
}
PublicMember.prototype = Object.create(Member.prototype);
PublicMember.prototype.constructor = PublicMember;

function StaticMember(value) {
	Member.call(this, value);
}
StaticMember.prototype = Object.create(Member.prototype);
StaticMember.prototype.constroctor = StaticMember;

function Private(value) {
	var obj = new PrivateMember(value);
	return obj;
}

function Public(value) {
	var obj = new PublicMember(value);
	return obj;
}

function Protected(value) {
	var obj = new ProtectedMember(value);
	return obj;
}

function Static(value) {
	var obj = new StaticMember(value);
	return obj;
}


////////////////////////////////////////////////////////////////////////////////////////

//BaseClass(className)
function BaseClass() {

}

Object.defineProperty(BaseClass, "__constructor__", {
	configurable: false,
	writable: true,
	enumerable: true,
	value: function () {
		this.__objID__ = this.__GenID__();
	}
});

Object.defineProperty(BaseClass, "internalPrototype", {
	configurable: false,
	writable: false,
	enumerable: true,
	value: {}
});

(function () {
	var objID = -1;
	Object.defineProperty(BaseClass.internalPrototype, "__GenID__", {
		configurable: false,
		writable: false,
		value: function () {
			return ++objID;
		},
		enumerable: false
	});
})();

Object.defineProperty(BaseClass, "isClass", {
	configurable: false,
	writable: false,
	enumerable: true,
	value: true
});


//Class(className,classContent)
//Class(className,superClass,classContent)
function Class() {
	var mapToInternalReference = {};

	var className = arguments[0];
	var classContents = arguments[arguments.length - 1];

	var superClass = arguments[1].__isClass__ ? arguments[1] : BaseClass;
	var ctor = classContents.hasOwnProperty("constructor") ? classContents["constructor"] : function () { };
	delete classContents["constructor"];

	var newClassType = (new Function("GenClass", "return function " + className + "(){return GenClass.apply(arguments.callee,arguments);}"))(GenClass);
	newClassType.prototype = Object.create(superClass.prototype);
	newClassType.prototype.constructor = newClassType;
	var internalPrototype = Object.create(superClass.internalPrototype);

	var directAttributeMember = {};
	var directFunctionMember = {};
	var flattenFunctionMember = {};
	var flattenAttributeMember = {};

	for (var p in superClass.flattenAttributeMember) {
		flattenAttributeMember[p] = superClass.flattenAttributeMember[p];
	}
	for (var p in superClass.flattenFunctionMember) {
		flattenFunctionMember[p] = superClass.flattenFunctionMember[p];
	}

	for (var p in classContents) {
		if (!(classContents[p] instanceof Member)) classContents[p] = Public(classContents[p]);
		if (classContents[p] instanceof StaticMember) {
			Object.defineProperty(newClassType, p, {
				enumerable: true,
				writable: false,
				configurable: false,
				value: classContents[p].value
			});
		} else {
			if (typeof classContents[p].value === "function") {
				flattenFunctionMember[p] = directFunctionMember[p] = classContents[p];
				Object.defineProperty(internalPrototype, p, {
					enumerable: true,
					writable: false,
					configurable: false,
					value: classContents[p].value
				});
			} else {
				flattenAttributeMember[p] = directAttributeMember[p] = classContents[p];
			}
		}
	}

	for (var funcName in directFunctionMember) {
		CopyReferenceFunctionMemberOnPrototype(newClassType.prototype, funcName, directFunctionMember[funcName], false);
	}

	function CopyReferenceFunctionMemberOnPrototype(target, memberName, member, isInternalObj) {
		if (member instanceof PublicMember) {
			if (typeof member.value === "function") {
				Object.defineProperty(target, memberName, {
					writable: false,
					configurable: true,
					enumerable: true,
					value: function () {
						return member.value.apply(mapToInternalReference[this.__objID__], arguments);
					}
				});
			} else {
				Object.defineProperty(target, memberName, {
					configurable: false,
					enumerable: true,
					get: function () {
						return mapToInternalReference[this.__objID__][memberName];
					},
					set: function (value) {
						mapToInternalReference[this.__objID__][memberName] = value;
					}
				});
			}
		}
	}
	Object.defineProperty(newClassType, "__directAttributeMember__", {
		value: directAttributeMember,
		writable: false,
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(newClassType, "__directFunctionMember__", {
		value: directFunctionMember,
		writable: false,
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(newClassType, "__flattenAttributeMember__", {
		value: flattenAttributeMember,
		writable: false,
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(newClassType, "__flattenFunctionMember__", {
		value: flattenFunctionMember,
		writable: false,
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(newClassType, "internalPrototype", {
		value: internalPrototype,
		writable: false,
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(newClassType, "__constructor__", {
		configurable: false,
		writable: true,
		enumerable: false,
		value: function () {
			superClass.__constructor__.apply(this, arguments);
			ctor.apply(this, arguments);
		}
	});
	Object.defineProperty(newClassType, "__isClass__", {
		configurable: false,
		writable: false,
		enumerable: false,
		value: true
	});
	Object.defineProperty(newClassType.prototype, "__className__", {
		writable: false,
		enumerable: false,
		configurable: false,
		value: className
	});

	//this === newClassType
	function GenClass() {
		var externalObj = Object.create(this.prototype);
		var internalObj = Object.create(this.internalPrototype);
		var flattenAttributeMember = this.__flattenAttributeMember__;
		//var directFunctionMember = this.directFunctionMember;
		
		for (var p in flattenAttributeMember) {
			Object.defineProperty(internalObj, p, {
				writable: true,
				configurable: false,
				enumerable: true,
				value: flattenAttributeMember[p].value
			});

			CopyReferenceFunctionMemberOnPrototype(externalObj, p, flattenAttributeMember[p], false);
		}

		this.__constructor__.apply(internalObj, arguments);

		Object.defineProperty(externalObj, "__objID__", {
			configurable: false,
			enumerable: false,
			get: function () {
				return internalObj.__objID__;
			}
		});

		externalObj.internalObj = internalObj;
		Object.seal(internalObj);
		Object.seal(externalObj);
		mapToInternalReference[externalObj.__objID__] = internalObj;
		return externalObj;
	}

	Object.seal(newClassType)
	return newClassType;
}

var A = Class("A", {
	constructor: function (privateName) {
		this.ChildOfA = true;
		//this.privaMember = privateName;
	},
	A_member: 1,
	A_privateMember: Private(0),
	A_staticMember: Static(2),
	A_doSomething: Public(function () { this.A_privDo(); console.log(this.A_privateMember); }),
	A_privDo: Private(function () { console.log("it is Private"); this.A_privateMember = this.A_privateMember === 0 ? Math.random() * 10 : this.A_privateMember; })
});

var B = Class("B", A, {
	constructor: function (b) {
		this.childOfB = b;
	},
	B_member: 2,
	B_dododo: function () { this.B_privateDo(); },
	B_privateDo: Private(function () { console.log("Let's dodododododo"); })
});

var C = Class("C", B, {});

var a1 = new A("a1");
a1.A_doSomething();
//delete a1.ClassName;
console.log(a1.__className__);
var b = new B("bbbbbbbbb");
b.B_dododo();
console.log(b.__className__);
var a2 = new A("a2");
console.log(a2.__className__);
a2.member = 3;
a2.A_doSomething();
a1.A_doSomething();

console.log(a1.A_doSomething === a2.A_doSomething);
console.log(a1.A_doSomething === b.B_dododo);
// var c = new C("cccccccc");
// c.dododo();
// console.log(c.ClassName);

//console.log(a1.ClassName === b.ClassName);
console.log("stop");
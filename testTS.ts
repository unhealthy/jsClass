class A{
	private member1:string;
	public member2:number;
	static mmmmmmmmmmm:string = "static";
	
	constructor(a:string,b:number){
		this.member1 = a;
		this.member2 = b;
	}
	
	public Dosomething(){
		console.log(this.member1);
		this.Doanotherthing();
	}
	
	private Doanotherthing(){
		console.log(this.member2);
	}
}

interface D{
	
}

class B extends A implements D{
	private myMember1:string = "priva";
	public myMember2:number = 2;
	
	constructor(a:string,b:number,c:Object);
	constructor(a:string,b:number,c:boolean);
	constructor(a:string,b:number,c){
		super(a,b);
		// this.myMember1 = a;
		// this.myMember2 = b;
		var temp = 0;
		temp = 10;
	}
	
	public dododo(){
		console.log(this.member2+this.myMember1+this.myMember2);
	}
}

var a:A = new A("aaa",111);
a.Dosomething();

var b:B = new B("bbb",222);
b.dododo();
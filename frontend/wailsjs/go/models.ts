export namespace bertrand {
	
	export class RandomPoint {
	    Point: Point;
	    IsFavorable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RandomPoint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Point = this.convertValues(source["Point"], Point);
	        this.IsFavorable = source["IsFavorable"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Point {
	    X: number;
	    Y: number;
	
	    static createFrom(source: any = {}) {
	        return new Point(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.X = source["X"];
	        this.Y = source["Y"];
	    }
	}
	export class FirstMethodResult {
	    R: number;
	    N: number;
	    TriangleA: Point;
	    TriangleB: Point;
	    TriangleC: Point;
	    RandomPoints: RandomPoint[];
	    Favorable: number;
	    Probability: number;
	
	    static createFrom(source: any = {}) {
	        return new FirstMethodResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.R = source["R"];
	        this.N = source["N"];
	        this.TriangleA = this.convertValues(source["TriangleA"], Point);
	        this.TriangleB = this.convertValues(source["TriangleB"], Point);
	        this.TriangleC = this.convertValues(source["TriangleC"], Point);
	        this.RandomPoints = this.convertValues(source["RandomPoints"], RandomPoint);
	        this.Favorable = source["Favorable"];
	        this.Probability = source["Probability"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class RandomLine {
	    PointFirst: Point;
	    PointSecond: Point;
	    IsFavorable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RandomLine(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.PointFirst = this.convertValues(source["PointFirst"], Point);
	        this.PointSecond = this.convertValues(source["PointSecond"], Point);
	        this.IsFavorable = source["IsFavorable"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class SecondMethodResult {
	    R: number;
	    N: number;
	    TriangleA: Point;
	    TriangleB: Point;
	    TriangleC: Point;
	    RandomPoints: RandomPoint[];
	    PerpendicularLines: RandomLine[];
	    Favorable: number;
	    Probability: number;
	
	    static createFrom(source: any = {}) {
	        return new SecondMethodResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.R = source["R"];
	        this.N = source["N"];
	        this.TriangleA = this.convertValues(source["TriangleA"], Point);
	        this.TriangleB = this.convertValues(source["TriangleB"], Point);
	        this.TriangleC = this.convertValues(source["TriangleC"], Point);
	        this.RandomPoints = this.convertValues(source["RandomPoints"], RandomPoint);
	        this.PerpendicularLines = this.convertValues(source["PerpendicularLines"], RandomLine);
	        this.Favorable = source["Favorable"];
	        this.Probability = source["Probability"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ThirdMethodResult {
	    R: number;
	    N: number;
	    TriangleA: Point;
	    TriangleB: Point;
	    TriangleC: Point;
	    RandomPoints: RandomPoint[];
	    Favorable: number;
	    Probability: number;
	
	    static createFrom(source: any = {}) {
	        return new ThirdMethodResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.R = source["R"];
	        this.N = source["N"];
	        this.TriangleA = this.convertValues(source["TriangleA"], Point);
	        this.TriangleB = this.convertValues(source["TriangleB"], Point);
	        this.TriangleC = this.convertValues(source["TriangleC"], Point);
	        this.RandomPoints = this.convertValues(source["RandomPoints"], RandomPoint);
	        this.Favorable = source["Favorable"];
	        this.Probability = source["Probability"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}


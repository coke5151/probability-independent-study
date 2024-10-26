package bertrand

import (
	"math"
	"math/rand"
)

type Point struct {
	X float64
	Y float64
}

func distance(a, b Point) float64 {
	return math.Sqrt(math.Pow(a.X-b.X, 2) + math.Pow(a.Y-b.Y, 2))
}

type RandomPoint struct {
	Point       Point
	IsFavorable bool
}

type FirstMethodResult struct {
	R            float64
	N            int
	TriangleA    Point
	TriangleB    Point
	TriangleC    Point
	RandomPoints []RandomPoint
	Favorable    int
	Probability  float64
}

func FirstMethod(r float64, n int) FirstMethodResult { // 隨機端點法
	alpha := rand.Float64()                                      // 隨機角度
	triangleA := Point{r * math.Cos(alpha), r * math.Sin(alpha)} // 取得一個點的座標
	// 取得另外兩個三角形的點座標
	triangleB := Point{
		triangleA.X*math.Cos(2*math.Pi/3) - triangleA.Y*math.Sin(2*math.Pi/3),
		triangleA.X*math.Sin(2*math.Pi/3) + triangleA.Y*math.Cos(2*math.Pi/3),
	}
	triangleC := Point{
		triangleA.X*math.Cos(4*math.Pi/3) - triangleA.Y*math.Sin(4*math.Pi/3),
		triangleA.X*math.Sin(4*math.Pi/3) + triangleA.Y*math.Cos(4*math.Pi/3),
	}
	rTriangle := distance(triangleB, triangleC) // 三角形的邊長

	// 回傳與統計的變數
	randomPoints := []RandomPoint{}
	favorable := 0

	// 生成 n 個隨機點並判斷是否滿足條件
	for i := 0; i < n; i++ {
		alpha := rand.Float64() * (2 * math.Pi) // 隨機角度
		p := Point{r * math.Cos(alpha), r * math.Sin(alpha)}
		isFavorable := false
		if distance(p, triangleA) > rTriangle {
			favorable++
			isFavorable = true
		} else {
			isFavorable = false
		}
		randomPoints = append(randomPoints, RandomPoint{Point: p, IsFavorable: isFavorable})
	}
	return FirstMethodResult{
		R:            r,
		N:            n,
		TriangleA:    triangleA,
		TriangleB:    triangleB,
		TriangleC:    triangleC,
		RandomPoints: randomPoints,
		Favorable:    favorable,
		Probability:  float64(favorable) / float64(n),
	}
}

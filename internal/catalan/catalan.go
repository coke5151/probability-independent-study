package catalan

import (
	"fmt"

	"gonum.org/v1/gonum/stat/combin"
)

type Step int

const (
	Right Step = iota
	Up
)

type Point struct {
	X int
	Y int
}

// isInvalidPath 可以判斷一個 path 是否是最非法路徑
func isMostInvalidPath(path []Step) bool {
	count := 0
	for _, step := range path {
		if step == Up {
			count++
		} else { // == Right
			count--
		}
		if count < 0 {
			return false
		}
	}
	return count == 0 // 最後要確定有走到右上角
}

// pathToCoordinates 從 (0, 0) 開始，依照每個 step 向右或向上將整條路徑轉換成座標
func pathToCoordinates(path []Step) []Point {
	coords := []Point{}
	coords = append(coords, Point{0, 0})

	x, y := 0, 0
	for _, step := range path {
		if step == Up { // 向上
			y++
		} else if step == Right { // 向右
			x++
		}
		coords = append(coords, Point{x, y})
	}
	return coords
}

// generateAllPermutations 根據組合生成所有可能的路徑（包含合法與違法）
func generateAllStepPermutations(length int) [][]Step {
	combinations := combin.Combinations(length, length/2)
	var results [][]Step

	// 對每個組合生成對應的序列
	for _, comb := range combinations {
		// 創建一個新的全 Right 序列
		sequence := make([]Step, length)

		// 在指定的位置放置 Up
		for _, pos := range comb {
			sequence[pos] = Up
		}

		results = append(results, sequence)
	}

	return results
}

// generateAllPossiblePaths 產生所有可能的最非法路徑
func generateAllInvalidPaths(n int) [][]Step {
	if n == 0 {
		return [][]Step{}
	}
	ret := [][]Step{}
	for _, path := range generateAllStepPermutations(2 * n) {
		if isMostInvalidPath(path) {
			ret = append(ret, path)
		}
	}
	return ret
}

const DebugTag1 bool = false

func DebugPrintfTag1(s string) {
	if DebugTag1 {
		fmt.Print(s)
	}
}

// generateAllPathSteps 接收邊長 n，產生所有走法（每 row 第 0 個是最非法，後續為推移過的）
func generateAllPathSteps(n int) [][][]Step {
	invalidPaths := generateAllInvalidPaths(n)
	invalidNums := len(invalidPaths)
	DebugPrintfTag1(fmt.Sprintf("invalidPaths.Len = %v\n", len(invalidPaths)))
	DebugPrintfTag1(fmt.Sprintf("invalidNums = %v\n", invalidNums))

	allReturnPath := make([][][]Step, invalidNums)
	DebugPrintfTag1(fmt.Sprintf("allReturnPath: %v\n", allReturnPath))
	DebugPrintfTag1("for i, invalidPath := range invalidPaths {\n")

	for i, invalidPath := range invalidPaths {
		DebugPrintfTag1(fmt.Sprintf("\t<新的一輪 for，i == %v, invalidPath == %v>\n", i, invalidPath))

		allReturnPath[i] = append(allReturnPath[i], invalidPath)
		DebugPrintfTag1(fmt.Sprintf("\tallReturnPath[%v] = %v\n", i, allReturnPath[i]))

		basePath := invalidPath
		DebugPrintfTag1(fmt.Sprintf("\tbasePath := %v\n", basePath))
		DebugPrintfTag1("\tfor j := 0; j < n; j++\n")

		for j := 0; j < n; j++ { // 每條最非法路徑都能再推出 n-1 個非法路徑和 1 個合法路徑
			DebugPrintfTag1(fmt.Sprintf("\t\t<新的一輪 for，j == %v>\n", j))
			DebugPrintfTag1("\t\tup := 0\n")
			DebugPrintfTag1("\t\tright := 0\n")
			DebugPrintfTag1("\t\tlastIsInvalid := false\n")
			DebugPrintfTag1("\t\tmoveIndex := -1\n")
			up := 0
			right := 0
			lastIsInvalid := false
			moveIndex := -1
			DebugPrintfTag1("\t\tfor k := range basePath {\n")
			for k := range basePath {
				DebugPrintfTag1(fmt.Sprintf("\t\t\t<新的一輪 for，k == %v>\n", k))
				if basePath[k] == Up {
					DebugPrintfTag1(fmt.Sprintf("\t\t\tbasePath[%v] == Up\n", k))
					DebugPrintfTag1("\t\t\tup++\n")
					up++
				} else {
					DebugPrintfTag1(fmt.Sprintf("\t\t\tbasePath[%v] != Up\n", k))
					DebugPrintfTag1("\t\t\tright++\n")
					right++
				}

				if up == right && lastIsInvalid {
					DebugPrintfTag1("\t\t\tup == right && lastIsInvalid\n")
					DebugPrintfTag1(fmt.Sprintf("\t\t\tmoveIndex = %v\n", k))
					moveIndex = k
					break
				}

				if up > right {
					lastIsInvalid = true
					DebugPrintfTag1(fmt.Sprintf("\t\t\tup > right 所以 lastIsInvalid = %v\n", lastIsInvalid))
				} else {
					lastIsInvalid = false
					DebugPrintfTag1(fmt.Sprintf("\t\t\tup <= right 所以 lastIsInvalid = %v\n", lastIsInvalid))
				}
			}
			DebugPrintfTag1(fmt.Sprintf("\t\t\t目前的 basePath: %v\n", basePath))
			newFront := basePath[moveIndex+1:]
			newMiddle := []Step{basePath[moveIndex]}
			newTail := basePath[:moveIndex]
			DebugPrintfTag1(fmt.Sprintf("\t\t\tnewFront: %v\n", newFront))
			DebugPrintfTag1(fmt.Sprintf("\t\t\tnewMiddle: %v\n", newMiddle))
			DebugPrintfTag1(fmt.Sprintf("\t\t\tnewTail: %v\n", newTail))

			basePath = append(newFront, newMiddle...)
			basePath = append(basePath, newTail...)
			DebugPrintfTag1(fmt.Sprintf("\t\t\t重排後的 basePath: %v\n", basePath))
			allReturnPath[i] = append(allReturnPath[i], basePath)
		}
	}
	return allReturnPath
}

const DebugTag2 bool = false

func DebugPrintfTag2(s string) {
	if DebugTag2 {
		fmt.Print(s)
	}
}

// GenerateAllPathPoints 接收邊長 n，產生所有走法的對應座標（每 row 第 0 個是最非法，後續為推移過的）
func GenerateAllPathPoints(n int) [][][]Point {
	pathRows := generateAllPathSteps(n)
	// pathRows = [][][]Step{
	// 	[][]Step{
	// 		[]Step{1, 1, 1, 0, 0, 0},
	// 		[]Step{0, 1, 1, 1, 0, 0},
	// 		[]Step{0, 0, 1, 1, 1, 0},
	// 		[]Step{0, 0, 0, 1, 1, 1},
	// 	},
	// 	[][]Step{
	// 		[]Step{1, 1, 0, 1, 0, 0},
	// 		[]Step{0, 1, 1, 0, 1, 0},
	// 		[]Step{1, 0, 0, 0, 1, 1},
	// 		[]Step{0, 0, 1, 1, 0, 1},
	// 	},
	// 	[][]Step{
	// 		[]Step{1, 1, 0, 0, 1, 0},
	// 		[]Step{1, 0, 0, 1, 1, 0},
	// 		[]Step{0, 1, 1, 0, 0, 1},
	// 		[]Step{0, 1, 0, 0, 1, 1},
	// 	},
	// 	[][]Step{
	// 		[]Step{1, 0, 1, 1, 0, 0},
	// 		[]Step{1, 1, 0, 0, 0, 1},
	// 		[]Step{0, 1, 0, 1, 1, 0},
	// 		[]Step{0, 0, 1, 0, 1, 1},
	// 	},
	// 	[][]Step{
	// 		[]Step{1, 0, 1, 0, 1, 0},
	// 		[]Step{1, 0, 1, 0, 0, 1},
	// 		[]Step{1, 0, 0, 1, 0, 1},
	// 		[]Step{0, 1, 0, 1, 0, 1},
	// 	},
	// }
	points := make([][][]Point, len(pathRows))
	DebugPrintfTag2(fmt.Sprintf("pathRows := %#v\n", pathRows))
	DebugPrintfTag2(fmt.Sprintf("points := %v\n", points))

	DebugPrintfTag2("for i, path := range pathRows {\n")
	for i, paths := range pathRows {
		DebugPrintfTag2(fmt.Sprintf("\t<新的一輪 for，i = %v, paths = %v>\n", i, paths))
		DebugPrintfTag2("\tfor _, path := range paths {\n")
		for _, path := range paths {
			DebugPrintfTag2(fmt.Sprintf("\t\t<新的一輪 for，_, path = %v>\n", path))
			points[i] = append(points[i], pathToCoordinates(path))
			DebugPrintfTag2(fmt.Sprintf("\t\tpoints[%v] = append(points[%v], pathToCoordinates(%v))\n", i, i, path))
			DebugPrintfTag2(fmt.Sprintf("\t\t現在 points[%v] 已變為 %v\n", i, points[i]))
		}
	}
	return points
}

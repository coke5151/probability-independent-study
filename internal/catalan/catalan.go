package catalan

import (
	"gonum.org/v1/gonum/stat/combin"
)

type Step int

const (
	Up    Step = 1
	Right Step = 1
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

// // pathToCoordinates 從 (0, 0) 開始，依照每個 step 向右或向上將整條路徑轉換成座標
// func pathToCoordinates(path []Step) []Point {
// 	coords := []Point{}
// 	coords = append(coords, Point{0, 0})

// 	x, y := 0, 0
// 	for _, step := range path {
// 		if step == Up { // 向上
// 			y++
// 		} else if step == Right { // 向右
// 			x++
// 		}
// 		coords = append(coords, Point{x, y})
// 	}
// 	return coords
// }

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

// GenerateAllPath 接收邊長 n，產生所有走法（每 row 第 0 個是最非法，後續為推移過的）
func GenerateAllPath(n int) [][][]Step {
	invalidPaths := generateAllInvalidPaths(n)
	invalidNums := len(invalidPaths)

	allReturnPath := make([][][]Step, invalidNums)
	for i, invalidPath := range invalidPaths {
		allReturnPath[i] = append(allReturnPath[i], invalidPath)
		basePath := invalidPath
		for j := 0; j < n; j++ { // 每條最非法路徑都能再推出 n-1 個非法路徑和 1 個合法路徑
			up := 0
			right := 0
			lastIsInvalid := false
			moveIndex := 0
			for k := range len(basePath) {
				if basePath[k] == Up {
					up++
				} else {
					right++
				}

				if up == right && lastIsInvalid {
					moveIndex = i
					break
				}

				if up >= right {
					lastIsInvalid = true
				} else {
					lastIsInvalid = false
				}
			}
			basePath = append(basePath[moveIndex+1:], basePath[moveIndex])
			basePath = append(basePath, basePath[:moveIndex]...)
			allReturnPath[i] = append(allReturnPath[i], basePath)
		}
	}
	return allReturnPath
}

package secretary

import (
	"math/rand/v2"
	"runtime"
	"slices"
	"sync"
)

// newSlice 產生由 start 至 end 的序列（左閉右開）
func newSlice[T int | float64](start, end, step T) []T {
	if step <= 0 || end < start {
		return []T{}
	}
	s := make([]T, 0, int(1+(end-start)/step))
	for start < end {
		s = append(s, start)
		start += step
	}
	return s
}

// chooseByAlgo 根據給定的條件試著挑選出比 bestReject 還好的第一個面試者
func chooseByAlgo(scores []float64, rejectNumber int, bestReject float64) float64 {
	length := len(scores)
	valueBest := 0.0
	foundIt := false

	// 從樣本區間之後的位置開始找有沒有符合條件者
	for i := rejectNumber; i < length && !foundIt; i++ {
		if scores[i] > bestReject {
			valueBest = scores[i]
			foundIt = true
			break
		}
		i++
	}

	if !foundIt {
		valueBest = scores[length-1]
	}

	return valueBest
}

// doRound 開啟新的一輪面試
//
// Parameter:
//
//	roundSize: 面試者的數量
//	rejectNumber: 樣本區間
func doRound(roundSize int, rejectNumber int) bool {
	scores := newSlice(0.0, float64(roundSize), 1)
	rand.Shuffle(roundSize, func(i, j int) {
		scores[i], scores[j] = scores[j], scores[i]
	})

	bestOfAll := slices.Max(scores)
	bestReject := 0.0

	if rejectNumber == 0 {
		bestReject = 0
	} else {
		if rejectNumber == 1 {
			bestReject = scores[0]
		} else {
			bestReject = slices.Max(scores[0:rejectNumber])
		}
	}

	algoResult := chooseByAlgo(scores, rejectNumber, bestReject)
	return algoResult >= bestOfAll
}

// DoMultipleRound 回傳一個 [1000]float64，其中每項代表以 (0.1*i)% 為樣本區間時成功的總數量
//
// Parameter
//
//	totalRounds: 每個 (0.1*i)% 要進行多少次面試

func DoMultipleRound(totalRounds int) [1000]float64 {
	cores := runtime.NumCPU()
	eachWorkload := totalRounds / cores
	remainWorkload := totalRounds - eachWorkload*cores
	wg := &sync.WaitGroup{}

	resultsPipe := make(chan [1000]float64, cores+5)

	worker := func(totalRounds int) {
		defer wg.Done()
		success := [1000]float64{}
		for rejectNumber := 0; rejectNumber < 1000; rejectNumber++ {
			for i := 0; i < totalRounds; i++ {
				if doRound(1000, rejectNumber) {
					success[rejectNumber] += 1.0
				}
			}
		}
		resultsPipe <- success
	}

	if eachWorkload > 0 {
		wg.Add(cores)
		for range cores {
			go worker(eachWorkload)
		}
	}
	if remainWorkload > 0 {
		wg.Add(1)
		go worker(remainWorkload)
	}

	wg.Wait()
	close(resultsPipe)
	success := [1000]float64{}
	for data := range resultsPipe {
		for i := 0; i < 1000; i++ {
			success[i] += data[i]
		}
	}

	return success
}

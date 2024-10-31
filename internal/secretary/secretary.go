package secretary

import (
	"math/rand/v2"
	"runtime"
	"sync"
)

const (
	defaultCandidateCount = 1000
	maxSamplePercentage   = 1000
)

// generateUniqueScores 生成不重複的分數序列
func generateUniqueScores(size int) []float64 {
	// 創建 0 到 size-1 的序列
	scores := make([]float64, size)
	for i := range scores {
		scores[i] = float64(i)
	}

	// Fisher-Yates shuffle 演算法
	for i := size - 1; i > 0; i-- {
		j := rand.IntN(i + 1)
		scores[i], scores[j] = scores[j], scores[i]
	}

	return scores
}

// findBestInSample 找出樣本中的最佳分數
func findBestInSample(scores []float64, sampleSize int) float64 {
	if sampleSize == 0 {
		return 0
	}

	best := scores[0]
	for i := 1; i < sampleSize; i++ {
		if scores[i] > best {
			best = scores[i]
		}
	}
	return best
}

// chooseByAlgo 使用演算法選擇候選人
func chooseByAlgo(scores []float64, sampleSize int, bestInSample float64) float64 {
	for i := sampleSize; i < len(scores); i++ {
		if scores[i] > bestInSample {
			return scores[i]
		}
	}
	return scores[len(scores)-1]
}

// doRound 執行單輪模擬
func doRound(roundSize int, sampleSize int) bool {
	// 生成不重複的分數序列
	scores := generateUniqueScores(roundSize)

	// 找出整體最佳分數
	bestOverall := scores[0]
	for _, score := range scores {
		if score > bestOverall {
			bestOverall = score
		}
	}

	// 找出樣本中的最佳分數
	bestInSample := float64(0)
	if sampleSize > 0 {
		bestInSample = findBestInSample(scores[:sampleSize], sampleSize)
	}

	// 使用演算法選擇候選人
	algoResult := chooseByAlgo(scores, sampleSize, bestInSample)
	return algoResult >= bestOverall
}

// simulateWorker 處理模擬工作的 worker
func simulateWorker(rounds int, resultsChan chan<- [maxSamplePercentage]float64, wg *sync.WaitGroup) {
	defer wg.Done()

	results := [maxSamplePercentage]float64{}

	// 對每個樣本大小進行模擬
	for sampleSize := 0; sampleSize < maxSamplePercentage; sampleSize++ {
		for round := 0; round < rounds; round++ {
			if doRound(defaultCandidateCount, sampleSize) {
				results[sampleSize]++
			}
		}
	}

	resultsChan <- results
}

// DoMultipleRound 執行多輪模擬
func DoMultipleRound(totalRounds int) [maxSamplePercentage]float64 {
	numCPU := runtime.NumCPU()
	baseWorkload := totalRounds / numCPU
	extraWork := totalRounds % numCPU

	var wg sync.WaitGroup
	resultsChan := make(chan [maxSamplePercentage]float64, numCPU)

	// 啟動 worker
	for i := 0; i < numCPU; i++ {
		workload := baseWorkload
		if i < extraWork {
			workload++
		}
		if workload > 0 {
			wg.Add(1)
			go simulateWorker(workload, resultsChan, &wg)
		}
	}

	// 等待所有 worker 完成並關閉 channel
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	// 合併結果
	var finalResults [maxSamplePercentage]float64
	for results := range resultsChan {
		for i := range finalResults {
			finalResults[i] += results[i]
		}
	}

	return finalResults
}

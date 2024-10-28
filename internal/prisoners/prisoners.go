package prisoners

import (
	"math/rand/v2"
)

type testCase struct {
	numberOfPrisoners int
	boxesLimits       int
	boxContents       []int
}

func newTestCase(numberOfPrisoners int, boxesLimits int) *testCase {
	boxContents := []int{}
	for i := 0; i < numberOfPrisoners; i++ {
		boxContents = append(boxContents, i)
	}
	rand.Shuffle(len(boxContents), func(i, j int) {
		boxContents[i], boxContents[j] = boxContents[j], boxContents[i]
	})

	return &testCase{
		numberOfPrisoners: numberOfPrisoners,
		boxesLimits:       boxesLimits,
		boxContents:       boxContents,
	}
}

func (t *testCase) findNumberLoop(prisonerNumber int) bool {
	found := false
	boxesOpened := 0
	nextBox := prisonerNumber
	for !found && boxesOpened < t.boxesLimits {
		if t.boxContents[nextBox] == prisonerNumber {
			found = true
		} else {
			nextBox = t.boxContents[nextBox]
		}
		boxesOpened = boxesOpened + 1
	}
	return found
}

func (t *testCase) attemptsResult() bool {
	prisonerSuccess := true
	for i := 0; i < t.numberOfPrisoners; i++ {
		prisonerSuccess = t.findNumberLoop(i)
		if !prisonerSuccess {
			break
		}
	}
	return prisonerSuccess
}

func Simulate(attempts int) (averageProbability []float64) {
	success := 0
	total := 0
	for i := 0; i < attempts; i++ {
		tc := newTestCase(100, 50)
		if tc.attemptsResult() {
			success++
		}
		total++
		averageProbability = append(averageProbability, float64(success)/float64(total))
	}
	return
}

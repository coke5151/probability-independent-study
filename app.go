package main

import (
	"context"
	"fmt"

	"github.com/coke5151/probability-independent-study/internal/bertrand"
	"github.com/coke5151/probability-independent-study/internal/catalan"
	"github.com/coke5151/probability-independent-study/internal/prisoners"
	"github.com/coke5151/probability-independent-study/internal/secretary"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) FirstMethod(r float64, n int) bertrand.FirstMethodResult {
	return bertrand.FirstMethod(r, n)
}

func (a *App) SecondMethod(r float64, n int) bertrand.SecondMethodResult {
	return bertrand.SecondMethod(r, n)
}

func (a *App) ThirdMethod(r float64, n int) bertrand.ThirdMethodResult {
	return bertrand.ThirdMethod(r, n)
}

func (a *App) GenerateAllCatalanPathPoints(n int) [][][]catalan.Point {
	return catalan.GenerateAllPathPoints(n)
}

func (a *App) PrisonersProblem(attempts int, prisonersNum int) []float64 {
	return prisoners.Simulate(attempts, prisonersNum)
}

func (a *App) SecretaryDoMultipleRounds(totalRounds int) [1000]float64 {
	return secretary.DoMultipleRound(totalRounds)
}

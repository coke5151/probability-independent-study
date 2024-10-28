package main

import (
	"fmt"

	"github.com/coke5151/probability-independent-study/internal/catalan"
)

func main() {
	var n int
	fmt.Println("input (n) of catalan calculation:")
	fmt.Scanln(&n)
	res := catalan.GenerateAllPathPoints(n)
	fmt.Println(res)

}

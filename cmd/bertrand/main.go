package main

import (
	"fmt"

	"github.com/coke5151/probability-independent-study/internal/bertrand"
)

func panicWithErr(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	fmt.Println("choose from the 3 methods(1|2|3):\n\t1\n\t2\n\t3")
	var choice, n int
	var r float64
	_, err := fmt.Scanln(&choice)
	panicWithErr(err)
	fmt.Printf("Your choice is: %v\n", choice)

	fmt.Print("r = ")
	_, err = fmt.Scanln(&r)
	panicWithErr(err)

	fmt.Print("n = ")
	_, err = fmt.Scanln(&n)
	panicWithErr(err)

	switch choice {
	case 1:
		result := bertrand.FirstMethod(r, n)
		fmt.Println(result.Probability)
	default:
		fmt.Println("your choice is not implemented: ", choice)
	}
}

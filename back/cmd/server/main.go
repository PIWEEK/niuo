package main

import (
	"github.com/piweek/niuo/internal/server"
)

func main() {
	a := server.App{}
	a.Init()
	a.Start("0.0.0.0:8000")
}

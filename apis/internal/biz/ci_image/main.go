package main

import (
	"bufio"
	"fmt"
	"github.com/go-git/go-git/v6"
	"io"
	"os"
	"os/exec"
	"sync"
)

func main() {

	codePath := "/tmp/foo"
	imageTag := "build:v1"
	cloneCode(codePath)
	buildImage(codePath, imageTag)
	pushImage(imageTag)
}
func cloneCode(codePath string) {
	fmt.Println("###### Step1: Clone code")
	gitUrl, err := os.ReadFile("/app/config/GitUrl")
	if err != nil {
		panic(err)
	}
	fmt.Printf("clone code from %s\n", string(gitUrl))
	_, err = git.PlainClone(codePath, &git.CloneOptions{
		URL:      string(gitUrl),
		Progress: os.Stdout,
	})
	if err != nil {
		panic(err)
	}
}

func buildImage(codePath, imageTag string) {
	fmt.Println("###### Step2: Build image")
	cmd := exec.Command("buildah", "build",
		"--tag", imageTag,
		"/app/config",
	)
	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	stderrPipe, err := cmd.StderrPipe()
	if err != nil {
		panic(err)
	}
	if err = cmd.Start(); err != nil {
		panic(err)
	}
	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		printOutput(stdoutPipe)
	}()
	go func() {
		defer wg.Done()
		printOutput(stderrPipe)
	}()
	wg.Wait()
	if err = cmd.Wait(); err != nil {
		panic(err)
	}
}

func pushImage(imageTag string) {
	fmt.Println("###### Step3: Push image")
	// time.Sleep(5 * time.Minute)
	//cmd := exec.Command("buildah", "push",
	//	imageTag,
	//)
	//stdoutPipe, err := cmd.StdoutPipe()
	//if err != nil {
	//	panic(err)
	//}
	//stderrPipe, err := cmd.StderrPipe()
	//if err != nil {
	//	panic(err)
	//}
	//if err = cmd.Start(); err != nil {
	//	panic(err)
	//}
	//var wg sync.WaitGroup
	//wg.Add(2)
	//go func() {
	//	defer wg.Done()
	//	printOutput(stdoutPipe)
	//}()
	//go func() {
	//	defer wg.Done()
	//	printOutput(stderrPipe)
	//}()
	//wg.Wait()
	//if err = cmd.Wait(); err != nil {
	//	panic(err)
	//}

}

func printOutput(pipe io.Reader) {
	scanner := bufio.NewScanner(pipe)
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Printf("%s\n", line)
	}

}

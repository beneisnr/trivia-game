import React, { Component } from "react";
import Button from "./styles/Button";
import QuestionContainer from "./styles/QuestionContainer";
import "./App.css";

// TODO: after checking if answer is correct, set [1] to false so that they cant double click

class App extends Component {
  state = {
    playing: false,
    score: null,
    time: null,
    question: null,
    a: null,
    b: null,
    c: null
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.handleTime();
    }, 1000);
  }

  startGame = () => {
    this.getNewQuestion();
    this.setState({ playing: true, score: 0, time: 60 });
  };

  // update question in state
  getNewQuestion = () => {
    this.fetchQuestion()
      .then(res => {
        this.setState({
          question: res.question,
          a: [res.a, res.a === res.answer], // [choice, isCorrect]
          b: [res.b, res.b === res.answer],
          c: [res.c, res.c === res.answer]
        });
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  // fetch question from server
  fetchQuestion = async () => {
    const response = await fetch("/api/question");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  // check if correct, update score, get new question
  handleChoice = answer => {
    answer[1]
      ? this.setState({ score: this.state.score + 10 })
      : this.setState({ score: this.state.score - 10 });

    this.getNewQuestion();
  };

  handleTime = () => {
    const currTime = this.state.time;
    if (this.state.playing && currTime > 0) {
      this.setState({ time: currTime - 1 });
    } else {
      this.setState({ playing: false });
    }
  };

  // handleSubmit = async e => {
  //   e.preventDefault();
  //   const response = await fetch("/api/world", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ post: this.state.post })
  //   });
  //   const body = await response.text();
  //   this.setState({ responseToPost: body });
  // };

  render() {
    return (
      <div className="app">
        {/* start button */}
        {!this.state.playing && this.state.score === null && (
          <Button onClick={() => this.startGame()}>Start</Button>
        )}
        {/* game over / try again */}
        {!this.state.playing && this.state.score !== null && (
          <div className="gameOver">
            <h1>Game over, score: {this.state.score}</h1>
            <Button onClick={() => this.startGame()}>Play again!</Button>
          </div>
        )}
        {/* question and choices */}
        {this.state.playing && this.state.question && (
          <div>
            <h3>
              Score: {this.state.score} Time remaining: {this.state.time}
            </h3>
            <QuestionContainer>
              <h2>{this.state.question}</h2>
            </QuestionContainer>

            <div>
              <Button onClick={() => this.handleChoice(this.state.a)}>
                {this.state.a[0]}
              </Button>
            </div>

            <div>
              <Button onClick={() => this.handleChoice(this.state.b)}>
                {this.state.b[0]}
              </Button>
            </div>

            <div>
              <Button onClick={() => this.handleChoice(this.state.c)}>
                {this.state.c[0]}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default App;

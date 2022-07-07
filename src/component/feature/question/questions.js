import React, { useEffect, useState } from "react";
import { Paper, Button, RadioGroup, Radio } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, questionsFromStorage } from "./questionsSlice";
import "./questions.css";
import { CSSTransition } from "react-transition-group";
import moment from "moment";
import Countdown from "react-countdown";
import { postStats } from "../stats/statsSlice";
import Stats from "../stats/stats";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Questions() {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.questions.status);
    const questions = useSelector((state) => state.questions.questions);
    const [showAnimation, setShowAnimation] = useState(true);
    const [startQuiz, setStartQuiz] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [value, setValue] = useState(null);
    const [index, setIndex] = useState(0);
    const [responseGivenByUser, setResponseGivenByUser] = useState([]);
    const [clipboard, setClipboard] = useState(false);
    const [saveStats, setSaveStats] = useState(false);

    useEffect(() => {
        if (saveStats) {
            dispatch(postStats({ rank: count() }));
            setSaveStats(false);
        }
    }, [saveStats, dispatch]);

    useEffect(() => {
        if (questions && responseGivenByUser.length === questions.question.length) {
            const objectToStore = {
                questions: questions,
                responseGivenByUser: responseGivenByUser,
                lastGame: moment(new Date()).format("YYYY-MM-DD[T00:00:00.000Z]"),
            };
            localStorage.setItem("stats", JSON.stringify(objectToStore));
        }
    }, [responseGivenByUser.length, questions, responseGivenByUser]);

    useEffect(() => {
        const lc = localStorage.getItem("stats");
        if (lc) {
            const storage = JSON.parse(lc);
            if (
                moment(storage.lastGame).isSame(
                    moment(new Date()).format("YYYY-MM-DD[T00:00:00.000Z]")
                )
            ) {
                setResponseGivenByUser(storage.responseGivenByUser);
                dispatch(questionsFromStorage(storage.questions));
                setShowResult(true);
                setShowQuestion(true);
                return;
            }
        }

        if (status === "idle") {
            dispatch(fetchQuestions());
        }

        if (status === "succeeded") {
        }
    }, [index, dispatch, status]);

    const onNextQuesion = (event) => {
        setResponseGivenByUser([...responseGivenByUser, value]);
        setShowAnimation(false);
        if (questions.question.length - 1 === index) {
            setShowQuestion(false);
            setShowResult(true);
            setSaveStats(true);
            return;
        }
        setValue(null);
        setIndex(index + 1);
    };

    const onStartclick = (event) => {
        setStartQuiz(true);
        setShowAnimation(false);
    };

    const count = () => {
        let count = 0;

        questions.question.forEach((question, index) => {
            if (question.correctAnswer === responseGivenByUser[index]) {
                count++;
            }
        });

        return count;
    };

    const getClipboardText = () => {
        let text = "Quizdle du " + moment(new Date()).format("DD/MM/YYYY") + "\n";

        questions.question.forEach((question, index) => {
            if (question.correctAnswer === responseGivenByUser[index]) {
                text += "🟩";
            } else {
                text += "🟥";
            }
        });

        text += "\n";
        text += "quizdle.com";

        return text;
    };

    let content = null;

    if (!showResult && status === "succeeded") {
        if (!startQuiz) {
            content = (
                <div className="flex justify-center">
                    <Button onClick={onStartclick}>Démarrer le quiz</Button>
                </div>
            );
        } else {
            content = (
                <div>
                    {showQuestion ? (
                        <React.Fragment>
                            <RadioGroup
                                value={value}
                                onChange={setValue}
                                label={questions.question[index].question}
                                required
                                orientation="vertical"
                            >
                                {questions.question[index].allResponse.map((response, index) => {
                                    return <Radio key={index} value={response} label={response} />;
                                })}
                            </RadioGroup>
                            <div className="flex justify-center">
                                <Button disabled={value ? false : true} onClick={onNextQuesion}>
                                    {" "}
                                    {questions.question.length - 1 === index
                                        ? "Voir le resultat"
                                        : "Question Suivante"}{" "}
                                </Button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div> </div>
                    )}
                </div>
            );
        }
    }

    if (showResult) {
        let end = moment().endOf('day').toDate()
        content = showQuestion ? (
            <div>
                <h2>
                    Votre Résultat : {count()} / {responseGivenByUser.length}
                </h2>

                <Stats></Stats>

                {questions.question.map((question, indexQuestion) => {
                    return (
                        <div key={indexQuestion}>
                            <h3>{question.question}</h3>
                            <ul>
                                {question.allResponse.map((response, indexResponse) => {
                                    if (
                                        responseGivenByUser[indexQuestion] === response &&
                                        responseGivenByUser[indexQuestion] !==
                                            question.correctAnswer
                                    ) {
                                        return <li key={indexResponse}> {response} 🟥 </li>;
                                    }

                                    if (question.correctAnswer === response) {
                                        return (
                                            <li className="bold" key={indexResponse}>
                                                {" "}
                                                {response} 🟩{" "}
                                            </li>
                                        );
                                    }

                                    return <li key={indexResponse}> {response} </li>;
                                })}
                            </ul>
                        </div>
                    );
                })}

                <div className="flex justify-center">
                    <CopyToClipboard text={getClipboardText()} onCopy={() => setClipboard(true)}>
                        <Button>Copier vos resultats dans le presse papier</Button>
                    </CopyToClipboard>
                </div>

                {clipboard ? <span style={{ color: "red" }}>Copied.</span> : null}

                <div className="flex column align-center">
                    <h3>Prochain quiz dans : </h3>
                    <Countdown date={end}></Countdown>
                </div>
            </div>
        ) : (
            <div></div>
        );
    }

    if (!questions) {
        content = <div>questions introuvable</div>;
    }

    return (
        <CSSTransition
            in={showAnimation}
            timeout={300}
            classNames="fade"
            onEnter={() => setShowQuestion(true)}
            onExited={() => {
                setShowQuestion(false);
                setShowAnimation(true);
            }}
        >
            <Paper shadow="xl" radius="md" p="lg" withBorder>
                {content}
            </Paper>
        </CSSTransition>
    );
}

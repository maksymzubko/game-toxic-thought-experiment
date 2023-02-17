import React, {useEffect, useState} from 'react';
import {Backdrop, Box, CircularProgress} from "@mui/material";

import style from './style.module.css'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SelectSocket, SelectUserId, SelectUserLetter, SelectUserRoom} from "../../redux/store/socket/selector";
import {useSnackbar} from "notistack";
import {links} from "../../router";
import {setRoom, setUserLetter} from "../../redux/store/socket/slice";
import {getAnimalByLetter} from "../../helpers/animalHelp";
import {LeaveInterface} from "../RoomPage";
import GameRunningItem from "./GameRunningItem";
import GameResultItem from "./GameResultsItem";
import answerBg from './assets/bg.png'
import AnimalBar from "../../components/Animals";
import DrinkTogether from "./DrinkTogether";
import ReadyScreen from "./ReadyScreen";
import DrinkSolo from "./DrinkSolo";
import LoginRequired from "../../components/LoginRequired";
import votesApi from "../../api/votes/votes.api";
import {setUserVotes} from "../../redux/store/user/slice";
import {SelectIsAuthorized, SelectUser} from "../../redux/store/user/selector";
import {setError} from "../../redux/store/game/slice";
import Evaluate from "./EvaluateItem";

interface GameStageInterface {
    status: boolean;
    stage: number;
}

interface GameSetCorrectInterface {
    status: boolean;
    message?: string;
    skipped?: boolean;
    step?: string;
}

interface GameStartedInterface {
    status: boolean,
    message?: string,
    data: {
        step?: string,
        question: { question_id: number; question: string; answers: string[] },
        round: number,
        leader: string
    }
}

interface GameEndedInterface {
    status: boolean,
    message?: string,
    results: Results[]
    correct: number,
}

interface SkipInterface {
    status: boolean,
    message: string
}

export interface Results {
    player?: string,
    answer: { variant: number, isCorrect: boolean },
}

export interface Result {
    results: Results[],
    correct: number
}

interface AnswerInterface {
    status: boolean,
    message?: string,
    data?: { step?: string }
}

const GamePage = () => {
    const goto = useNavigate();
    const dispatch = useDispatch();

    const userId = useSelector(SelectUserId);
    const userLetter = useSelector(SelectUserLetter);
    const userRoom = useSelector(SelectUserRoom);
    const socket = useSelector(SelectSocket);
    const userVotes = useSelector(SelectUser);

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [players, setPlayers] = useState<{ id: string, letter: string }[]>([]);
    const [gameStatus, setGameStatus] = useState<"waiting" | "running" | "results" | "drink" | "ready" | "evaluate">("waiting");
    const [data, setData] = useState<{ question_id: number; question: string; answers: string[] }>({question_id: null, question: "", answers: []})
    const [time, setTime] = useState<number>(-1);
    const [timer, setTimer] = useState<number>(60);
    const [round, setRound] = useState(1);
    const [drinkStatus, setDrinkStatus] = useState('');
    const [drinkStatusBool, setDrinkStatusBool] = useState(false);
    const [listDrinkAnimals, setListDrinkAnimals] = useState([]);
    const [gameStage, setGameStage] = useState(1);
    const [skipped, setSkipped] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [reported, setReported] = useState(false);

    const [results, setResults] = useState<Result>({correct: 0, results: []});
    // single
    const [currentStep, setCurrentStep] = useState<string>("");
    const [leader, setLeader] = useState<string>('')
    // multi
    const [isAnswered, setAnswered] = useState(false);
    const [activeLetter, setActiveLetter] = useState('')
    const [showTimer, setShowTimer] = useState(true);
    const [voted, setVoted] = useState<"none" | "report" | "like" | "dislike">("none");
    const isAuthorized = useSelector(SelectIsAuthorized);

    useEffect(() => {
        if (time === 3) {
            let timer = setInterval(() => {
                setTime(prev => {
                    if (prev === -1) {
                        clearInterval(timer);
                        socket?.emit('startGame');
                    }
                    return prev - 1;
                });
            }, 1000)
        }
    }, [time])

    useEffect(() => {
        if (skipped) {
            const customList = [{player: leader}]
            setTimeout(() => getDrinkAnimals(customList), 100);
        }
    }, [skipped]);

    useEffect(() => {
        if (!userId || (!userLetter && !userRoom.single && gameStatus !== 'results')) {
            const key = enqueueSnackbar(`Error when tried connect to ${!userId ? 'WebSocket' : 'Room'}`, {variant: "error", onClick: () => closeSnackbar(key)});
            goto(links.start);
        } else
            setLoading(false);

        socket?.emit('getRoomInfo');

        socket?.once('getRoom', (data: { status: boolean, message?: string, playersList: { id: string, letter: string }[] }) => {
            if (data.status) {
                setPlayers(data.playersList);
                setLoading(true);
                if (userRoom.isOwner)
                    setTime(3);
            } else {
                const key = enqueueSnackbar(`Error when tried connect to Room`, {variant: "error", onClick: () => closeSnackbar(key)});
                goto(links.start);
            }
        })

        socket?.on('leavedRoom', (data: LeaveInterface) => {
            if (data.status) {
                if (gameStatus === 'waiting')
                    goto(links.room);
                else if (gameStatus === 'running') {
                    dispatch(setRoom({roomNumber: null, single: null, isOwner: null}));
                    dispatch(setUserLetter({user_letter: null}));
                    const key = enqueueSnackbar(`One player leaves from a game before it gone`, {variant: "info", onClick: () => closeSnackbar(key)});
                    socket?.emit('leaveRoom');
                } else {
                    dispatch(setRoom({roomNumber: null, single: null, isOwner: null}));
                    dispatch(setUserLetter({user_letter: null}));
                    goto(links.lobby);
                }
            }
        })

        socket?.on('gameStage', (data: GameStageInterface) => {
            setLoadingRequest(false);
            setGameStage(data.stage);
        })

        socket?.on('gameStarted', (data: GameStartedInterface) => {
            setTimer(60);
            setLoading(false);
            if (data.status) {
                setSkipped(false)
                setAnswered(false);
                setLeader(data.data.leader);
                setData(data?.data?.question);
                console.log(data?.data)
                setRound(data?.data?.round);
                userRoom.single && setShowTimer(true);
                setCurrentStep(data?.data?.step ?? "");
                setGameStatus('running');
            } else
            {
                const single = userRoom.single;
                goto(single ? links.lobby : links.room,{state: {single}});
                single && socket.emit('leaveRoom');
                dispatch(setError(data.message));
            }
        })



        socket?.on('answer', (data: AnswerInterface) => {
            setLoadingRequest(false);
            if (data.status) {
                if (userRoom.single)
                    setCurrentStep(data?.data?.step ?? "");
                else
                    setAnswered(true);
            } else
            {
                const key = enqueueSnackbar(`Failed to send your answer. Try again.`, {variant: "error", onClick: () => closeSnackbar(key)});
            }
        })

        return () => {
            socket?.off('gameStage');
            socket?.off('answer');
            socket?.off('gameStarted');
            socket?.off('leavedRoom');
        }
    }, [])

    useEffect(() => {
        socket?.on('gameEnded', (data: GameEndedInterface) => {
            setLoadingRequest(false);
            if (data.status) {
                setResults({correct: data.correct, results: data.results});
                setGameStatus(reported ? 'ready' : 'results');
            }
        })

        return () => {
            socket?.off('gameEnded');
        }
    }, [reported])

    useEffect(() => {
        if(isAuthorized)
        {
            const _vote = userVotes?.voteList?.filter(v=>v.questionsid === data.question_id) ?? [];
            if(_vote.length)
                setVoted(_vote[0].variant);
        }
    }, [data])

    useEffect(() => {
        socket?.on('time', (data: { status: boolean, data: { time: number, onlyForLeader: boolean } }) => {
            if (data.status) {
                if(!userRoom.single && (userLetter === leader || gameStage === 2))
                    setShowTimer(true);
                else if(!userRoom.single) setShowTimer(false);

                setTimer(data.data.time);
            }
        })

        socket?.on('setCorrect', (data: GameSetCorrectInterface) => {
            if (!data.status) {
                setLoadingRequest(false);
            }
            else
            {
                setTimer(60);
                if(data.skipped)
                    setSkipped(true)
                else if(leader === userLetter) setAnswered(true);

                if(userRoom.single)
                    setCurrentStep(data.step);
            }

        })

        return () => {
            socket?.off('time');
            socket?.off('setCorrect');
        }
    }, [leader, gameStage])

    const handleReport = async () => {
        if(isAuthorized)
        {
            setLoadingRequest(true);
            votesApi.vote({question_id: data.question_id, vote_type: "report"})
                .then(res => {
                    handleSkipQuestion(true);
                    let votes = Array.from(userVotes?.voteList ?? []);
                    const vote = votes.findIndex(v=>v.questionsid === data.question_id);
                    if(vote !== -1)
                    {
                        votes[vote] = res;
                        dispatch(setUserVotes({userVotes: votes}));
                    }
                    else
                        dispatch(setUserVotes({userVotes: [...votes, res]}));

                }).catch(err => {
                console.log(err)
                setError(err.response.data.message.join(", "));
            }).finally(() => setLoadingRequest(false));
        }
        else
            setShowAlert(true)

    }

    const handleSkipQuestion = (reported = false) => {
        setLoadingRequest(true);
        if (gameStage === 1 && !reported) {
            handleSetCorrect(-1, true);
        } else {
            if(reported) setReported(true);

            socket?.emit('skip-question', {report: reported});

            socket?.once('skip-question', (data: SkipInterface) => {
                setLoadingRequest(false);
                if (data.status) {
                    setAnswered(true);
                } else
                {
                    const key = enqueueSnackbar(`Failed skip. Try again.`, {variant: "error", onClick: () => closeSnackbar(key)});
                }
            })
        }
    }

    const handleSetCorrect = (answer: number, skip = false) => {
        socket?.emit('setCorrect', {correct: answer, skipQuestion: skip});
    }

    const handleAnswer = (variant: number) => {
        setLoadingRequest(true);
        if (gameStage === 1)
            handleSetCorrect(variant)
        else
            socket?.emit('answer', {answer: variant});
    }

    const getDrinkAnimals = (list: any, shouldEvaluate: boolean = false) => {
        if (shouldEvaluate) {
            setGameStatus("evaluate");
        } else {
            setGameStatus('drink');
        }
        setListDrinkAnimals(list);
        setDrinkStatus('');
    }

    const getUserDrinkStatus = (status: string, statusBool: boolean, shouldEvaluate: boolean) => {
        if (shouldEvaluate) {
            setGameStatus("evaluate");
        } else {
            setGameStatus('drink');
        }
        setDrinkStatus(status);
        setDrinkStatusBool(statusBool);
    }

    const getActiveAnimal = () => {

    }

    useEffect(() => {
        if (!players || !userId) return
        if (userRoom.single) {
            if (gameStage === 1) setActiveLetter('')
            else setActiveLetter(currentStep)
        } else {
            const playerTemp = players.find(player => player.id === userId);
            if (playerTemp) {
                setActiveLetter(playerTemp.letter)
            }

        }
    }, [gameStage, currentStep]);

    return (
        <>
            {(gameStatus === 'running' || gameStatus === 'results' || gameStatus === 'evaluate') &&
                <Box className={style.container}>
                    <img className={style.answer_bg} src={answerBg}/>
                    <Box className={style.question}>
                        <Box className={style.content}>
                            {data.question}
                        </Box>
                        <img src={getAnimalByLetter(leader)} alt="" className={style.questionOwner}/>
                    </Box>
                </Box>
            }

            {(gameStatus === 'running' && players) && <AnimalBar players={players.filter(p=> p.letter !== leader )} currentStep={activeLetter}/>}
            {gameStatus === 'running' &&
                <div className={style.answers_block}>
                    <GameRunningItem
                        players={players}
                        question={data}
                        currentStep={currentStep}
                        handleAnswer={handleAnswer}
                        gameStage={gameStage}
                        handleSkip={handleSkipQuestion}
                        handleReport={handleReport}
                        isAnswered={isAnswered}
                        leader={leader}
                        multiplayer={!userRoom.single}
                        setReported={setReported}
                        timer={timer}
                        voted={voted}
                        showTimer={showTimer}
                        onShowAlert={() => setShowAlert(true)}
                    />
                </div>
            }
            {gameStatus === 'results' &&
            <div className={style.answers_block}>
                <GameResultItem
                    result={results}
                    question={data}
                    voted={voted}
                    passDrinkAnimals={getDrinkAnimals}
                    setUserDrinkStatus={getUserDrinkStatus}
                    leader={leader}
                />
            </div>
            }
            {gameStatus === 'evaluate' &&
                <Evaluate
                    question={data}
                    changeGameStatus={() =>  setGameStatus('drink')}
                    voted={voted}
                />
            }
            {(gameStatus === 'drink' && !drinkStatus) &&
                <DrinkTogether
                    players={players}
                    listAnimalsWithBeer={listDrinkAnimals}
                    letDrink={() => setGameStatus('ready')}
                />}
            {(gameStatus === 'drink' && drinkStatus) &&
                <DrinkSolo
                    drinkStatus={drinkStatus}
                    drinkStatusBool={drinkStatusBool}
                    players={players} userId={userId}
                    letDrink={() => setGameStatus('ready')}
                />}

            {gameStatus === 'ready' && <ReadyScreen players={players} round={reported ? round - 1 : round}/>}

            {showAlert && <LoginRequired onClose={() => setShowAlert(false)}/>}

            <Backdrop open={loading} style={{color: 'black', fontSize: 32}}>
                {time < 0
                    ?
                    <h1>Waiting... <br/> <CircularProgress/></h1>
                    :
                    <h1>{time}</h1>}
            </Backdrop>

            <Backdrop open={loadingRequest} style={{color: "black"}}>
                <h1>Sending request.. <CircularProgress/></h1>
            </Backdrop>
        </>
    );
};

export default GamePage;

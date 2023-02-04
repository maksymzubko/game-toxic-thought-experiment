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

interface GameStageInterface {
    status: boolean;
    stage: number;
}

interface GameSetCorrectInterface {
    status: boolean;
    message?: string;
    skipped?: boolean;
}

interface GameStartedInterface {
    status: boolean,
    message?: string,
    data: {
        step?: string,
        question: { question: string; answers: string[] },
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

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [players, setPlayers] = useState<{ id: string, letter: string }[]>([]);
    const [gameStatus, setGameStatus] = useState<"waiting" | "running" | "results" | "drink" | "ready">("waiting");
    const [data, setData] = useState<{ question: string; answers: string[] }>({question: "", answers: []})
    const [time, setTime] = useState<number>(-1);
    const [timer, setTimer] = useState<number>(60);
    const [round, setRound] = useState(1);
    const [drinkStatus, setDrinkStatus] = useState('');
    const [drinkStatusBool, setDrinkStatusBool] = useState(false);
    const [listDrinkAnimals, setListDrinkAnimals] = useState([]);
    const [gameStage, setGameStage] = useState(1);
    const [skipped, setSkipped] = useState(false)

    const [results, setResults] = useState<Result>({correct: 0, results: []});
    // single
    const [currentStep, setCurrentStep] = useState<string>("");
    const [leader, setLeader] = useState<string>('')
    // multi
    const [isAnswered, setAnswered] = useState(false);

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
            enqueueSnackbar(`Error when tried connect to ${!userId ? 'WebSocket' : 'Room'}`, {variant: "error"});
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
                enqueueSnackbar(`Error when tried connect to Room`, {variant: "error"});
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
                    enqueueSnackbar(`One player leaves from a game before it gone`, {variant: "info"});
                    socket?.emit('leaveRoom');
                } else {
                    dispatch(setRoom({roomNumber: null, single: null, isOwner: null}));
                    dispatch(setUserLetter({user_letter: null}));
                    goto(links.lobby);
                }
            }
        })

        socket?.on('setCorrect', (data: GameSetCorrectInterface) => {
            if (!data.status) {
                setLoadingRequest(false);
            }
            else if(data.skipped)
            {
                setSkipped(true)
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
                setRound(data?.data?.round);
                setCurrentStep(data?.data?.step ?? "");
                setGameStatus('running');
            } else
                enqueueSnackbar(data.message, {variant: "error"});
        })

        socket?.on('gameEnded', (data: GameEndedInterface) => {
            setLoadingRequest(false);
            if (data.status) {
                setResults({correct: data.correct, results: data.results});
                setGameStatus('results');
            }
        })

        socket?.on('time', (data: { status: boolean, data: { time: number } }) => {
            if (data.status) {
                setTimer(data.data.time);
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
                enqueueSnackbar(`Failed to send your answer. Try again.`, {variant: "error"});
        })

        return () => {
            socket?.off('gameStage');
            socket?.off('setCorrect');
            socket?.off('time');
            socket?.off('gameEnded');
            socket?.off('answer');
            socket?.off('gameStarted');
            socket?.off('leavedRoom');
        }
    }, [])

    const handleSkipQuestion = () => {
        setLoadingRequest(true);
        if (gameStage === 1) {
            handleSetCorrect(-1, true);
        } else {
            socket?.emit('skip-question');

            socket?.once('skip-question', (data: SkipInterface) => {
                setLoadingRequest(false);
                if (data.status) {
                    setAnswered(true);
                } else
                    enqueueSnackbar(`Failed skip. Try again.`, {variant: "error"});
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

    const getDrinkAnimals = (list: any) => {
        setGameStatus('drink');
        setListDrinkAnimals(list);
        setDrinkStatus('');
    }

    const getUserDrinkStatus = (status: string, statusBool: boolean) => {
        setGameStatus('drink');
        setDrinkStatus(status);
        setDrinkStatusBool(statusBool);
    }

    return (
        <>
            {(gameStatus === 'running' || gameStatus === 'results') &&
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

            {(gameStatus === 'running' && players) && <AnimalBar players={players.filter(p=> p.letter !== leader )} currentStep={gameStage === 1 ? '' : currentStep}/>}
            <div className={style.answers_block}>
                {gameStatus === 'running' &&
                    <GameRunningItem
                        players={players}
                        question={data}
                        currentStep={currentStep}
                        handleAnswer={handleAnswer}
                        handleSkip={handleSkipQuestion}
                        isAnswered={isAnswered}
                        multiplayer={!userRoom.single}
                        timer={timer}
                    />}
                {gameStatus === 'results' &&
                    <GameResultItem
                        result={results}
                        question={data}
                        passDrinkAnimals={getDrinkAnimals}
                        setUserDrinkStatus={getUserDrinkStatus}
                        leader={leader}
                    />
                }
            </div>
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

            {gameStatus === 'ready' && <ReadyScreen players={players} round={round}/>}
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

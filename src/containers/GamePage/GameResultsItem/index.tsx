import React, {useEffect, useState} from 'react';
import {Avatar, AvatarGroup, Backdrop, Badge, Box, CircularProgress} from "@mui/material";
import {Result} from "../index";
import style from "../style.module.css";
import Button from "../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import {SelectUserLetter, SelectUserRoom} from "../../../redux/store/socket/selector";
import {getAnimalByLetter} from "../../../helpers/animalHelp";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import resultSound from "../../../assets/sounds/results.mp3";

import likeOff from "../assets/like-off.png";
import likeOn from "../assets/like-on.png";
import dislikeOff from "../assets/dislike-off.png";
import dislikeOn from "../assets/dislike-on.png";
import votesApi from "../../../api/votes/votes.api";
import {SelectIsAuthorized, SelectUser} from "../../../redux/store/user/selector";
import {setUserVotes} from "../../../redux/store/user/slice";
import {SelectIsSoundMuted} from "../../../redux/store/game/selector";
import {setError} from "../../../redux/store/game/slice";
import LoginRequired from "../../../components/LoginRequired";

const GameResultItem = (d: { result: Result, question: { question_id: number; question: string; answers: string[] }, passDrinkAnimals: any, setUserDrinkStatus: any, leader: string; voted: any; }) => {
    const dispatch = useDispatch();
    const user = useSelector(SelectUser);
    const userLetter = useSelector(SelectUserLetter);
    const userRoom = useSelector(SelectUserRoom);
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const [isModalOpened, setModalOpened] = useState(false);
    const isAuthorized = useSelector(SelectIsAuthorized);
    const [isLoading, setIsLoading] = useState(false);
    const [resultSoundLoad, setResultSoundLoad] = useState(false)
    const [userReaction, setUserReaction] = useState('')
    const [playResult] = useSound(resultSound, {
        onload: () => setResultSoundLoad(true),
        volume: isSoundMuted ? 0 : 1
    });
    useEffect(() => {
        if (resultSoundLoad) {
            playResult();
        }
    }, [resultSoundLoad])


    useEffect(() => {
        if(['like', 'dislike'].includes(d.voted))
        {
            console.log(d.voted)
            setUserReaction(d.voted);
        }
    }, [d.voted])

    const [correct, setCorrect] = useState(-1);
    useEffect(() => {
        setCorrect(d.result.correct);
    }, [d.result])

    const isDrinking = () => {
        playButton();
        if(userRoom.single)
        {
            const whoDrinking = d.result.results.filter(r=>!r.answer.isCorrect);
            d.passDrinkAnimals(whoDrinking);
        }
        else {
            const status = d.result.results.filter(p=>p.player === userLetter)[0].answer.isCorrect;
            if (status) {
                d.setUserDrinkStatus('You not drinking!', false);
            } else {
                d.setUserDrinkStatus('You drinking!', true);
            }

        }

    }

    const handleLikeDislike = async (type: "like" | "dislike") => {
        if(isAuthorized)
        {
            setIsLoading(true);
            votesApi.vote({question_id: d.question.question_id, vote_type: type})
                .then(res => {
                    let votes = Array.from(user.voteList);
                    const vote = votes.findIndex(v=>v.questionsid === d.question.question_id);
                    if(vote !== -1)
                    {
                        votes[vote] = res;
                        dispatch(setUserVotes({userVotes: votes}));
                    }
                    else
                        dispatch(setUserVotes({userVotes: [...votes, res]}));

                    setUserReaction(type);
                })
                .catch(err => {
                    console.log(err)
                    dispatch(setError(err.response.data.message.join(", ")));
                }).finally(() => setIsLoading(false));
        }
        else
        {
            setModalOpened(true)
        }
    }

    const getListVoted = (variant: number, size: number) => {
        return (
            <AvatarGroup max={4}>
                {d.result.results
                    .filter(r => r.answer.variant === variant)
                    .filter(l => l.player !== d.leader)
                    .map(a => <Avatar key={a.player} src={getAnimalByLetter(a.player ?? "")} alt={'animal-img'} sx={{ width: size, height: size }}/>)}
            </AvatarGroup>
        )
    }

    const switchUserReaction = (reaction: string) => {
        playButton();
        if (userReaction === reaction) {
            setUserReaction('')
        } else {
            setUserReaction(reaction)
        }
    }


    if(d.result.results.length > 0)
    return (
        <Box className={style.results}>
            <Backdrop open={isLoading}>
                <CircularProgress/>
            </Backdrop>
            {isModalOpened && <LoginRequired onClose={()=>setModalOpened(false)}/>}
            <Box className={style.players_list}>
                <Box className={style.answers}>
                    <Box className={style.content}>
                        {d.question.answers.map((a, i) =>
                            <div key={i} className="button-wrapper" style={{ width: '100%' }}>
                                <div className="avatars-wrapper size-big">
                                    {getListVoted(i, 40)}
                                </div>
                                <div className="avatars-wrapper size-med">
                                    {getListVoted(i, 30)}
                                </div>
                                <div className="avatars-wrapper size-small">
                                    {getListVoted(i, 20)}
                                </div>
                                <Button className={correct === i ? 'cloud correct' : 'cloud incorrect'}>
                                    {a}
                                </Button>
                            </div>
                        )}
                        <div className="button-wrapper" style={{ width: '100%' }}>
                            <div className="avatars-wrapper size-big">
                                {getListVoted(-1, 40)}
                            </div>
                            <div className="avatars-wrapper size-med">
                                {getListVoted(-1, 30)}
                            </div>
                            <div className="avatars-wrapper size-small">
                                {getListVoted(-1, 20)}
                            </div>
                            <Button className={correct === -1 ? 'cloud correct' : 'cloud incorrect'}>
                                skip (drink)
                            </Button>
                        </div>
                    </Box>
                </Box>
            </Box>
            <Box className={style.result_buttons}>
                {d.voted !== 'report' && <Box className={style.reaction_block}>
                    <img
                        src={userReaction === 'dislike' ? dislikeOn : dislikeOff}
                        alt=""
                        onClick={() => handleLikeDislike('dislike')}
                    />
                    <img
                        src={userReaction === 'like' ? likeOn : likeOff}
                        alt=""
                        onClick={() => handleLikeDislike('like')}
                    />
                </Box>}
                <Button onClick={() => isDrinking()} className={style.drink_button}>Continue</Button>
            </Box>
        </Box>
    );
    else
        return <Box></Box>
};

export default GameResultItem;

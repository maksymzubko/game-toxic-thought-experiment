import React, {useEffect, useState} from 'react';
import votesApi from "../../../api/votes/votes.api";
import {setUserVotes} from "../../../redux/store/user/slice";
import {setError} from "../../../redux/store/game/slice";
import './styles.css';
import Button from "../../../components/Button";
import imageSource from '../../../components/Animals/assets/color/tiger-1.png';
import {useDispatch, useSelector} from "react-redux";
import {SelectIsSoundMuted} from "../../../redux/store/game/selector";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import {SelectUser} from "../../../redux/store/user/selector";
import {Backdrop, Box, CircularProgress} from "@mui/material";
import dislikeOn from "../assets/dislike-on.png";
import dislikeOff from "../assets/dislike-off.png";
import likeOn from "../assets/like-on.png";
import likeOff from "../assets/like-off.png";

const Evaluate = (d: {question: { question_id: number; question: string; answers: string[] }, changeGameStatus: any, voted: any}) => {

    const dispatch = useDispatch();
    const user = useSelector(SelectUser);

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });
    const [isLoading, setIsLoading] = useState(false);
    const [userReaction, setUserReaction] = useState('')

    const handleLikeDislike = async (type: "like" | "dislike") => {
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
                d.changeGameStatus()
            })
            .catch(err => {
                console.log(err)
                dispatch(setError(err.response.data.message.join(", ")));
            }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if(['like', 'dislike'].includes(d.voted))
        {
            console.log(d.voted)
            setUserReaction(d.voted);
        }
    }, [d.voted])

    return (
        <div className="evaluate">
            <Backdrop open={isLoading}>
                <CircularProgress/>
            </Backdrop>
            <h1>did you like this question?</h1>
            <Box className="reaction_block">
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
            </Box>
            <div className="img-wrapper">
                <img src={imageSource} alt="" className="animal-img-big"/>
            </div>
            <Button onClick={() => {playButton(); d.changeGameStatus()}} className="continue-button-2">Skip</Button>
        </div>
    );
};

export default Evaluate;

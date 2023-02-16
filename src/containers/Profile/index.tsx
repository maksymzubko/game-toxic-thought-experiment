import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {links} from "../../router";
import {useNavigate} from "react-router-dom";
import {Backdrop, CircularProgress} from "@mui/material";

import profileApi from "../../api/profile/profile.api";
import {setAuthorized, setUser} from "../../redux/store/user/slice";

import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";

import './style.css'
import addQuestionImg from './assets/addQuestion.png';
import logoutImg from './assets/logout.png';
import backArrow from "../../assets/back-arrow.png";
import delIcon from "./assets/delIcon.png";
import crossIcon from "./assets/cross-icon.png";
import sadDogImg from './assets/dog-sad.png'
import deerImg from '../../components/Animals/assets/color/deer-1.png'
import {SelectIsSoundMuted} from "../../redux/store/game/selector";
import {SelectUser} from "../../redux/store/user/selector";


const Profile = () => {

    const goto = useNavigate();
    const dispatch = useDispatch();
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const user = useSelector(SelectUser);
    const [currentStage, setCurrentStage] = useState<'list' | 'details' | 'edit'>('list');
    const [selectedQuestion, setSelectedQuestion] = useState({id: null, question: '', answers: ['', '', '',''], language: 'en'});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questionList, setQuestionList] = useState([])
    const [allFieldsAreFiled, setAllFieldsAreFiled] = useState(false)
    const [freezeScreen, setFreezeScreen] = useState(true);


    const logout = () => {
        playButton();
        localStorage.removeItem('18plus_token');
        dispatch(setAuthorized({isAuthorized: false}));
        dispatch(setUser({user: null}));
        goto(links.start);
    }

    const goBack = () => {
        playButton();
        if (currentStage === 'list') {
            goto(links.start)
        } else {
            setCurrentStage('list')
            setSelectedQuestion({id: null, question: '', answers: ['', '', '',''], language: 'en'})
        }

    }

    const editQuestion = () => {
        playButton();
        setCurrentStage('edit');
    }

    const showDetails = (question: any) => {
        playButton();
        setCurrentStage('details');
        setSelectedQuestion(question)
    }

    const checkLanguage = (question: string) => {
        const english = /^[A-Za-z0-9]*$/;
        // const japanese = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤ヶ]+/u; // does not work correct

        if (english.test(question)) {
            return 'en'
        } else {
            return 'jp'
        }
    }

    const saveQuestion = () => {

        const language = checkLanguage(selectedQuestion.question);

        if (selectedQuestion.id) {
            profileApi.editQuestion(
                selectedQuestion.id,
            {
                    question: selectedQuestion.question,
                    answers: selectedQuestion.answers,
                    language,
                })
                .then((res) => {
                    console.log('res', res)
                    goBack();
                }).catch((err) => {
                console.log('err', err.response.data)
            }).finally(() => setIsLoading(false));
        } else {
            profileApi.createQuestion({
                question: selectedQuestion.question,
                answers: selectedQuestion.answers,
                language,
            })
                .then((res) => {
                    console.log('res', res)
                    goBack();
                }).catch((err) => {
                console.log('err', err.response.data)
            }).finally(() => setIsLoading(false));
        }
    }

    const deleteQuestion = () => {
        profileApi.deleteQuestion(selectedQuestion.id)
            .then((res) => {
                console.log('res', res)
                setConfirmDelete(false);
                goBack();
            }).catch((err) => {
            console.log('err', err.response.data)
        }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (currentStage === 'list') {
            profileApi.getMineQuestionsList()
                .then((res) => {
                    console.log('res', res)
                    setQuestionList(res);
                }).catch((err) => {
                console.log('err', err.response.data)
            }).finally(()=> setIsLoading(false));
        }
    }, [currentStage]);

    useEffect(() => {
        if (selectedQuestion.question &&
            selectedQuestion.answers[0] &&
            selectedQuestion.answers[1] &&
            selectedQuestion.answers[2] &&
            selectedQuestion.answers[3]
        ) { setAllFieldsAreFiled(true)}
        else {setAllFieldsAreFiled(false)}

    }, [selectedQuestion]);


    useEffect(() => {
        setTimeout(()=> {
            setFreezeScreen(false);
        }, 300)
    }, []);


    return (
        <>
            <Backdrop open={isLoading} style={{zIndex: 30}}>
                <CircularProgress/>
            </Backdrop>
            {freezeScreen && <div className="freezeScreen"/>}
            <div className="profile">
                <p className="title">
                    <img src={backArrow} alt="" onClick={() => goBack()} />
                    profile
                </p>
                {currentStage === 'list' &&
                <>
                    <div className="user-block">
                        <img src={addQuestionImg} alt="" onClick={() => editQuestion()} style={{opacity: questionList.length ? 1 : 0}}/>
                        <p className="user-name">{user.username}</p>
                        <img src={logoutImg} alt="" onClick={() => logout()} />
                    </div>
                    {questionList.length ?
                        <div className="questions-list">
                            {questionList.map(item =>
                                <div className="list-item" onClick={() => showDetails(item)}>
                                    {item.question}
                                </div>
                            )}
                        </div>
                        :
                        <div className="empty-list">
                            <img src={deerImg} alt="" className="empty-img"/>
                            <p>you didn’t add any questions yet, go on and add some!</p>
                            <img src={addQuestionImg} alt="" onClick={() => editQuestion()} className="empty-add"/>
                        </div>
                    }

                </>
                }
                {currentStage === 'details' &&
                    <div className="details-block">
                        <p className="details-title">{selectedQuestion && selectedQuestion.question}</p>
                        <ul>
                            {selectedQuestion && selectedQuestion.answers.map(answer => <li>{answer}</li>)}
                        </ul>
                        <div className="details-buttons-block">
                            <img src={delIcon} alt="" onClick={() => {playButton(); setConfirmDelete(true)}} />
                            <div className="edit-button" onClick={() => editQuestion()}>edit</div>
                        </div>

                    </div>
                }
                {currentStage === 'edit' &&
                    <div className="edit-block">
                        <div className="edit-title-wrapper">
                            <textarea
                                value={selectedQuestion ? selectedQuestion.question : ''} placeholder="Your question"
                                onChange={e => setSelectedQuestion({...selectedQuestion, question: e.target.value})}
                            />
                        </div>
                        {selectedQuestion.answers.map((answer, index) =>
                            <div className="edit-answer-wrapper">
                                <input
                                    value={selectedQuestion ? selectedQuestion.answers[index]: ''}
                                    placeholder={`option ${index + 1}`}
                                    onChange={e => {
                                        const answerTemp = JSON.parse(JSON.stringify(selectedQuestion));
                                        answerTemp.answers[index] = e.target.value;
                                        setSelectedQuestion(answerTemp)
                                    }}
                                />
                            </div>
                        )}

                        <div
                            className="done-button"
                            onClick={() => {allFieldsAreFiled && saveQuestion()}}
                            style={{ opacity: allFieldsAreFiled ? 1 : 0.7 }}
                        >done</div>
                    </div>
                }
            </div>
            {confirmDelete &&
            <div className="confirm-delete">
                <div className="modal">
                    <img src={crossIcon} alt="" onClick={() => {playButton(); setConfirmDelete(false)}} className="close" />
                    <img src={sadDogImg} alt="" className="sad-dog"/>
                    <p>are you sure you want to delete this question</p>
                    <div className="delete-button" onClick={() => deleteQuestion()}>delete</div>
                </div>
            </div>
            }
        </>
    );
};

export default Profile;

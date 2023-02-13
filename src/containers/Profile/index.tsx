import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {links} from "../../router";
import {useNavigate} from "react-router-dom";

import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";

import './style.css'
import addQuestionImg from './assets/addQuestion.png';
import logoutImg from './assets/logout.png';
import backArrow from "../../assets/back-arrow.png";
import delIcon from "./assets/delIcon.png";
import crossIcon from "./assets/cross-icon.png";
import sadDogImg from './assets/dog-sad.png'

import { questionsExample } from './exampleData'
import {SelectIsSoundMuted} from "../../redux/store/game/selector";

const Profile = () => {

    const goto = useNavigate();
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const [currentStage, setCurrentStage] = useState<'list' | 'details' | 'edit'>('list');
    const [selectedQuestion, setSelectedQuestion] = useState({id: null, title: '', answers: ['', '', '','']});
    const [confirmDelete, setConfirmDelete] = useState(false);


    const logout = () => {
        playButton();
        // log out from account

        goto(links.start);
    }

    const goBack = () => {
        playButton();
        if (currentStage === 'list') {
            goto(links.start)
        } else {
            setCurrentStage('list')
            setSelectedQuestion({id: null, title: '', answers: ['', '', '','']})
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

    const saveQuestion = () => {
        //send question to server

        goBack();
    }

    const deleteQuestion = () => {
        //send id of question to server for deleting
        setConfirmDelete(false);
        goBack();
    }

    return (
        <>
            <div className="profile">
                <p className="title">
                    <img src={backArrow} alt="" onClick={() => goBack()} />
                    profile
                </p>
                {currentStage === 'list' &&
                    <>
                        <div className="user-block">
                            <img src={addQuestionImg} alt="" onClick={() => editQuestion()}/>
                            <p className="user-name">User Name</p>
                            <img src={logoutImg} alt="" onClick={() => logout()} />
                        </div>
                        <div className="questions-list">
                            {questionsExample.map(item =>
                                <div className="list-item" onClick={() => showDetails(item)}>
                                    {item.title}
                                </div>
                            )}
                        </div>
                    </>
                }
                {currentStage === 'details' &&
                    <div className="details-block">
                        <p className="details-title">{selectedQuestion && selectedQuestion.title}</p>
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
                                value={selectedQuestion ? selectedQuestion.title : ''} placeholder="Your question"
                                onChange={e => setSelectedQuestion({...selectedQuestion, title: e.target.value})}
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

                        <div className="done-button" onClick={() => saveQuestion()}>done</div>
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

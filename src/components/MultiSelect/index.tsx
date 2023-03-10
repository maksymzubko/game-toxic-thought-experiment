import React, {useEffect, useRef, useState} from 'react';
import './style.css'
import checkboxOff from './assets/checkbox-off.svg';
import checkboxOn from './assets/checkbox-on.svg';
import plusButton from './assets/plus-button.svg';

const MultiSelect = (
    {
        answersList,
        passActiveQuestions
    } : {
        answersList: string[]
        passActiveQuestions: any,
    }
) => {

    const [currentIndex, setCurrentIndex] = useState(1);
    const [combinedList, setCombinedList] = useState([]);
    const combinedListRef = useRef([]);
    const [showCustomField, setShowCustomField] = useState(false);
    const [customQuestionIsActive, setCustomQuestionIsActive] = useState(true)
    const [customQuestionText, setCustomQuestionText] = useState('')

    useEffect(() => {
        if (answersList.length && !combinedList.length) {
            let combinedListTemp: any[] = [];
            answersList.forEach((item, index) => {
                combinedListTemp.push({answer: item, active: false});
            })
            setCombinedList(combinedListTemp);
        }

    }, [answersList]);


    const getClass = (index: number): string => {
        if (index === currentIndex - 1) return 'prev'
        if (index === currentIndex + 1) return 'next'
        if (index === currentIndex - 2) return 'prev2'
        if (index === currentIndex + 2) return 'next2'
        if (index === currentIndex) return 'show'
        return ''
    }

    const handleAnswerClick = (index: number) => {
        if (index === currentIndex - 1) setCurrentIndex(currentIndex - 1);
        if (index === currentIndex + 1) setCurrentIndex(currentIndex + 1);
        if (index === currentIndex) {
            combinedListRef.current = JSON.parse(JSON.stringify(combinedList));
            combinedListRef.current[index].active = !combinedListRef.current[index].active
            setCombinedList(combinedListRef.current);

            let activeQuestions = combinedListRef.current.filter(item => item.active).map(item => item.answer);
            if (customQuestionIsActive && customQuestionText.length) {
                activeQuestions = [...activeQuestions, customQuestionText]
            }
            passActiveQuestions(activeQuestions)
        }
    }

    const handleTextareaChange = (value: string) => {
        setCustomQuestionText(value);
        let activeQuestions = combinedList.filter(item => item.active).map(item => item.answer);
        if (customQuestionIsActive) {
            if (value.length){
                passActiveQuestions([...activeQuestions, value]);
            } else {
                passActiveQuestions(activeQuestions);
            }
        }
    }

    const handleCheckboxClick = () => {
        if (customQuestionText.length) {
            setCustomQuestionIsActive(!customQuestionIsActive);
            let activeQuestions = combinedList.filter(item => item.active).map(item => item.answer);
            if (customQuestionIsActive) {
                passActiveQuestions(activeQuestions);
            } else{
                passActiveQuestions([...activeQuestions, customQuestionText]);
            }
        }

    }

    return (
        <div className="multi-select">
            <p className="title">choose the answers</p>
            <div className="list-container">
                <div className="answer-container">
                    {
                        combinedList.length && combinedList.map((item, index) =>
                            <div
                                className={getClass(index) + ' answer'}
                                onClick={() => handleAnswerClick(index)}
                            >
                                <p>{item.answer}</p>
                                <img src={item.active ? checkboxOn : checkboxOff} alt="" />
                            </div>)
                    }
                </div>
            </div>
            <div className="custom-answer">
                {showCustomField ?
                    <div className="custom-answer-wrapper">
                        <div className="answer-field-wrapper">
                                <textarea
                                    placeholder="Your Answer"
                                    value={customQuestionText ? customQuestionText : ''}
                                    onChange={e => handleTextareaChange(e.target.value)}
                                />
                        </div>
                        <img src={(customQuestionIsActive && customQuestionText.length)  ? checkboxOn : checkboxOff} alt="" onClick={handleCheckboxClick} />
                    </div>
                    :
                    <img src={plusButton} alt="" onClick={() => setShowCustomField(true)} />
                }
            </div>

        </div>
    );
};

export default MultiSelect;

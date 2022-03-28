import WordleGameProps from "../model/WordleGameProps"
import WordleLineModel from "../model/WordleLineModel";
import WordleLine from "./WordleLine"
import ThemeContext from "../utils/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { json } from "stream/consumers";
import { Fragment } from "react";
import { randomInt } from "crypto";
export default function WordleGame(props:WordleGameProps) {
    let [themeContext,SetThemeContext] = useContext(ThemeContext);
    let [wordState,SetWordState] = useState("")
    let [game,SetGame] = useState([<Fragment key={"a"}></Fragment>]);
    let [propsState,SetProps]= useState(props)
    let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    function emptyLine(length:Number):WordleLineModel{
        let wordleLine :WordleLineModel = {
            line :[]
        }
        for(let i=0;i<length;i++){
            wordleLine.line.push({correct:0,letter:""})
        }
        return wordleLine;
    }
    function CorrectWord(word:String){
        let chararray = word.split("")
        let words :WordleLineModel={line: chararray.map(x=>{
            let word = {letter:x,
                correct:2}
            return word
        })}
        return words
    }
    function GuessWord(word:String){
        let chararray = word.split("")
        let words :WordleLineModel={line: chararray.map(x=>{
            let word = {letter:x,
                correct:0}
            return word
        })}
        return words
    }
    function WordleLineVariantFactory(index:number){
        let WordleLineVariant={
            initial:{
                x: index%2==0?"-100vw":"100vw"
            },
            animate:{
                x:0,
                transition:{
                    duration:0.5,
                    type:"Tween"
                }
            }
        }
        return WordleLineVariant
    }
    
    function CreateGameArray(input:WordleGameProps){
        let arr :JSX.Element[]= []
        let i =0
        for(;i< input.WordleGame.MaxTries;i++){
            if(input.WordleGame.WrongTries[i]){
                arr.push(
                        <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block" key={i}>
                            <WordleLine length={input.WordleGame.WordLength} word={input.WordleGame.WrongTries[i]}></WordleLine>
                        </motion.div>
                    )
            }
            else if(input.WordleGame.CorrectWord.name!=""){
                arr.push(
                        <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block" key={i}>
                            <WordleLine length={input.WordleGame.WordLength} word={(CorrectWord(input.WordleGame.CorrectWord.name))} ></WordleLine>
                        </motion.div>
                    )
            }   
            else{
                arr.push(
                        <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block" key={i}>
                            <WordleLine length={input.WordleGame.WordLength} word={emptyLine(input.WordleGame.WordLength)}></WordleLine>
                        </motion.div>
                    )
            }

        }
        arr.push(
                <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block" key={i}>
                    <WordleLine length={input.WordleGame.WordLength} word={GuessWord(wordState)}/>
                </motion.div>
            )
        return arr;
    }
    let SetKeyPress = (input) => {
        if(input == '{bksp}'){
            SetWordState(wordState.slice(0, wordState.length - 1))
        }
        else if(input =='{enter}'){
            Guess(wordState)
            SetWordState("")
        }
        else if(wordState.length!=propsState.WordleGame.WordLength){
            SetWordState(wordState+input)
        }
        
    }
    global.onkeydown = (event)=>{
        console.log(event.key)
        if(event.key=='Backspace')
            SetKeyPress("{bksp}")
        else if(event.key=="Enter"){
            SetKeyPress("{enter}")
        }
        else if(alphabet.find(x=>x==event.key)){
            SetKeyPress(event.key)
        }
    }
    function Guess(word:String){
        //TODO: this is the money shot, this method calls the api and does the guess
        //TODO: implement notification if the word is not the correct length
        if(word.length == propsState.WordleGame.MaxTries){
            propsState.WordleGame.WrongTries.push({
                line:word.split("").map(element => {
                    return {letter:element,correct:0}
                })});
            SetProps(propsState)
        }
        else{
            
        }
    }
    useEffect(()=>{
        SetGame(CreateGameArray(propsState))
    },[])
    useEffect(()=>{
        SetGame(CreateGameArray(propsState))
    },[wordState])
    useEffect(()=>{
        SetProps(props)
        SetGame(CreateGameArray(props))
    },[props])
    return (
        <div className="h-100 d-flex flex-column justify-content-start align-items-center" >
            <div className={`w-75 d-flex flex-column  bg-${themeContext.PrimaryColor} text-white`}>
                {game}
                <Keyboard 
                    layout={{default : [
                            'q w e r t y u i o p {bksp}',
                             ' a s d f g h j k l {enter} ',
                              '  z x c v b n m  ',
                                ' {space} '
                        ]}}
                    buttonTheme={ [
                        {
                            class: "invisible",
                            buttons: " "
                        }]}    
                    theme={`bg-${themeContext.PrimaryColor} react-simple-keyboard simple-keyboard hg-theme-default hg-layout-default text-dark`}
                    onKeyPress={SetKeyPress}/>
            </div>
        </div>
    )
}
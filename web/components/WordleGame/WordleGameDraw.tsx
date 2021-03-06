import { INSPECT_MAX_BYTES } from "buffer";
import { motion } from "framer-motion";
import { useContext } from "react";
import Keyboard from "react-simple-keyboard";
import WordleGameProps from "../../model/WordleGameProps";
import WordleLineModel from "../../model/WordleLineModel";
import ThemeContext from "../../utils/ThemeContext";
import WordleLine from "../WordleLine";
export function GenerateKeyboard(SetKeyPress:Function){
    let [themeContext,SetThemeContext] = useContext(ThemeContext);
    return (<Keyboard 
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
        onKeyPress={SetKeyPress}/>)
}

export function emptyLine(length:Number):WordleLineModel{
    let wordleLine :WordleLineModel = {
        Word :[]
    }
    for(let i=0;i<length;i++){
        wordleLine.Word.push({correct:0,letter:""})
    }
    return wordleLine;
}
export function CorrectWord(word:string,length:number){
    let chararray = convertToLineModel(word,length);
    let words :WordleLineModel={Word: chararray.map(x=>{
        let word = {letter:x==""?"":x,
            correct:2}
        return word
    })}
    return words
}
export function GuessWord(word:string,length:number){
    let chararray = convertToLineModel(word,length);
    let words :WordleLineModel={Word: chararray.map(x=>{
        let word = {letter:x==""?"":x,
            correct:0}
            return word
        })}
        return words
    }
function convertToLineModel(word:string,length:number){
    let chararray = word.split("")
    let res:string[]=[];
    for(let i =0;i<length;i++){
        res.push(word[i] ? word[i]:"");
    }
    return chararray
}

export function WordleLineVariantFactory(index:number){
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

export function CreateGameArray(input:WordleGameProps,wordState:string){
    let arr :JSX.Element[]= []
    let correctawnserDrawn:boolean=false;
    for(let i =0;i<input.WordleGame.MaxTries;i++){
        console.log(!!input.WordleGame.WrongTries[i])
        if(!!input.WordleGame.WrongTries[i]){
            arr.push(
                    <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inword-block" key={i}>
                        <WordleLine length={input.WordleGame.WordLength} word={input.WordleGame.WrongTries[i]}></WordleLine>
                    </motion.div>
                )
        }
        else if(input.WordleGame.Finished&& input.WordleGame.Won&&!correctawnserDrawn){
            //TODO: Implement call for modal when game is finished
            arr.push(
                    <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block w-100" key={i}>
                        <WordleLine length={input.WordleGame.WordLength} word={CorrectWord(input.WordleGame.CorrectWord.name,input.WordleGame.WordLength)}/>
                    </motion.div>
                )
            correctawnserDrawn=true
        }
        else if(i==input.WordleGame.MaxTries-1&&!input.WordleGame.Finished){
            
            arr.push(
                <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inline-block" key={i}>
                    <WordleLine length={input.WordleGame.WordLength} word={GuessWord(wordState,input.WordleGame.WordLength)}/>
                </motion.div>
            )
        }
        else{
            arr.push(
                    <motion.div variants={WordleLineVariantFactory(i)} initial="initial" animate="animate" className="d-inword-block" key={i}>
                        <WordleLine length={input.WordleGame.WordLength} word={emptyLine(input.WordleGame.WordLength)}></WordleLine>
                    </motion.div>
                )
        }       
    }

    return arr;
}
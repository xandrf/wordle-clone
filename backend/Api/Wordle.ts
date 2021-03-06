import { Request,Response } from "express"
import mongo from "mongoose";
import {GetWords,ValidateWord} from "../utils/DictionaryApi";
import WordleUser from "../model/WordleUser";
import Game from "../model/Game";
import CorrectWord from "../model/CorrectWord"
import WrongTry from "../model/WrongTry";
import WrongLetter from "../model/WrongLetter";
export async function WordleTryQuestion(req:Request,res:Response,next){
    let bodyvalues = {...req.body}
    const db : mongo.Model<WordleUser> = req.app["db"]; 
    let response;
    if(bodyvalues.UserName){
        response = await db.findOne({UserName: bodyvalues.UserName})
    }
    else if(bodyvalues.id){
        response = await db.findOne({_id: bodyvalues.id})
    }
    let game : Game = response?.Games?.find(x=>+x._id==bodyvalues.gameid);
    if(game?.CorrectWord!= undefined){
        if(!game?.Finished&&!game.Won){
            if(game.WrongTries.length<=game.MaxTries){
                if(ValidateWordLength(bodyvalues.Guess,+game?.WordLength)){                   
                    if(await ValidateWord(bodyvalues.Guess)){
                        if(game?.CorrectWord.name == bodyvalues.Guess){
                            game.Finished=true;
                            game.Won=true;
                            response?.save()
                            let result :WrongTry = {Word:[...game?.CorrectWord.name].map(x=>{return { letter:x,correct:2}}),Finished:true,Won:true} ;
                            res.json(result)
                            console.log(result)
                        }
                        else if(game?.WrongTries.length+1 == game?.MaxTries){
                            game.Finished=true;
                            game.Won=false
                            let words:WrongTry= SortWords(bodyvalues.Guess,game?.CorrectWord.name!,true)
                            console.log(words)
                            game?.WrongTries.push(words)
                            response?.save()
                            res.json(words)
                        }
                        else{
                            
                            let words :WrongTry= SortWords(bodyvalues.Guess,game?.CorrectWord.name!,false)
                            console.log(words)
                            game?.WrongTries.push(words)
                            response?.save()
                            res.json(words)
                        }
                    }
                    else{
                        res.status(401).send("Incorrect Word")
                    }
                }
                else{
                    res.status(401).send(`Incorrect Length, correct Length is ${game?.WordLength}`)
                }
            }
            else{
                res.status(401).send("Game Finished: too many wrong tries")
            }
        }
        else{
            res.status(401).send("Game Finished: Correct Awnser")
        }
    }
    else{
        res.status(401).send("Game not found")
    }
}

export async function InsertWordleGame(req:Request,res:Response,next){
    let bodyvalues = req.body;
    const db : mongo.Model<WordleUser> = req.app["db"]; 
    let response;
    if(bodyvalues.UserName){
        response = await db.findOne({UserName: bodyvalues.UserName})
    }
    else{
        response = await db.findOne({_id: bodyvalues.id})
    }
    if(response != null){
        const correctWord :CorrectWord= await GetWords(bodyvalues.WordLength)
        let game :Game= { 
            _id:response?.Games?.length!,
            CorrectWord:correctWord,
            MaxTries : bodyvalues.MaxTries,
            WordLength : bodyvalues.WordLength,
            WrongTries : [],
            Finished:false,
            Won:false
        }
        response?.Games?.push(game);
        response?.save();
        correctWord.name="";
        res.send(game)
    }
    else{
        res.status(401).send("ERROR")
    }
}
export async function GetWordleGame(req:Request,res:Response,next){    
    const db : mongo.Model<WordleUser> = req.app["db"]; 
    if(ValidateSearch(req.headers)&&req.headers!=undefined){
        let result = await db.findOne({_id:req.headers.id})
        let game = result?.Games?.find(x=>x._id==+req.headers.gameid!)
        if(game&&!game?.Finished){
            game.CorrectWord.name=""
            res.json(game);
        }
        else if(game){
            res.json(game);
        }
        else{
            res.status(401).send("ERROR: Game not found")
        }
        
    }
    else{
        res.status(401).send("ERROR: Invalid props")
    }
}
function ValidateSearch(props){
    return props && props.id && props.gameid
}
function SortWords(phrase: String,correctPhrase:String,Finished:boolean){
    let unsortedPhrase= [...phrase];
    let unsortedCorrectPhrase= [...correctPhrase];
    let word :WrongTry= { Word:unsortedPhrase.map<WrongLetter>(char=>{
        if(unsortedCorrectPhrase.find(cchar=>cchar==char)){
            if(SameWordMatchingIndex(unsortedPhrase,unsortedCorrectPhrase)){
                return { letter:char,correct:2};
            }
            return { letter:char,correct:1};
        }
        return { letter:char,correct:0};
    }),Finished,Won:false}
    return word
}
function SameWordMatchingIndex(phrase,correctPhrase){
    for(let c=0;c<phrase.length;c++){
        if(phrase[c]==correctPhrase[c]){
            return true;
        }
    }
    return false;
}
function RemoveFromArray(cchar, phrase){
    let arr :string[]= [];
    for(let c in phrase){
        if(c==phrase){
            cchar=null;
        }
        else{
            arr.push(c);
        }
    }
    return arr;
}
function ValidateWordLength(word:String,length:number){
    return word.length==length;
}
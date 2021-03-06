import WordleGameProps from "./WordleGameProps"

let obj :WordleGameProps = {
GameId:0,
PlayerId:"",
WordleGame:{
    CorrectWord:{
        name:"yacht",
        relation:""
    },
    Finished:true,
    Won:true,
    MaxTries:5,
    WordLength:5,
    WrongTries:[
        {
            Word:[
                {correct:2,letter:"y"},
                {correct:0,letter:"e"},
                {correct:0,letter:"m"},
                {correct:0,letter:"e"},
                {correct:0,letter:"n"}
            ]
        },
        {
            Word:[
                {correct:2,letter:"y"},
                {correct:0,letter:"o"},
                {correct:0,letter:"i"},
                {correct:0,letter:"n"},
                {correct:0,letter:"k"}
            ]
        },
        {
            Word:[
                {correct:1,letter:"t"},
                {correct:0,letter:"o"},
                {correct:0,letter:"r"},
                {correct:1,letter:"c"},
                {correct:1,letter:"h"}
            ]
        },
        {
            Word:[
                {correct:0,letter:"l"},
                {correct:0,letter:"u"},
                {correct:0,letter:"n"},
                {correct:1,letter:"c"},
                {correct:1,letter:"h"}
            ]
        },
    ]
    },
    getGameData:()=>{return}
}
export default obj
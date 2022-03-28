import WordleLineModel from "./WordleLineModel"

export default interface WordleGameProps{
    WordleGame:{
        CorrectWord: {
            name: string,
            relation: string
        },
        WordLength: number,
        MaxTries: number,
        Finished: Boolean,
        WrongTries: WordleLineModel[]
    }   
    GameId:number,
    PlayerId:string

}

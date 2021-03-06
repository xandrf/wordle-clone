import { useContext, useState } from "react";
import { Form, Nav } from "react-bootstrap";
import Styles from "../styles/Login.module.css"
import ThemeContext from "../utils/ThemeContext";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import Router from 'next/router'
import WordleGame from "../components/WordleGame/WordleGame";
import { CreateGameArray } from "../components/WordleGame/WordleGameDraw";
import WordleSampleGame from "../model/WordleSampleGame";
export default function Login(){
    let [themeContext,setThemeContext] = useContext(ThemeContext)
    let [username,SetUsername] = useState("");
    let [password,Setpassword] = useState("");
    function handleSubmit(e:any){
        e.preventDefault();
        let formjson = {
            UserName:username,
            Password:password
        }
        axios.post("http://localhost:8000/login",formjson,{
            headers: {
                'Content-Type': 'application/json'
              },
        }).then(obj=>
            {
                localStorage.setItem("token",obj.data)
                Router.push("/")
            }
            ,err=>{
                //TODO: implement modal
                console.log(err)
            })
        
    }
    return (    
        <div className=" d-inline-flex justify-content-center align-items-center h-100 w-100" >
            <div className=" d-inline-flex justify-content-center align-items-center h-25 text-align-top">
                <motion.div className={`bg-warning overflow ${Styles.mockgame}`} initial={{x:"-100vw"}} animate={{x:0}} transition={{ease: "easeIn",duration: 0.8,type:"tween"}} >
                    {CreateGameArray(
                        WordleSampleGame,"")}
                </motion.div>
                <motion.form initial={{x:"-100vw"}} animate={{x:0}} transition={{ease: "easeIn",duration: 0.8,type:"tween"}} onSubmit={handleSubmit} className={Styles.loginform +` border-secondary border-radius-20 d-flex justify-content-center
                        rounded bg-${themeContext.SecondaryColor=="dark"?"dark":"white"} 
                        text-${themeContext.PrimaryColor} `}>
                    <Form.Group className={Styles.LoginForm}>
                        <h2>Login</h2>
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={username}
                            onChange={x=>SetUsername(x.target.value)}
                            type="text"
                            placeholder="Username"/>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            value={password}
                            onChange={x=>Setpassword(x.target.value)} 
                            type="password"
                            placeholder="Password"/>
                        <Button type="submit"  className="mt-2 w-100">Login</Button>
                        Don't have an account <Link href="/Register">sign up</Link>
                    </Form.Group>
                </motion.form>
            </div>
        </div>
    )      
}
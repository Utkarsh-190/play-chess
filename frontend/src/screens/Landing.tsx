import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();

    return (
    <div className="m-auto pt-20 flex justify-center flex-wrap">
        <div className="mx-10">
            <img src={"/chessboard.png"} alt="chessboard" className="w-full max-w-96 border rounded"/>
        </div>
        <div className="min-w-80 w-2/5 text-white flex flex-col justify-center items-center">
            <div className="my-8 font-bold text-4xl text-center">Play chess online on #1 Site!</div>
            <div>
                <Button onClick={() => {navigate("/game")}}>
                    Play Online
                </Button>
            </div>
        </div>
    </div>)
}
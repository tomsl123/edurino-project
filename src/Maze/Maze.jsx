import './Maze.css'
import { Transition } from 'react-transition-group';
import {useRef, useState} from "react";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
};

function Maze(props) {

    console.log(prepareMazeArray())
    const [inProp, setInProp] = useState(props.initInProp);
    const nodeRef = useRef(null);

    setTimeout(() => {
        setInProp(true);
    }, 100)



    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
            {state => (
                <div className={'foxContainer'} ref={nodeRef} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>

                </div>
            )}
        </Transition>
    )
}

function prepareMazeArray() {
    const mazeArray = [];
    for (let i = 0; i < 7; i++) {
        mazeArray.push([]);
        for (let j = 0; j < 6; j++) {
            mazeArray[i].push(1);
        }
    }


    return mazeArray;
}

export default Maze

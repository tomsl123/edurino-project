import './Maze.css'
import {Transition} from 'react-transition-group';
import {createElement, useRef, useState} from "react";
import labyrinthos from "labyrinthos";

const opacityDuration = 300;

const defaultComponentStyle = {
    transition: `opacity ${opacityDuration}ms ease-in-out`,
    opacity: 0,
}

const componentTransitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
};

const answerTransitionStyles = {
    wrong: {
        entering: { backgroundColor: '#EB4040' },
        entered:  { backgroundColor: '#EB4040' },
        exiting:  { backgroundColor: '#FA9308' },
        exited:  { backgroundColor: '#FA9308' }
    },
    correct: {
        entering: { backgroundColor: '#51F254' },
        entered:  { backgroundColor: '#51F254' },
        exiting:  { backgroundColor: '#FA9308' },
        exited:  { backgroundColor: '#FA9308' }
    }
};

const maze = prepareMaze(6,7);
const endAndStartPoint = findFurthestPoints(maze);
const question = prepareQuestion()

function Maze(props) {
    const nodeRefComponent = useRef(null);
    const nodeRefAnswer1 = useRef(null);
    const nodeRefAnswer2 = useRef(null);
    const nodeRefAnswer3 = useRef(null);
    const [componentInProp, setComponentInProp] = useState(props.initInProp);
    const [answer1InProp, setAnswer1InProp] = useState(false);
    const [answer2InProp, setAnswer2InProp] = useState(false);
    const [answer3InProp, setAnswer3InProp] = useState(false);
    const [characterPos, setCharacterPos] = useState(endAndStartPoint[1]);

    setTimeout(() => {
        setComponentInProp(true);
    }, 100)

    function processCharacterMove(event) {
        let direction = 'none';
        if(event.type === 'click') {
            if(event.target.tagName === 'IMG') {
                direction = event.target.parentElement.id;
            }
            else {
                direction = event.target.id
            }
        }

        if(direction === 'up' && maze[characterPos[0]-1] !== undefined &&  maze[characterPos[0]-1][characterPos[1]] === 0) {
            setCharacterPos([characterPos[0]-1, characterPos[1]])
        }
        else if(direction === 'down' && maze[characterPos[0]+1] !== undefined && maze[characterPos[0]+1][characterPos[1]] === 0) {
            setCharacterPos([characterPos[0]+1, characterPos[1]])
        }
        else if(direction === 'left' && maze[characterPos[0]][characterPos[1]-1] === 0) {
            setCharacterPos([characterPos[0], characterPos[1]-1])
        }
        else if(direction === 'right' && maze[characterPos[0]][characterPos[1]+1] === 0) {
            setCharacterPos([characterPos[0], characterPos[1]+1])
        }
    }

    function processAnswer(event) {
        const questionIndex = question.answers.findIndex((answerObject) => {
            return  answerObject.answer === parseInt(event.target.innerText)
        });
        let colorTimeoutHandle = ()=>{};

        if(questionIndex === 0) {
            setAnswer1InProp(true);
            colorTimeoutHandle = () => setAnswer1InProp(false);
        }
        if(questionIndex === 1) {
            setAnswer2InProp(true);
            colorTimeoutHandle = () => setAnswer2InProp(false);
        }
        if(questionIndex === 2) {
            setAnswer3InProp(true);
            colorTimeoutHandle = () => setAnswer3InProp(false);
        }

        if(question.answers[questionIndex].type !== 'correct') {
            setTimeout(colorTimeoutHandle, 600);
        }
    }

    return (
        <div>
            <div className={'modal'}>
                <div className={'modal-head'}>
                    <div className={'avatar-container'}>
                        <img src={'img/robin-head.png'}/>
                    </div>
                    <div className={'question-text'}>
                        I need to find a number that fits in the empty space. Will you help?
                    </div>
                </div>
                <div className={'question-problem'}>
                    {question.sequence.join(', ')}
                </div>
                <div className={'question-buttons-container'}>
                    <Transition nodeRef={nodeRefAnswer1} in={answer1InProp} timeout={500}>
                        {state => (
                            <button onClick={processAnswer} style={answerTransitionStyles[question.answers[0].type][state]}>{question.answers[0].answer}</button>
                        )}
                    </Transition>
                    <Transition nodeRef={nodeRefAnswer2} in={answer2InProp} timeout={500}>
                        {state => (
                            <button onClick={processAnswer} style={answerTransitionStyles[question.answers[1].type][state]}>{question.answers[1].answer}</button>
                        )}
                    </Transition>
                    <Transition nodeRef={nodeRefAnswer3} in={answer3InProp} timeout={500}>
                        {state => (
                            <button onClick={processAnswer} style={answerTransitionStyles[question.answers[2].type][state]}>{question.answers[2].answer}</button>
                        )}
                    </Transition>
                </div>
            </div>
            <Transition nodeRef={nodeRefComponent} in={componentInProp} timeout={opacityDuration}>
                {state => (
                    <div className={'mazeContainer'} ref={nodeRefComponent} style={{
                        ...defaultComponentStyle,
                        ...componentTransitionStyles[state]
                    }}>
                        <div className={'header'}>

                        </div>
                        {renderMaze(characterPos)}
                        <div className={'buttons-container'}>
                            <button id={'left'} className={'button'} onClick={processCharacterMove}>
                                <img src={'img/left.svg'}/>
                            </button>
                            <button id={'up'} className={'button'} onClick={processCharacterMove}>
                                <img src={'img/up.svg'}/>
                            </button>
                            <button id={'right'} className={'button'} onClick={processCharacterMove}>
                                <img src={'img/right.svg'}/>
                            </button>
                            <button id={'down'} className={'button'} onClick={processCharacterMove}>
                                <img src={'img/down.svg'}/>
                            </button>
                        </div>
                    </div>
                )}
            </Transition>
        </div>

    )
}

function prepareMaze(width, height) {
    let map = new labyrinthos.TileMap({
        width: width,
        height: height
    });
    map.fill(1);
    labyrinthos.mazes.BinaryTree(map, {});

    let mazeArray = [];
    for (let i = 0; i < map.data.length; i++) {
        if(Number.isInteger(i / width)) {
            mazeArray.push([]);
        }
        mazeArray[Math.floor(i / width)].push(map.data[i]);
    }

    return mazeArray;
}

function findFurthestPoints(maze) {
    const rows = maze.length;
    const cols = maze[0].length;
    const visited = new Set();
    let maxDistance = 0;
    let startPoint = null;
    let endPoint = null;

    // Helper function to perform BFS
    function bfs(startX, startY) {
        const queue = [[startX, startY]];
        visited.add(`${startX},${startY}`);
        let distance = 0;

        while (queue.length > 0) {
            const size = queue.length;
            for (let i = 0; i < size; i++) {
                const [x, y] = queue.shift();
                if (distance > maxDistance) {
                    maxDistance = distance;
                    startPoint = [startX, startY];
                    endPoint = [x, y];
                }

                for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (
                        newX >= 0 &&
                        newX < rows &&
                        newY >= 0 &&
                        newY < cols &&
                        maze[newX][newY] === 0 &&
                        !visited.has(`${newX},${newY}`)
                    ) {
                        queue.push([newX, newY]);
                        visited.add(`${newX},${newY}`);
                    }
                }
            }
            distance++;
        }
    }

    // Perform BFS from each path point
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze[i][j] === 0 && !visited.has(`${i},${j}`)) {
                bfs(i, j);
            }
        }
    }

    return [startPoint, endPoint];
}

function renderMaze(characterPos) {
    const mazeSquares = [];
    const rowBreakStyle = {gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`};

    for (let row = 0; row < maze.length; row++) {
        for (let column = 0; column < maze[row].length; column++) {
            const id = `square_${row}_${column}`;
            const squareColorStyle = maze[row][column] === 1 ? 'wall' : 'path'

            mazeSquares.push(createElement('div', {id: id, key: id, className: `maze-square ${squareColorStyle}`}))
        }
    }

    return createElement('div', {className: 'maze', style: rowBreakStyle}, ...mazeSquares, renderCharacter(characterPos),);

}

function renderCharacter(characterPos) {
    characterPos[0] = maze.length - characterPos[0];

    const style = {
        position: 'relative',
        left: `${characterPos[1] * 10.5 + 0.5}rem`,
        top: `${characterPos[0] * -10.5 - 0.5}rem`
    }
    return createElement('img', {src: 'img/foxy-mirror.svg', id: 'character', key: 'character', style: style});
}

function prepareQuestion() {
    let sequence = [];

    const startNumber = Math.floor(Math.random() * 5)+1;
    const addNumber = Math.floor(Math.random() * 5)+1;

    for (let sequenceNumber = startNumber; sequenceNumber <= startNumber+addNumber*4 ; sequenceNumber+=addNumber) {
        sequence.push(sequenceNumber);
    }

    if(Math.random() < 0.5) {
        sequence = sequence.reverse();
    }

    const missingIndex = Math.floor(Math.random() * sequence.length)
    const answers = [
        {answer: 0, type: 'wrong'},
        {answer: Math.floor(Math.random() * 40)+80, type: 'wrong'},
        {answer: sequence[missingIndex], type: 'correct'}
    ];

    shuffle(answers);
    sequence[missingIndex] = '_';

    return {sequence, answers};
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export default Maze

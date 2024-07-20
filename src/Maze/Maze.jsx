import './Maze.css'
import { Transition } from 'react-transition-group';
import {createElement, useRef, useState} from "react";
import labyrinthos from "labyrinthos";

const opacityDuration = 300;
const moveDuration = 500;

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

const defaultCharacterStyle = {
    transition: `transform ${opacityDuration}ms ease-in-out`,
    position: 'absolute',
    bottom: 0,
    left: 0
}

const characterTransitionStyles = {
    up: {
        entering: {transform: `translateX(50px)`},
        entered: {transform: `translateX(0px)`},
        exiting: {transform: `translateX(0px)`},
        exited: {transform: `translateX(0px)`},
    },
    down: {
        entering: {transform: `translateX(50px)`},
        entered: {transform: `translateX(0px)`},
        exiting: {transform: `translateX(0px)`},
        exited: {transform: `translateX(0px)`},
    },
    left: {
        entering: {transform: `translateX(50px)`},
        entered: {transform: `translateX(0px)`},
        exiting: {transform: `translateX(0px)`},
        exited: {transform: `translateX(0px)`},
    },
    right: {
        entering: {transform: `translateX(50px)`},
        entered: {transform: `translateX(0px)`},
        exiting: {transform: `translateX(0px)`},
        exited: {transform: `translateX(0px)`},
    },
}

const maze = prepareMaze(6,7);
const endAndStartPoint = findFurthestPoints(maze);

function Maze(props) {
    const nodeRefComponent = useRef(null);
    const [componentInProp, setComponentInProp] = useState(props.initInProp);
    const [characterInProp, setCharacterInProp] = useState(false);
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

    return (
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
    const character = createElement('img', {src: 'img/foxy-mirror.svg', id: 'character', key: 'character', style: style});
    return character;
}

export default Maze

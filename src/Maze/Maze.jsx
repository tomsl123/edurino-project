import './Maze.css'
import { Transition } from 'react-transition-group';
import {createElement, useRef, useState} from "react";
import labyrinthos from "labyrinthos";

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

const maze = prepareMaze(6,7);
const endAndStartPoint = findFurthestPoints(maze);

function Maze(props) {
    const nodeRef = useRef(null);
    const [inProp, setInProp] = useState(props.initInProp);
    const [characterPos, setCharacterPos] = useState(endAndStartPoint[1]);

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
                    {renderMaze(maze)}
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

function renderMaze(maze) {
    const mazeSquares = [];
    const rowBreakStyle = {gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`};

    for (let row = 0; row < maze.length; row++) {
        for (let column = 0; column < maze[row].length; column++) {
            const id = `square_${row}_${column}`;
            const squareColorStyle = maze[row][column] === 1 ? 'wall' : 'path'

            mazeSquares.push(createElement('div', {id: id, key: id, className: `maze-square ${squareColorStyle}`}))
        }
    }

    return createElement('div', {className: 'maze', style: rowBreakStyle}, mazeSquares);

}

export default Maze

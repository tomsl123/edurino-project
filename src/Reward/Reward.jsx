import './Reward.css'
import { Transition } from 'react-transition-group';
import {useRef, useState} from "react";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 1,
}

const transitionStyles = {
    entering: { opacity: 0 },
    entered:  { opacity: 0 },
    exiting:  { opacity: 1 },
    exited:  { opacity: 1 },
};

function Home() {

    const [inProp, setInProp] = useState(true);

    const nodeRef = useRef(null);

    setTimeout(() => {
        setInProp(false);
    }, 100)

    return (
        <div>
            <div className={'header'}>
                <img src={'img/logo.png'}/>
            </div>
            <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
                {state => (
                    <div className={'rewardContainer'} ref={nodeRef} style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                        <img className={'rewardFox'} src={'img/foxy.svg'}/>
                        <img className={'treasure'} src={'img/treasure-big.png'}/>
                        <img className={'downShape'} src={'img/shape-welcome.svg'}/>
                    </div>
                )}
            </Transition>
        </div>
    )
}

export default Home

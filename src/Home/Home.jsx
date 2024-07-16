import './Home.css'
import { Transition } from 'react-transition-group';
import {useRef, useState} from "react";
import {useLocation} from "wouter";

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

    const [inProp, setInProp] = useState(false);
    const [location, setLocation] = useLocation();

    const nodeRef = useRef(null);

    function transitionPage() {
        setInProp(true);
        setTimeout(() => {
            setLocation('/maze');
        }, duration+100)

    }

    return (
            <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
                {state => (
                    <div className={'foxContainer'} ref={nodeRef} style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                        <img className={'welcomeFox'} src={'img/foxy.svg'}/>
                        <img className={'downShape'} src={'img/shape-welcome.svg'}/>
                        <div className={'nextButton'} onClick={transitionPage}>Begin the adventure</div>
                    </div>
                )}
            </Transition>
    )
}

export default Home

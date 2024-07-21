import './App.css'
import Home from "./Home/Home.jsx";
import {Route, Switch, useLocation} from 'wouter';
import Maze from "./Maze/Maze.jsx";
import Reward from "./Reward/Reward.jsx";

function App() {
  return (
      <>
          <Switch>
              <Route path={'/'}>
                  <Home/>
              </Route>
              <Route path={'/maze'}>
                  <Maze initInProp={false}/>
              </Route>
              <Route path={'/reward'}>
                  <Reward initInProp={false}/>
              </Route>
              <Route>
                  <div>Nothing here</div>
              </Route>
          </Switch>
      </>
  )
}

export default App

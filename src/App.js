
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Surface } from "gl-react-dom";
import transitions from "gl-transitions"; // 动画库
import createTransition from "gl-transition";
import GLTransition from "react-gl-transition";
import sPic from './p1.jpg'
import ePic from './p2.jpg'
import v1 from './v1.mp4'
import v2 from './v2.mp4'
import './App.css';

const loadVideo = async ( url ) => {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.autoplay = true;
  video.src = url;

  return new Promise((res) => {
    video.onloadeddata = () => {
      video.autoplay = false;
      video.muted = false;
      video.height=160;
      video.width=90;
      res(video);
    };
  });
};

const TransitionCanvas=({from,to,progress,transition})=>{
  return <GLTransition from={from } to={to} progress={progress} transition={transition} ></GLTransition>
}
export default class App extends Component {
  constructor(){
    super()
    this.state={
      progress:0,
      animationType:10,
      to:'',
      from:'',
    }
  }
  componentDidMount=async ()=>{
    let c1=document.getElementById("c1")
    let c2=document.getElementById("c2")
    let ctx1=c1.getContext('2d')
    let ctx2=c2.getContext('2d')
    let video1=await loadVideo(v1)
    let video2=await loadVideo(v2)

    let d1=video1.duration;
    let d2=video2.duration;
    setInterval(() => {
      video1.currentTime+=0.1;
      video2.currentTime+=0.1;
      if(video1.currentTime===d1){
        video1.currentTime=0
      }
      if(video2.currentTime===d2){
        video2.currentTime=0
      }
      ctx1.drawImage(video1,0,0)
      ctx2.drawImage(video2,0,0)
      this.setState({
        progress:this.state.progress+0.1>1?0:this.state.progress+0.1,
        from:video1,
        to:video2
      })
    }, 100);
    

  }

  render() {
    return (
      <div >
        <Surface id="tc" width={640} height={320}>
          <TransitionCanvas  from={this.state.from} to={this.state.to} progress={this.state.progress} transition={transitions[this.state.animationType]} ></TransitionCanvas>
        </Surface>
       <input id="ipt" placeholder="0~62"></input>
       <button onClick={()=>{
        let index=parseInt(document.getElementById("ipt").value)
          if(index){
            this.setState({
              animationType:index
            })
          }
       }}>切换特效</button>
       <div>可选：{
         transitions.map((t,i)=>{
           return (<div>{i} {t.name}</div>)
         })
         }</div>
       <div><canvas id="c1" width={640} height={320}></canvas>
        <canvas id="c2" width={640} height={320}></canvas>
        </div>
        
        {/* <video id="video1"></video>
        <video id="video2"></video> */}
      </div>
    )
  }
}



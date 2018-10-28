import React, { Component } from 'react';
import "./App.css";
import "./RangeInput.css";
//import classNames from 'classnames';

let video = null;

class App extends Component {

  state = {
    rangeMax: 100,
    showVideoAnnotation: 'video',
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    videoSpeed: 1,
  }

  componentDidMount() {
    video = this.refs.video;
    video.addEventListener('timeupdate', this.timeUpdate);
    video.addEventListener('loadedmetadata', this.loadedMetaData);
  }

  /**
   * Event Listener used to update the range input
   */
  timeUpdate = () => {
    const currentTime = parseInt(video.currentTime, 10);
    let seeker = this.refs.seeker;
    seeker.value = currentTime;
    this.setState({currentTime})
  }

  /**
   * Event Listener for when the video has mete data avaliable to it.
   * 
   * Resets the range to the duration in seconds.
   */
  loadedMetaData = () => {
    const duration = parseInt(video.duration, 10);
    this.setState({rangeMax: duration, duration});
  }

  /**
   * Used to Play/Pause the video
   */
  playPause = () => {
    if(video.paused){
      video.play();
      this.setState({isPlaying: true});
    } else {
      video.pause();
      this.setState({isPlaying: false});
    }
  }

  /**
   * Updates the video to a new time
   * 
   * @param {*} event 
   */
  seekerChanged = (event) => {
    video.currentTime = parseInt(event.target.value, 10);
  }

  /**
   * Toggles the annotation/video screen
   */
  toggelAnnotation = () => {
    const {showVideoAnnotation} = this.state;
    if(showVideoAnnotation === 'video') {
      video.pause();
      this.setState({isPlaying: false});
      const videoViewer = this.refs.video;
      const height = videoViewer.offsetHeight;
      const width = videoViewer.offsetWidth;
      this.setState({showVideoAnnotation: 'annotation'});
      this.updateAnnotationCanvas(height, width);
    } else {
      this.setState({showVideoAnnotation: 'video'})
    }
  }

  /**
   * Updates canvas to the current frame
   * 
   * @param {int} height
   * @param {int} width
   */
  updateAnnotationCanvas = (height, width) => {
    const canvas = this.refs.annotationCanvas;
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d'); 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  /**
   * Changes the video speed.
   */
  changeVideoSpeed = () => {
    if(this.state.videoSpeed === 1) {
      video.playbackRate = 2;
      this.setState({videoSpeed: 2});
    } else {
      video.playbackRate = 1;
      this.setState({videoSpeed: 1});
    }
  }

  /**
   * Steps current currentTime back on second
   */
  stepBackSecond = () => {
    const newTime = this.state.currentTime - 1;
    this.setState({currentTime: newTime});
    video.currentTime = newTime
  }

  /**
   * Steps current currentTime forward on second
   */
  stepForwardSecond = () => {
    const newTime = this.state.currentTime + 1;
    this.setState({currentTime: newTime});
    video.currentTime = newTime
  }

  render() {
    const {rangeMax, showVideoAnnotation, isPlaying, duration, currentTime, videoSpeed} = this.state;

    return (
      <div className="App">
        <div className="video-area">
          <canvas ref="annotationCanvas" className={showVideoAnnotation === 'annotation' ? '' : 'hidden'}></canvas>
          <video ref="video" className={showVideoAnnotation === 'video' ? '' : 'hidden'}>
            <source src="http://localhost:3001/video" type="video/mp4" />
          </video>
          <div className="video-controls">
            <div className="marks">

            </div>
            <div className="seeker">
              <input type="range" ref="seeker" onChange={this.seekerChanged} className="scrubber" min="0" max={rangeMax} defaultValue="0" step="1" />
            </div>
            <div className="controls">
              <div className="speed">
                <button onClick={this.changeVideoSpeed} className={videoSpeed === 1 ? 'selected' : ''}>1x</button>
                <button onClick={this.changeVideoSpeed} className={videoSpeed === 2 ? 'selected' : ''}>2x</button>
              </div>
              <div className="play">
                <button onClick={this.stepBackSecond}><i class="fas fa-caret-left"></i></button>
                <button onClick={this.playPause} disabled={showVideoAnnotation === 'annotation'}>{ !isPlaying ? (<i class="fas fa-play"></i>) : (<i class="fas fa-pause"></i>)}</button>
                <button onClick={this.stepForwardSecond}><i class="fas fa-caret-right"></i></button>
              </div>
              <div className="time">
                { `${currentTime}/${duration} sec` }
              </div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="meta">
            <div className="form-group">
              <label>Category</label>
              <select className="form-control">
                <option>Sqaut</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub Category</label>
              <select className="form-control">
                <option>Sqaut</option>
              </select>
            </div>
            <div className="meta-buttons">
              <button className="btn btn-sm btn-secondary">Save</button>
            </div>
          </div>
          <div className="marks">
            <div className="mark-list">
              <ul className="list-group">
                <li className="list-group-item">Mark</li>
              </ul>
            </div>
            <div className="mark-buttons">
              <button className="btn btn-sm btn-secondary">Add Mark</button>
            </div>
          </div>
          <div className="video-annotate">
            <div className="buttons">
              <button className="btn btn-secondary btn-block" onClick={this.toggelAnnotation}>{showVideoAnnotation === 'video' ? 'Annotate' : 'Video'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

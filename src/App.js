import React, { Component } from 'react';
import "./App.css";
//import classNames from 'classnames';

let video = null;

class App extends Component {

  state = {
    rangeMax: 100,
    showVideoAnnotation: 'video',
    isPlaying: false,
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
    const currentTime = video.currentTime;
    let seeker = this.refs.seeker;
    seeker.value = currentTime;
  }

  /**
   * Event Listener for when the video has mete data avaliable to it.
   * 
   * Resets the range to the duration in seconds.
   */
  loadedMetaData = () => {
    const duration = video.duration;
    this.setState({rangeMax: duration});
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

  updateAnnotationCanvas = (height, width) => {
    const canvas = this.refs.annotationCanvas;
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d'); 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  render() {
    const {rangeMax, showVideoAnnotation, isPlaying} = this.state;

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
                <button>1x</button>
                <button>2x</button>
              </div>
              <div className="play">
                <button>Back</button>
                <button onClick={this.playPause} disabled={showVideoAnnotation === 'annotation'}>{ !isPlaying ? 'Play' : 'Pause'}</button>
                <button>Forward</button>
              </div>
              <div className="sizing">
                <button>large</button>
                <button>full-sreen</button>
              </div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="form-group">
            <label>Category</label>
            <select>
              <option>Sqaut</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sub Category</label>
            <select>
              <option>Sqaut</option>
            </select>
          </div>
          <div className="marks">
            <div className="mark-list">
              <ul>
                <li>Mark</li>
              </ul>
            </div>
            <div className="mark-buttons">
              <button>Add Mark</button>
            </div>
          </div>
          <div className="video-annotate">
            <div className="buttons">
              <button onClick={this.toggelAnnotation}>{showVideoAnnotation === 'video' ? 'Annotate' : 'Video'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

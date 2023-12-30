import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'

export default function UserVideoCard(props) {
  return (
    <div className='recipe-box'>
            <div className='recipe-card-img'>
            <ReactPlayer url={props?.data?.videoUrl} height="100%" width="100%" id="video" preload="metadata" light={<img width='100%' height='100%' src={props?.data?.videoThumbnail} alt='' />} controls/>
                {/* <video controls height="100%" width="100%" id="video" preload="metadata" style={{ borderRadius: '10px' }} poster="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/poster.jpg">
                    <source src="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4" type="video/mp4" />
                </video> */}
            </div>
            <div className='recipe-card-body'>
                <p className='text-dark mb-3 fw-600 fs-5 text-decoration-none d-block'>{props?.data?.videoTitle}</p>
            </div>
        </div>
  )
}

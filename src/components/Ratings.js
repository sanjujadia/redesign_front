import React from 'react';
import ReactStars from "react-rating-stars-component";

const BorderIcon = ({ className, borderSize }) => (
  <span
    className={`${className} border-icon`}
    style={{
      display: 'inline-block',
      border: `${borderSize}px solid #000`,
      borderRadius: '50%',
    }}
  >
    <i className={className}></i>
  </span>
);

const Ratings = (props) => {
  
  const ratingChanged = (newRating) => {
    console.log(newRating);
    props.callBack(newRating)
  };

  return (
    <div>
      <ReactStars
        count={5}
        onChange={ratingChanged}
        size={48}
        isHalf={true}
        activeColor="#ffd700"
        emptyIcon={<i class="far fa-star"></i>}
      />
    </div>
  );
}

export default Ratings;

import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const MultiSelect = (props) => {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(null);

  const handleChange = (selectedOption) => {
    // const index = tags.indexOf(tag => tag === selectedOption)
    console.log('selectedOption',selectedOption)
    setSelectedTags(selectedOption);
    props.handleChange(selectedOption)
  };
  

  useEffect(() => {
    if(props.data){
      const options = props.data.map(data => ({
        value: data,
        label: data,
      }));
      setTags(options)
    }
    if(props.value){
      const options = props.value.map(data => ({
        value: data,
        label: data,
      }));
      setSelectedTags(options)
    }
    
  },[props])
   
// console.log('tags', tags)
// console.log('selectedTags', selectedTags)
  return (
    <div>
        <Select className=''
      closeMenuOnSelect={false}
      components={animatedComponents}
      value={selectedTags}
      isMulti
      options={tags}
      onChange={handleChange}
    />
    </div>
  )
}

export default MultiSelect
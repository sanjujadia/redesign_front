import React from 'react'
import Chart from "react-apexcharts";
const SplineChart = ({data}) => {

    const series = [ //data on the y-axis
      {
        name: 'Visitors',
        data: data[1]
      }
    ];

  const options = { //data on the x-axis
    colors : ['#8DC63F'],
    chart: {
        height: 350,
        type: 'area',
        toolbar:{
            show: false,
        },
      },
      xaxis: {
        type: 'week',
        categories: data[0]
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      tooltip: {
        x: {
          format: 'year'
        },
      },
  };

  return (
    <div>
      <Chart style={{width:'100%'}}
        options={options}
        series={series}
        type="area"
        height={250}
        // width="300"
      />
    </div>
  )
}

export default SplineChart
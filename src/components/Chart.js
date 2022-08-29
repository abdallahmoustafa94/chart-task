import { useState,useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

 
  const Chart = () =>{
    const [chartData,setChartData] = useState([])
    
  

    useEffect(()=>{
      fetch(
        "data.json")
                    .then((res) => res.json())
                    .then((resData) => {
                       setChartData(resData)
                    })
    },[])
  
    //set the configuration of the chart.js library
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
  
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Stacked Chart Task',
        },
      },
      
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            callback: function(value, index, values) {
                if(parseInt(value) > 999){
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " SAR";
                } else if (parseInt(value) < -999) {
                    return  Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " -SAR";
                } else {
                    return  value +  " SAR";
                }
            }
        }
         
        },
      },
      scaleLabel:
    function(label){return  '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
    };

    const uniq = a => [...new Set(a)]
    const flatten = a => [].concat.apply([], a)

    // step 1: find the distinct months
    const months = chartData.map(e => e.month)

    // step 2: find the distinct labels
    const labels = uniq(
  flatten(chartData.map(e => e.data))
  .map(e => e.label))

  

 
  // step 3: map the labels to entries containing their data by searching the original data array
const result = labels.map(label => {
  return {
    label,
    data: months.map(month => {
    const hit = chartData?.find(e => e.month === month)
        .data
        ?.find(p => p.label === label)
      return (
        hit ?(hit.value  * 1000).toString()    : null        
      )
    }),
  }
})

console.log(result)

// set the background color for each label
const setBackground = (arr) => {
  for (var i = 0; i < arr.length; i++){
    if(arr[i].label == 'Rent'){
      arr[i].backgroundColor = '#7CB9E8'
    }
    if(arr[i].label == 'phone'){
      arr[i].backgroundColor = '#00308F'
    }
    if(arr[i].label == 'Advertising'){
      arr[i].backgroundColor = '#00FFFF'
    }
    if(arr[i].label == 'Office'){
      arr[i].backgroundColor = '#008E97'
    }
  }
}


// call setBackground function to add the background property to the data object
setBackground(result)


    const data = {
      labels : chartData.map(e => e.month),
     datasets : [...result]
    };

  
    return (
      <div style={{maxWidth:"70%",margin:"auto", marginTop:"6rem"}}>
      <Bar options={options} data={data} />
      </div>
    )
    
  }

  export default Chart
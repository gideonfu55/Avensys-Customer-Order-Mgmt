/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend, Title, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Chart as ChartJS, LineElement, PointElement, LineController, CategoryScale, LinearScale } from 'chart.js';

// ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale);
ChartJS.register(ArcElement, Legend, Title, CategoryScale, LinearScale, BarController, BarElement);

function POTrend() {

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Customer Order Status"
      },
      legend: {
        display: false,
        // position: 'bottom'
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value*100 / sum).toFixed(2)+"%";
          return percentage;
        },
        color: 'black',
        font: {
          size: 8.5,
          weight: 'bold'
        },
      }
    },
  };

  const [chartData, setChartData] = useState(null);
  const [activeChartElement, setActiveChartElement] = useState(null);
  const [currentStatusBarData, setCurrentStatusBarData] = useState(null);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/po/all")
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          const ongoing = data.filter(po => po.status.toLowerCase() === "ongoing").length;
          const completed = data.filter(po => po.status.toLowerCase() === "completed").length;
          const cancelled = data.filter(po => po.status.toLowerCase() === "cancelled").length;

          setChartData({
            labels: ['Ongoing', 'Completed', 'Cancelled'],
            datasets: [
              {
                label: 'Customer Order Status',
                data: [ongoing, completed, cancelled],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                ],
                borderWidth: 1,
              },
            ],
          });

          setCurrentStatusBarData({
            labels: ['Ongoing', 'Completed', 'Cancelled'],
            datasets: [
              {
                label: 'CurrentCustomer Order Status',
                data: [ongoing, completed, cancelled],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                ],
                borderWidth: 1,
              },
            ],
          });

        }
      })
      .catch(error => {
        console.error(`Error fetching POs: ${error}`);
      });
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  // Function to handle click on piechart to display data over a certain period in bar chart beside:
  const onChartClick = (event, elements) => {

    let label;
    let value;

    if (elements.length) {
      const { datasetIndex, index, chart } = elements[0];
      if (chart && chart.data) {
        const { labels, datasets } = chart.data;
        if (labels && datasets) {
          label = labels[index];
          value = datasets[datasetIndex].data[index];
          setActiveChartElement({ label, value });
        }
      }

      // Now fetch data for bar chart based on label:
      axios.get(`http://localhost:8080/api/po/all/Ongoing`)
        .then(response => {
          const data = response.data;
          // Get POs count for each day over the past 60 days
          const poCounts = Array.from({ length: 14 }, () => 0);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Months array

          console.log(poCounts)

          let labels = Array.from({ length: 14 }, (_, i) => {
            let d = new Date();
            d.setDate(currentDate.getDate() - i);
            return `${d.getDate()} ${monthNames[d.getMonth()]}`; // Return the date in 'DD MMM' format
          });
          labels = labels.reverse(); // Reverse the array to have older dates first

          if (Array.isArray(data)) {
            data.forEach(po => {
              const poDate = new Date(po.date);
              poDate.setHours(0, 0, 0, 0); // Clear the time component to make date comparisons accurate
              const diffDays = Math.floor((currentDate - poDate) / (1000 * 60 * 60 * 24));
              if (diffDays < 14) {
                poCounts[13 - diffDays] += 1;
              }
            });
          }

          setBarChartData({
            labels: labels,
            datasets: [{
              label: `${label} POs`,
              data: poCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          });
        }
      )
      .catch(error => {
        console.error(`Error fetching POs: ${error}`);
      });
    }
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{width: '250x', height: '250px'}}>
        <Doughnut
          data={chartData}
          options={{
            ...options,
            onClick: (event, elements) => {
              onChartClick(event, elements);
            },
          }}
          plugins={[ChartDataLabels]}
        />
      </div>

      <div id="chart-legend">
        <ul className='d-flex flex-wrap mt-2' style={{ listStyleType: 'none', width:'250px'}}>
          <li className='me-3'>
            <span style={{backgroundColor: 'rgba(75, 192, 192, 0.6)', borderRadius: '50%', display: 'inline-block', height: '9px', width: '9px', marginRight: '5px'}}></span>
            <span style={{fontSize: '12px'}}>Ongoing</span>
          </li>
          <li className='me-3'>
            <span style={{backgroundColor: 'rgba(255, 206, 86, 0.6)', borderRadius: '50%', display: 'inline-block', height: '9px', width: '9px', marginRight: '5px'}}></span>
            <span style={{fontSize: '12px'}}>Completed</span>
          </li>
          <li className='me-3'>
            <span style={{backgroundColor: 'rgba(54, 162, 235, 0.6)', borderRadius: '50%', display: 'inline-block', height: '9px', width: '9px', marginRight: '5px'}}></span>
            <span style={{fontSize: '12px'}}>Cancelled</span>
          </li>
        </ul>
      </div>

      {barChartData && barChartData.datasets.length > 0 && (
        <div style={{width: '500px', height: '250px'}}>
          <Bar key={JSON.stringify(barChartData)} data={barChartData} />
        </div>
      )}

      {currentStatusBarData && (
        <div style={{width: '500px', height: '250px'}}>
          <Bar data={currentStatusBarData} />
        </div>
      )}

    </div>
  )
}

export default POTrend
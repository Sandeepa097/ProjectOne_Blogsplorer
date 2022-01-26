const returnedObj = {
    label: "",
    value: "",
    percentage: "",
    increase: null,
    decrease: null,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "6", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "",
        borderColor: "",
        data: []
      }
    ]
  }

const getGraphData = (label, value, datasets, noDataMsg ) => {
    returnedObj.label = label
    returnedObj.value = value
    returnedObj.increase = datasets.data[5] > datasets.data[4]
    returnedObj.decrease = datasets.data[5] < datasets.data[4]
    if(!datasets.data[4]) {
        returnedObj.percentage = noDataMsg
    }
    else{
        let value = Math.abs((datasets.data[5] - datasets.data[4]) * 100 / datasets.data[4])
        returnedObj.percentage = `${value.toFixed(2)}%`
    }

    returnedObj.datasets = [{...returnedObj.datasets[0], 
      backgroundColor: datasets.backgroundColor,
      borderColor: datasets.borderColor,
      data: datasets.data
    }]

    return returnedObj;
}

module.exports = {getGraphData}